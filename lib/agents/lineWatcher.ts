import { AgentResult, Matchup } from '../types';
import { pseudoMetric } from './utils';

export const lineWatcher = async (matchup: Matchup): Promise<AgentResult> => {
  const [homeLine, awayLine] = await Promise.all([
    pseudoMetric(`${matchup.homeTeam}-line`, 10),
    pseudoMetric(`${matchup.awayTeam}-line`, 10),
  ]);

  const diff = homeLine - awayLine;
  const favored = diff <= 0 ? matchup.awayTeam : matchup.homeTeam;
  const movement = Math.abs(diff);
  const score = Math.min(1, 0.5 + movement / 20);

  return {
    team: favored,
    score,
    reason: `Betting line favors ${favored} by ${movement.toFixed(1)} pts`,
  };
};
