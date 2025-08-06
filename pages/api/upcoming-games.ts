import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import {
  fetchNbaGames,
  fetchMlbGames,
  fetchNflGames,
  fetchNhlGames,
} from '../../lib/data/liveSports';
import { runFlow, AgentExecution } from '../../lib/flow/runFlow';
import { agents as registry } from '../../lib/agents/registry';
import type { AgentOutputs, PickSummary } from '../../lib/types';
import { logToSupabase } from '../../lib/logToSupabase';
import { getFallbackMatchups } from '../../lib/utils/fallbackMatchups';
import { hasSportsDbKey } from '../../lib/env';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const missingEnv = ['SPORTS_DB_API_KEY'].filter((key) => !process.env[key]);
  if (missingEnv.length) {
    console.warn(`Missing required env vars: ${missingEnv.join(', ')}`);
  }
  if (!process.env.SPORTS_DB_API_KEY && process.env.NODE_ENV === 'development') {
    console.warn('[Dev Warning] Using mock data. Add SPORTS_DB_API_KEY to .env.local');
  }
  if (!hasSportsDbKey) {
    console.warn('Sports API key missing. Add it to `.env.local` to enable live games.');
    try {
      const mockPath = path.join(process.cwd(), 'mock', 'upcoming-games.json');
      const raw = await fs.promises.readFile(mockPath, 'utf-8');
      const mock = JSON.parse(raw);
      res.setHeader('x-missing-api-key', '1');
      res.status(200).json(mock);
    } catch (err) {
      res.setHeader('x-missing-api-key', '1');
      res.status(200).json(getFallbackMatchups());
    }
    return;
  }
  try {
    const leagueParam =
      typeof req.query.league === 'string' ? req.query.league.toUpperCase() : 'NFL';

    const fetchMap = {
      NFL: fetchNflGames,
      MLB: fetchMlbGames,
      NBA: fetchNbaGames,
      NHL: fetchNhlGames,
    } as const;

    const fetchFn = fetchMap[leagueParam as keyof typeof fetchMap] || fetchMap.NFL;

    let games = await fetchFn();
    if (!games.length) {
      games = getFallbackMatchups();
    }
    const agentList = ['injuryScout', 'lineWatcher', 'statCruncher', 'guardianAgent'] as const;
    type Result = {
      homeTeam: { name: string; logo?: string };
      awayTeam: { name: string; logo?: string };
      confidence: number;
      history?: number[];
      time: string;
      league: string;
      odds?: {
        spread?: number;
        overUnder?: number;
        moneyline?: { home?: number; away?: number };
        bookmaker?: string;
        lastUpdate?: string;
      };
      source?: string;
      useFallback?: boolean;
      winner: string;
      edgeDelta: number;
      confidenceDrop: number;
      publicLean?: number;
      agentDelta?: number;
      disagreements: string[];
      edgePick: AgentExecution[];
    };

    const results: Result[] = (
      await Promise.all(
        games.map(async (game): Promise<Result | null> => {
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

            logToSupabase(
              { ...game },
              outputs as AgentOutputs,
              pickSummary,
              null,
              'upcoming-games',
              true
            );

            return {
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
            };
          } catch (err) {
            console.error('agent run failed', err);
            return null;
          }
        })
      )
    ).filter((r): r is Result => Boolean(r));

    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching upcoming games:', err);
    res.status(500).json({ error: 'Failed to fetch upcoming games' });
  }
}

