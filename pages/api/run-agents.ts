import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { registry, type AgentName } from '../../lib/agents/registry';
import { AgentOutputs, Matchup, PickSummary } from '../../lib/types';
import { logToSupabase } from '../../lib/logToSupabase';
import { loadFlow } from '../../lib/flow/loadFlow';
import { runFlow } from '../../lib/flow/runFlow';
import { ENV } from '../../lib/env';
import mockData from '../../__mocks__/run-agents.json';
import { authOptions } from './auth/[...nextauth]';
import crypto from 'crypto';
import { logEvent } from '../../lib/server/logEvent';


export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (ENV.LIVE_MODE !== 'on') {
    res.status(200).json(mockData);
    return;
  }

  if (process.env.NEXT_PUBLIC_MOCK_AUTH !== '1') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
  }

  const { homeTeam, awayTeam, week, sessionId } = req.query;
  if (
    typeof homeTeam !== 'string' ||
    typeof awayTeam !== 'string' ||
    typeof week !== 'string'
  ) {
    res.status(400).json({ error: 'homeTeam, awayTeam, and week query params are required' });
    return;
  }

  const weekNum = parseInt(week, 10);
  if (isNaN(weekNum)) {
    res.status(400).json({ error: 'week must be a number' });
    return;
  }

  const flow = await loadFlow('football-pick');

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  // @ts-ignore
  res.flushHeaders?.();

  const matchup: Matchup = {
    homeTeam,
    awayTeam,
    matchDay: weekNum,
    time: '',
    league: '',
  };

  let outputs: Partial<AgentOutputs>;
  try {
    const result = await runFlow(flow, matchup);
    outputs = result.outputs;
  } catch (err: any) {
    res.write(
      `data: ${JSON.stringify({ type: 'error', message: err.message || 'runFlow failed' })}\n\n`
    );
    res.end();
    return;
  }

  const scores: Record<string, number> = { [homeTeam]: 0, [awayTeam]: 0 };
  flow.agents.forEach((name) => {
    const meta = registry.find((a) => a.name === (name as AgentName));
    const result = outputs[name];
    if (!meta || !result) return;
    scores[result.team] += result.score * meta.weight;
  });

  const winner = scores[homeTeam] >= scores[awayTeam] ? homeTeam : awayTeam;
  const confidence = Math.max(scores[homeTeam], scores[awayTeam]);
  const topReasons = flow.agents
    .map((name) => outputs[name]?.reason)
    .filter((r): r is string => Boolean(r));

  const pickSummary: PickSummary = {
    winner,
    confidence,
    topReasons,
  };

  await logEvent(
    'run-agents',
    { homeTeam, awayTeam, week: weekNum },
    { requestId: req.headers['x-request-id']?.toString() || crypto.randomUUID() }
  );

  const loggedAt = logToSupabase(
    matchup,
    outputs as AgentOutputs,
    pickSummary,
    null,
    flow.name
  );

  res.write(
    `data: ${JSON.stringify({
      type: 'summary',
      sessionId,
      matchup,
      agents: outputs,
      pick: pickSummary,
      loggedAt,
    })}\n\n`
  );
  res.end();
}

