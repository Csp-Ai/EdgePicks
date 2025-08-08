import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { loadFlow } from '../../lib/flow/loadFlow';
import { registry, type AgentName } from '../../lib/agents/registry';
import { logUiEvent } from '../../lib/logUiEvent';
import mockData from '../../__mocks__/run-agents.json';
import type { AgentOutputs, Matchup } from '../../lib/types';
import { fetchSchedule, type League } from '../../lib/data/schedule';
import { ENV } from '../../lib/env';
import { supabase } from '../../lib/supabaseClient';

const CACHE_TTL_SECONDS = 60;

interface CacheEntry {
  value: any;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry>();

export function __clearRunAgentsCache() {
  memoryCache.clear();
}

function buildCacheKey(league: string, gameId: string, agents: AgentName[]) {
  return `${league}:${gameId}:${agents.sort().join(',')}`;
}

async function getCachedResponse(key: string) {
  const now = Date.now();
  const entry = memoryCache.get(key);
  if (entry && entry.expiresAt > now) return entry.value;
  try {
    const { data, error } = await supabase
      .from('prediction_cache')
      .select('value, expires_at')
      .eq('key', key)
      .single();
    if (!data || error) return null;
    const exp = new Date(data.expires_at).getTime();
    if (exp < now) return null;
    memoryCache.set(key, { value: data.value, expiresAt: exp });
    return data.value;
  } catch (err) {
    console.error('cache fetch error', err);
    return null;
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
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
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

    const { runFlow } = await import('../../lib/flow/runFlow');

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
    const cached = await getCachedResponse(cacheKey);
    if (cached) {
      res.status(200).json(cached);
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

