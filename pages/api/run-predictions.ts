import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import crypto from 'crypto';
import { authOptions } from './auth/[...nextauth]';
import { loadFlow } from '../../lib/flow/loadFlow';
import { runFlow, AgentExecution } from '../../lib/flow/runFlow';
import { registry } from '../../lib/agents/registry';
import type { AgentMeta, AgentName } from '../../lib/agents/registry';
import { ENV } from '../../lib/env';
import { getDynamicWeights } from '../../lib/weights';

import type { Matchup, AgentOutputs, PickSummary } from '../../lib/types';
import { logToSupabase } from '../../lib/logToSupabase';
import { logEvent } from '../../lib/server/logEvent';

interface Game {
  homeTeam: { name: string };
  awayTeam: { name: string };
  time: string;
}

interface Prediction {
  game: Game;
  winner: string;
  confidence: number;
  agents: AgentOutputs;
  agentScores: Record<string, number>;
  executions: AgentExecution[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { league, games } = req.body || {};
  if (!league) {
    res.status(400).json({ error: 'league required' });
    return;
  }

  const agentMetaMap = new Map<AgentName, AgentMeta>(
    registry.map((a) => [a.name as AgentName, a])
  );

  try {
    const flow = await loadFlow('football-pick');
    const baseWeights = Object.fromEntries(
      registry.map((a) => [a.name, a.weight])
    );
    const weightsUsed =
      ENV.WEIGHTS_DYNAMIC === 'on'
        ? { ...baseWeights, ...(await getDynamicWeights()) }
        : baseWeights;
    const predictions: Prediction[] = [];
    const aggregatedAgentScores: Record<string, number> = {};

    for (const g of games || []) {
      const matchup: Matchup = {
        homeTeam: g.homeTeam.name,
        awayTeam: g.awayTeam.name,
        time: g.time,
        league,
      };

      const { outputs, executions } = await runFlow(flow, matchup);

      const scores: Record<string, number> = {
        [matchup.homeTeam]: 0,
        [matchup.awayTeam]: 0,
      };

      const agentScores: Record<string, number> = {};
      for (const name of flow.agents) {
        const meta = agentMetaMap.get(name as AgentName);
        const result = outputs[name];
        if (!meta || !result) continue;
        const weight = weightsUsed[name] ?? meta.weight;
        scores[result.team] += result.score * weight;
        agentScores[name] = result.score;
        aggregatedAgentScores[name] =
          (aggregatedAgentScores[name] || 0) + result.score;
      }

      const winner =
        scores[matchup.homeTeam] >= scores[matchup.awayTeam]
          ? matchup.homeTeam
          : matchup.awayTeam;
      const confidence = Math.max(
        scores[matchup.homeTeam],
        scores[matchup.awayTeam]
      );

      const topReasons = flow.agents
        .map((name) => outputs[name]?.reason)
        .filter((r): r is string => Boolean(r));
      const pickSummary: PickSummary = {
        winner,
        confidence,
        topReasons,
      };

      logToSupabase(matchup, outputs as AgentOutputs, pickSummary, null, 'run-predictions');

      predictions.push({
        game: g,
        winner,
        confidence: Math.round(confidence * 100),
        agents: outputs as AgentOutputs,
        agentScores,
        executions,
      });
    }

    const agentScores: Record<string, number> = {};
    const total = predictions.length || 1;
    Object.entries(aggregatedAgentScores).forEach(([name, score]) => {
      agentScores[name] = score / total;
    });

    const timestamp = new Date().toISOString();

    if ((games || []).some((g: any) => g.useFallback || g.source === 'fallback')) {
      console.warn('Mock data is being used for predictions.');
    }

    await logEvent(
      'run-predictions',
      { league },
      {
        requestId: req.headers['x-request-id']?.toString() || crypto.randomUUID(),
        userId: (session.user as any)?.id || (session.user as any)?.email || undefined,
      }
    );

    res
      .status(200)
      .json({
        predictions,
        agentScores,
        weightsUsed,
        timestamp,
        cacheVersion: ENV.FLOW_CACHE_VERSION,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to run predictions' });
  }
}
