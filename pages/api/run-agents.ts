import type { NextApiRequest, NextApiResponse } from 'next';
import { injuryScout } from '../../lib/agents/injuryScout';
import { lineWatcher } from '../../lib/agents/lineWatcher';
import { statCruncher } from '../../lib/agents/statCruncher';
import { AgentResult, AgentOutputs, Matchup, PickSummary } from '../../lib/types';
import { logToSupabase } from '../../lib/logToSupabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { teamA, teamB, week } = req.query;

  if (typeof teamA !== 'string' || typeof teamB !== 'string' || typeof week !== 'string') {
    res.status(400).json({ error: 'teamA, teamB, and week query params are required' });
    return;
  }

  const weekNum = parseInt(week, 10);
  if (isNaN(weekNum)) {
    res.status(400).json({ error: 'week must be a number' });
    return;
  }

  const matchup: Matchup = { homeTeam: teamA, awayTeam: teamB, week: weekNum };

  const [injury, line, stats] = await Promise.all([
    injuryScout(matchup),
    lineWatcher(matchup),
    statCruncher(matchup),
  ]);

  const agentsOutput: AgentOutputs = {
    injuryScout: injury,
    lineWatcher: line,
    statCruncher: stats,
  };

  const weights = { injury: 0.5, line: 0.3, stats: 0.2 };
  const scores: Record<string, number> = { [teamA]: 0, [teamB]: 0 };
  const apply = (result: AgentResult, weight: number) => {
    scores[result.team] += result.score * weight;
  };

  apply(injury, weights.injury);
  apply(line, weights.line);
  apply(stats, weights.stats);

  const winner = scores[teamA] >= scores[teamB] ? teamA : teamB;
  const confidence = Math.max(scores[teamA], scores[teamB]);
  const topReasons = [injury.reason, line.reason, stats.reason];

  const pickSummary: PickSummary = {
    winner,
    confidence,
    topReasons,
  };

  const loggedAt = await logToSupabase(matchup, agentsOutput, pickSummary);

  res.status(200).json({ matchup, agents: agentsOutput, pick: pickSummary, loggedAt });
}

