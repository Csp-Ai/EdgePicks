import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { loadFlow } from '@/lib/flow/loadFlow';
import { registry, type AgentName } from '@/lib/agents/registry';
import { logUiEvent } from '@/lib/logUiEvent';
import mockData from '../../__mocks__/run-agents.json';
import type { AgentOutputs, Matchup, AgentResult } from '@/lib/types';
import { fetchSchedule, type League } from '@/lib/data/schedule';
import { ENV } from '@/lib/env';
import { supabase } from '@/lib/supabaseClient';

let CACHE_TTL_SECONDS = parseInt(
  process.env.RUN_AGENTS_CACHE_TTL_SECONDS || '60',
  10,
);

interface CacheEntry {
  value: any;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry>();
let hits = 0;
let misses = 0;

setInterval(() => {
  const total = hits + misses;
  const hitRate = total ? hits / total : 0;
  console.info({ hits, misses, hitRate });
}, 5 * 60 * 1000).unref();

export function __clearRunAgentsCache() {
  memoryCache.clear();
  hits = 0;
  misses = 0;
}

export function __setRunAgentsCacheTtl(seconds: number) {
  CACHE_TTL_SECONDS = seconds;
}

export function purgeRunAgentsCache({
  key,
  prefix,
}: {
  key?: string;
  prefix?: string;
}) {
  for (const k of Array.from(memoryCache.keys())) {
    if (key && k !== key) continue;
    if (prefix && !k.startsWith(prefix)) continue;
    memoryCache.delete(k);
  }
}

function buildCacheKey(league: string, gameId: string, agents: AgentName[]) {
  return `${league}:${gameId}:${agents.sort().join(',')}`;
}

async function getCachedResponse(key: string) {
  const now = Date.now();
  const entry = memoryCache.get(key);
  if (entry && entry.expiresAt > now) {
    hits += 1;
    return { value: entry.value, cached: true };
  }
  misses += 1;
  try {
    const { data, error } = await supabase
      .from('prediction_cache')
      .select('value, expires_at')
      .eq('key', key)
      .single();
    if (!data || error) return { value: null, cached: false };
    const exp = new Date(data.expires_at).getTime();
    if (exp < now) return { value: null, cached: false };
    memoryCache.set(key, { value: data.value, expiresAt: exp });
    return { value: data.value, cached: true };
  } catch (err) {
    console.error('cache fetch error', err);
    return { value: null, cached: false };
  }
}

async function setCachedResponse(key: string, value: any) {
  const expiresAt = Date.now() + CACHE_TTL_SECONDS * 1000;
  memoryCache.set(key, { value, expiresAt });
  try {
    await supabase
      .from('prediction_cache')
      .upsert({ key, value, expires_at: new Date(expiresAt).toISOString() });
  } catch (err) {
    console.error('cache store error', err);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const { homeTeam, awayTeam, week } = req.query;
    if (!homeTeam || !awayTeam || !week) {
      res.status(400).json({ error: 'homeTeam, awayTeam and week required' });
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // @ts-ignore flushHeaders for compat
    res.flushHeaders?.();

    const matchup: Matchup = {
      homeTeam: String(homeTeam),
      awayTeam: String(awayTeam),
      league: 'NFL',
      matchDay: parseInt(String(week), 10),
      time: new Date().toISOString(),
    };

    try {
      const { runFlow } = await import('@/lib/flow/runFlow');
      const flow = await loadFlow('football-pick');
      const agentList: AgentName[] = flow.agents as AgentName[];

      const scores: Record<string, number> = {
        [matchup.homeTeam]: 0,
        [matchup.awayTeam]: 0,
      };

      const { outputs } = await runFlow(
        { ...flow, agents: agentList },
        matchup,
        (exec) => {
          const meta = registry.find((a) => a.name === exec.name);
          if (exec.result && meta) {
            scores[exec.result.team] += exec.result.score * meta.weight;
          }
          res.write(
            'data: ' +
              JSON.stringify({
                type: 'agent',
                name: exec.name,
                result: exec.result,
                error: exec.error,
                weight: meta?.weight,
                scoreTotal: exec.scoreTotal,
                confidenceEstimate: exec.confidenceEstimate,
                agentDurationMs: exec.agentDurationMs,
                sessionId: exec.sessionId,
                description: meta?.description,
              }) +
              '\n\n',
          );
        },
        (event) => {
          res.write(
            'data: ' +
              JSON.stringify({ type: 'lifecycle', ...event }) +
              '\n\n',
          );
        }
      );

      const pick =
        scores[matchup.homeTeam] >= scores[matchup.awayTeam]
          ? matchup.homeTeam
          : matchup.awayTeam;
      const finalConfidence = Math.max(
        scores[matchup.homeTeam],
        scores[matchup.awayTeam]
      );

      res.write(
        'data: ' +
          JSON.stringify({
            type: 'summary',
            matchup,
            agents: outputs as AgentOutputs,
            pick: {
              winner: pick,
              confidence: finalConfidence,
              topReasons: Object.values(outputs)
                .filter((o): o is AgentResult => Boolean(o))
                .map((o) => o.reason)
                .slice(0, 3),
            },
            loggedAt: new Date().toISOString(),
          }) +
          '\n\n',
      );
      res.end();
    } catch (err: any) {
      res.write(
        'data: ' +
          JSON.stringify({
            type: 'error',
            message: err?.message || 'Failed to run agents',
          }) +
          '\n\n',
      );
      res.end();
    }
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end('Method Not Allowed');
    return;
  }

  const liveMode = ENV?.LIVE_MODE ?? 'off';

  if (liveMode === 'on') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ error: 'auth_required' });
      return;
    }
  }

  const { league, gameId, agents: agentFilter } = req.body || {};
  if (!league) {
    res.status(400).json({ error: 'league required' });
    return;
  }

  void logUiEvent('apiRunAgents', {
    league,
    gameId,
    live: liveMode !== 'off',
  });

  if (liveMode !== 'on') {
    res.status(200).json(mockData);
    return;
  }

  try {
    if (!process.env.MAX_FLOW_CONCURRENCY) {
      process.env.MAX_FLOW_CONCURRENCY = '5';
    }
    if (!process.env.PREDICTION_CACHE_TTL_SEC) {
      process.env.PREDICTION_CACHE_TTL_SEC = '300';
    }

    const { runFlow } = await import('@/lib/flow/runFlow');

    const flow = await loadFlow('football-pick');
    const agentList: AgentName[] = Array.isArray(agentFilter) && agentFilter.length
      ? (agentFilter as AgentName[])
      : (flow.agents as AgentName[]);

    let matchup: Matchup | undefined;
    if (gameId) {
      const schedule = await fetchSchedule((league as string).toUpperCase() as League);
      matchup = schedule.find((g) => g.gameId === gameId);
    }

    if (!matchup) {
      res.status(400).json({ error: 'game not found' });
      return;
    }

    const cacheKey = buildCacheKey(league, gameId, agentList);
    const { value: cachedValue, cached: fromCache } = await getCachedResponse(
      cacheKey,
    );
    if (cachedValue) {
      const resp =
        process.env.NODE_ENV === 'development' && fromCache
          ? { ...cachedValue, _cached: true }
          : cachedValue;
      res.status(200).json(resp);
      return;
    }

    const { outputs } = await runFlow({ ...flow, agents: agentList }, matchup);

    const scores: Record<string, number> = {
      [matchup.homeTeam]: 0,
      [matchup.awayTeam]: 0,
    };

    agentList.forEach((name) => {
      const meta = registry.find((a) => a.name === name);
      const result = outputs[name];
      if (!meta || !result) return;
      scores[result.team] += result.score * meta.weight;
    });

    const pick =
      scores[matchup.homeTeam] >= scores[matchup.awayTeam]
        ? matchup.homeTeam
        : matchup.awayTeam;
    const finalConfidence = Math.max(
      scores[matchup.homeTeam],
      scores[matchup.awayTeam],
    );

    const response = { pick, finalConfidence, agents: outputs as AgentOutputs };
    await setCachedResponse(cacheKey, response);
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to run agents' });
  }
}

