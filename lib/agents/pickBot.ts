import { injuryScout } from './injuryScout';
import { lineWatcher } from './lineWatcher';
import { statCruncher } from './statCruncher';
import type { AgentResult } from './injuryScout';

interface Matchup {
  homeTeam: string;
  awayTeam: string;
}

export interface PickResult {
  pick: string;
  confidence: number;
  reasons: string[];
}

const weights = {
  injury: 0.5,
  line: 0.3,
  stats: 0.2,
};

export const pickBot = async (matchup: Matchup): Promise<PickResult> => {
  const [injury, line, stats] = await Promise.all([
    injuryScout(matchup),
    lineWatcher(matchup),
    statCruncher(matchup),
  ]);

  const teams = [matchup.homeTeam, matchup.awayTeam];
  const scores: Record<string, number> = { [teams[0]]: 0, [teams[1]]: 0 };

  const apply = (result: AgentResult, weight: number) => {
    scores[result.team] += result.score * weight;
  };

  apply(injury, weights.injury);
  apply(line, weights.line);
  apply(stats, weights.stats);

  const pick = scores[teams[0]] >= scores[teams[1]] ? teams[0] : teams[1];
  const confidence = Math.max(scores[teams[0]], scores[teams[1]]);

  return {
    pick,
    confidence,
    reasons: [injury.reason, line.reason, stats.reason],
  };
};
