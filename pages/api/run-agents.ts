import type { NextApiRequest, NextApiResponse } from 'next';
import { agents } from '../../lib/agents/registry';
import { AgentOutputs, Matchup, PickSummary } from '../../lib/types';
import { logToSupabase } from '../../lib/logToSupabase';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { teamA, teamB, matchDay } = req.query;

  if (typeof teamA !== 'string' || typeof teamB !== 'string' || typeof matchDay !== 'string') {
    res.status(400).json({ error: 'teamA, teamB, and matchDay query params are required' });
    return;
  }

  const matchDayNum = parseInt(matchDay, 10);
  if (isNaN(matchDayNum)) {
    res.status(400).json({ error: 'matchDay must be a number' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  // @ts-ignore - flush may not exist in some environments
  res.flushHeaders?.();

  const matchup: Matchup = { homeTeam: teamA, awayTeam: teamB, matchDay: matchDayNum };

  const agentsOutput: Partial<AgentOutputs> = {};

  await Promise.all(
    agents.map(async (a) => {
      const result = await a.run(matchup);
      agentsOutput[a.name] = result;
      res.write(`data: ${JSON.stringify({ type: 'agent', name: a.name, result })}\n\n`);
      // @ts-ignore - flush may not exist in some environments
      res.flush?.();
    })
  );

  const scores: Record<string, number> = { [teamA]: 0, [teamB]: 0 };
  agents.forEach(({ name, weight }) => {
    const result = agentsOutput[name]!;
    scores[result.team] += result.score * weight;
  });

  const winner = scores[teamA] >= scores[teamB] ? teamA : teamB;
  const confidence = Math.max(scores[teamA], scores[teamB]);
  const topReasons = agents.map(({ name }) => agentsOutput[name]!.reason);

  const pickSummary: PickSummary = {
    winner,
    confidence,
    topReasons,
  };

  const loggedAt = await logToSupabase(
    matchup,
    agentsOutput as AgentOutputs,
    pickSummary,
    null
  );

  res.write(
    `data: ${JSON.stringify({
      type: 'summary',
      matchup,
      agents: agentsOutput,
      pick: pickSummary,
      loggedAt,
    })}\n\n`
  );
  res.end();
}

