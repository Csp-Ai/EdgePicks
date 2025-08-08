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
  const isMockAuth = process.env.NEXT_PUBLIC_MOCK_AUTH === '1';

  if (liveMode !== 'off' && !isMockAuth) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ error: 'Unauthorized' });
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

    res.status(200).json({ pick, finalConfidence, agents: outputs as AgentOutputs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to run agents' });
  }
}

