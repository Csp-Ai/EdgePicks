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
  const { homeTeam, awayTeam, week, flow: flowNameParam, sessionId, agent: agentId } =
    req.query;

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

  const flowName = typeof flowNameParam === 'string' ? flowNameParam : 'football-pick';
  let flow;
  try {
    flow = await loadFlow(flowName);
  } catch (e) {
    res.status(500).json({ error: 'Unable to load flow' });
    return;
  }

  if (agentId && typeof agentId === 'string') {
    flow = { ...flow, agents: flow.agents.filter((a) => a === agentId) };
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  // @ts-ignore - flush may not exist in some environments
  res.flushHeaders?.();

  const matchup: Matchup = {
    homeTeam,
    awayTeam,
    matchDay: weekNum,
    time: '',
    league: '',
  };

  const agentsOutput: Partial<AgentOutputs> = {};

  try {
    const { outputs } = await runFlow(
      flow,
      matchup,
      ({ name, result, error }) => {
        if (!error && result) {
          agentsOutput[name] = result;
        }
      },
      (event) => {
        console.log('lifecycle event', event);
        lifecycleAgent(event, matchup);
        res.write(
          `data: ${JSON.stringify({
            type: 'lifecycle',
            sessionId,
            agentId: event.name,
            ...event,
          })}\n\n`
        );

        if (event.status === 'completed') {
          const result = agentsOutput[event.name];
          if (result) {
            const meta = agents.find((a) => a.name === event.name);
            const scoreTotal = result.score * (meta?.weight ?? 1);
            const confidenceEstimate = result.score;
            res.write(
              `data: ${JSON.stringify({
                type: 'agent',
                sessionId,
                agentId: event.name,
                name: event.name,
                result,
                scoreTotal,
                confidenceEstimate,
                agentDurationMs: event.durationMs,
                warnings: result.warnings,
              })}\n\n`
            );
          }
        } else if (event.status === 'errored') {
          res.write(
            `data: ${JSON.stringify({
              type: 'agent',
              sessionId,
              agentId: event.name,
              name: event.name,
              error: true,
            })}\n\n`
          );
        }
        // @ts-ignore - flush may not exist in some environments
        res.flush?.();
      }
    );

    Object.assign(agentsOutput, outputs);
  } catch (err: any) {
    console.error('runFlow failed', err);
    res.write(
      `data: ${JSON.stringify({
        type: 'error',
        sessionId,
        message: err.message || 'runFlow failed',
      })}\n\n`
    );
    res.end();
    return;
  }

  const scores: Record<string, number> = { [homeTeam]: 0, [awayTeam]: 0 };
  flow.agents.forEach((name) => {
    const meta = agents.find((a) => a.name === name);
    const result = agentsOutput[name];
    if (!meta || !result) return;
    scores[result.team] += result.score * meta.weight;
  });

  const winner = scores[homeTeam] >= scores[awayTeam] ? homeTeam : awayTeam;
  const confidence = Math.max(scores[homeTeam], scores[awayTeam]);
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
      sessionId,
      matchup,
      agents: agentsOutput,
      pick: pickSummary,
      loggedAt,
    })}\n\n`
  );
  res.end();
}


