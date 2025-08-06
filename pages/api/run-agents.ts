import type { NextApiRequest, NextApiResponse } from 'next';
import { agents } from '../../lib/agents/registry';
import { AgentOutputs, Matchup, PickSummary } from '../../lib/types';
import { logToSupabase } from '../../lib/logToSupabase';
import { lifecycleAgent } from '../../lib/agents/lifecycleAgent';
import { loadFlow } from '../../lib/flow/loadFlow';
import { runFlow } from '../../lib/flow/runFlow';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { teamA, teamB, matchDay, flow: flowNameParam } = req.query;

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

  const matchup: Matchup = {
    homeTeam: teamA,
    awayTeam: teamB,
    matchDay: matchDayNum,
    time: '',
    league: '',
  };

  const flowName = typeof flowNameParam === 'string' ? flowNameParam : 'football-pick';
  const flow = await loadFlow(flowName);

  const agentsOutput: Partial<AgentOutputs> = {};

  const { outputs } = await runFlow(
    flow,
    matchup,
    ({ name, result, error }) => {
      if (!error && result) {
        agentsOutput[name] = result;
        res.write(
          `data: ${JSON.stringify({
            type: 'agent',
            name,
            result,
            warnings: result.warnings,
          })}\n\n`
        );
      } else {
        res.write(`data: ${JSON.stringify({ type: 'agent', name, error: true })}\n\n`);
      }
      // @ts-ignore - flush may not exist in some environments
      res.flush?.();
    },
    (event) => {
      lifecycleAgent(event, matchup);
      res.write(`data: ${JSON.stringify({ type: 'lifecycle', ...event })}\n\n`);
      // @ts-ignore - flush may not exist in some environments
      res.flush?.();
    }
  );

  Object.assign(agentsOutput, outputs);

  const scores: Record<string, number> = { [teamA]: 0, [teamB]: 0 };
  flow.agents.forEach((name) => {
    const meta = agents.find((a) => a.name === name);
    const result = agentsOutput[name];
    if (!meta || !result) return;
    scores[result.team] += result.score * meta.weight;
  });

  const winner = scores[teamA] >= scores[teamB] ? teamA : teamB;
  const confidence = Math.max(scores[teamA], scores[teamB]);
  const topReasons = flow.agents
    .map((name) => agentsOutput[name]?.reason)
    .filter((r): r is string => Boolean(r));

  const pickSummary: PickSummary = {
    winner,
    confidence,
    topReasons,
  };

  const loggedAt = logToSupabase(
    matchup,
    agentsOutput as AgentOutputs,
    pickSummary,
    null, // Optional actualWinner for future expansion
    flowName
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


