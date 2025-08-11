import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchSchedule, type League } from '@/lib/data/schedule';
import { fetchOdds, type OddsGame } from '@/lib/data/odds';
import { runFlow, AgentExecution } from '@/lib/flow/runFlow';
import { registry } from '@/lib/agents/registry';
import type { AgentOutputs, PickSummary } from '@/lib/types';
import type { PublicPrediction } from '@/lib/types/public';
import { PublicPredictionListSchema } from '@/lib/schemas/public';
import { logMatchup } from '@/lib/logToSupabase';
import { getFallbackMatchups } from '@/lib/utils/fallbackMatchups';
import { formatKickoff } from '@/lib/utils/formatKickoff';
import pLimit from 'p-limit';

const CONCURRENCY_LIMIT = 3;
const CACHE_TTL_MS = 60_000; // cache results for one minute

type Result = {
  gameId: string;
  homeTeam: { name: string; logo?: string };
  awayTeam: { name: string; logo?: string };
  confidence: number;
  history?: number[];
  time: string;
  league: string;
  odds: {
    spread?: number;
    overUnder?: number;
    moneyline?: { home?: number; away?: number };
    bookmaker?: string;
    lastUpdate?: string;
  } | null;
  source?: string;
  useFallback?: boolean;
  winner: string;
  edgeDelta: number;
  confidenceDrop: number;
  publicLean?: number;
  agentDelta?: number;
  disagreements: string[];
  edgePick: AgentExecution[];
  kickoffDisplay: string;
};

type LeagueCacheEntry = { results: PublicPrediction[]; timestamp: number };
const leagueCache = new Map<string, LeagueCacheEntry>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const leagueParam: League =
      typeof req.query.league === 'string'
        ? (req.query.league.toUpperCase() as League)
        : 'NFL';

    const cacheKey = `${leagueParam}-${Math.floor(Date.now() / CACHE_TTL_MS)}`;
    const cached = leagueCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      res.status(200).json(cached.results);
      return;
    }

    let games = await fetchSchedule(leagueParam);
    const oddsData: OddsGame[] = await fetchOdds(leagueParam);

    const oddsMap = new Map<string, OddsGame>();
    oddsData.forEach((o) => {
      const key = [o.home_team, o.away_team].sort().join(':');
      oddsMap.set(key, o);
    });

    games = games.map((g) => {
      const key = [g.homeTeam, g.awayTeam].sort().join(':');
      const gameOdds = oddsMap.get(key);
      let odds: Result['odds'] = null;
      if (gameOdds) {
        const bookmaker = gameOdds.bookmakers?.[0];
        const spreads = bookmaker?.markets?.find((m) => m.key === 'spreads')?.outcomes;
        const totals = bookmaker?.markets?.find((m) => m.key === 'totals')?.outcomes;
        const h2h = bookmaker?.markets?.find((m) => m.key === 'h2h')?.outcomes;
        if (bookmaker && h2h) {
          odds = {
            spread: spreads?.find((o) => o.name === g.homeTeam)?.point ?? undefined,
            overUnder: totals?.[0]?.point ?? undefined,
            moneyline: {
              home: h2h.find((o) => o.name === g.homeTeam)?.price ?? undefined,
              away: h2h.find((o) => o.name === g.awayTeam)?.price ?? undefined,
            },
            bookmaker: bookmaker.title,
            lastUpdate: bookmaker.last_update,
          };
        }
      }
      return { ...g, odds };
    });
    games.sort((a, b) => {
      const t = new Date(a.time).getTime() - new Date(b.time).getTime();
      if (t !== 0) return t;
      const aId = a.gameId ?? '';
      const bId = b.gameId ?? '';
      return aId.localeCompare(bId);
    });
    if (!games.length) {
      games = getFallbackMatchups();
    }
    const agentList = ['injuryScout', 'lineWatcher', 'statCruncher', 'guardianAgent'] as const;

    const limit = pLimit(CONCURRENCY_LIMIT);
    const results = (
      await Promise.all(
        games.map((game) =>
          limit(async (): Promise<Result | null> => {
            if (!game.homeTeam || !game.awayTeam) return null;
            try {
              const { outputs, executions } = await runFlow(
                { name: 'upcoming', agents: [...agentList] },
                { ...game, isLiveData: game.source !== 'fallback', source: game.source }
              );

              const scores: Record<string, number> = {
                [game.homeTeam]: 0,
                [game.awayTeam]: 0,
              };

              agentList.forEach((name) => {
                const meta = registry.find((a) => a.name === name);
                const result = outputs[name];
                if (!meta || !result) return;
                scores[result.team] += result.score * meta.weight;
              });

              const winner =
                scores[game.homeTeam] >= scores[game.awayTeam] ? game.homeTeam : game.awayTeam;
              const confidenceRaw = Math.max(scores[game.homeTeam], scores[game.awayTeam]);
              const confidence = Math.round(confidenceRaw * 100);
              const edgeDelta = Math.abs(scores[game.homeTeam] - scores[game.awayTeam]);
              const confidenceDrop = 1 - confidenceRaw;
              const publicLean = (() => {
                const home = game.odds?.moneyline?.home;
                const away = game.odds?.moneyline?.away;
                if (home !== undefined && away !== undefined) {
                  const total = Math.abs(home) + Math.abs(away);
                  return total ? Math.round((Math.abs(home) / total) * 100) : undefined;
                }
                return undefined;
              })();
              const agentDelta =
                game.odds?.spread !== undefined ? edgeDelta - game.odds.spread : undefined;
              const disagreements = executions
                .filter((e) => e.result && e.result.team !== winner)
                .map((e) => e.name);
              const topReasons = agentList
                .map((name) => outputs[name]?.reason)
                .filter((r): r is string => Boolean(r));

              const pickSummary: PickSummary = { winner, confidence: confidenceRaw, topReasons };

              if (typeof logMatchup === 'function') {
                logMatchup(
                  { ...game },
                  outputs as AgentOutputs,
                  pickSummary,
                  null,
                  'upcoming-games',
                  true
                );
              }

              const sanitize = (s: string) => s.replace(/\s+/g, '-');
              const derivedId =
                game.gameId ||
                `${sanitize(game.league)}:${sanitize(game.homeTeam)}:${sanitize(
                  game.awayTeam
                )}:${new Date(game.time).getTime()}`;

              const result: Result = {
                gameId: derivedId,
                homeTeam: { name: game.homeTeam, logo: game.homeLogo },
                awayTeam: { name: game.awayTeam, logo: game.awayLogo },
                confidence,
                time: game.time,
                league: game.league,
                odds: game.odds,
                source: game.source,
                useFallback: game.useFallback,
                winner,
                edgeDelta,
                confidenceDrop,
                publicLean,
                agentDelta,
                disagreements,
                edgePick: executions,
                kickoffDisplay: game.kickoffDisplay ?? formatKickoff(game.time),
              };
              return result;
            } catch (err) {
              console.error('agent run failed', err);
              return null;
            }
          })
        )
      )
    ).filter((r): r is Result => Boolean(r));
    results.sort((a, b) => {
      const t = new Date(a.time).getTime() - new Date(b.time).getTime();
      if (t !== 0) return t;
      return a.gameId.localeCompare(b.gameId);
    });

    const out: PublicPrediction[] = results.map((r) => ({
      gameId: r.gameId,
      league: r.league,
      home: r.homeTeam.name,
      away: r.awayTeam.name,
      kickoffISO: new Date(r.time).toISOString(),
      confidence: r.confidence / 100,
      disagreement: r.disagreements.length > 0,
    }));

    PublicPredictionListSchema.parse(out);
    leagueCache.set(cacheKey, { results: out, timestamp: Date.now() });
    res.status(200).json(out);
  } catch (err) {
    console.error('Error fetching upcoming games:', err);
    if (err instanceof Error && err.message.includes('RATE_LIMIT')) {
      res.status(429).json({ error: 'Upstream rate limit, please retry later' });
    } else {
      res.status(500).json({ error: 'Failed to fetch upcoming games' });
    }
  }
}

