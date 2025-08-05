import type { NextApiRequest, NextApiResponse } from 'next';
import { agents } from '../../lib/agents/registry';
import { AgentResult, AgentOutputs, Matchup, PickSummary } from '../../lib/types';
import { logToSupabase } from '../../lib/logToSupabase';

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

  const matchup: Matchup = { homeTeam: teamA, awayTeam: teamB, matchDay: matchDayNum };

  const results = await Promise.all(agents.map((a) => a.run(matchup)));

  const agentsOutput = Object.fromEntries(
    agents.map((a, i) => [a.name, results[i]])
  ) as AgentOutputs;

  const scores: Record<string, number> = { [teamA]: 0, [teamB]: 0 };
  const apply = (result: AgentResult, weight: number) => {
    scores[result.team] += result.score * weight;
  };

  results.forEach((result, i) => apply(result, agents[i].weight));

  const winner = scores[teamA] >= scores[teamB] ? teamA : teamB;
  const confidence = Math.max(scores[teamA], scores[teamB]);
  const topReasons = results.map((r) => r.reason);

  const pickSummary: PickSummary = {
    winner,
    confidence,
    topReasons,
  };

  const loggedAt = await logToSupabase(matchup, agentsOutput, pickSummary);

  res.status(200).json({ matchup, agents: agentsOutput, pick: pickSummary, loggedAt });
}

