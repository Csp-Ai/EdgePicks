import { AgentResult, Matchup } from '../types';

import { pseudoMetric } from './utils';

export const injuryScout = async (matchup: Matchup): Promise<AgentResult> => {
  const [homeInjuries, awayInjuries] = await Promise.all([
    pseudoMetric(`${matchup.homeTeam}-injuries`, 5),
    pseudoMetric(`${matchup.awayTeam}-injuries`, 5),
  ]);

  const favored = homeInjuries <= awayInjuries ? matchup.homeTeam : matchup.awayTeam;
  const underdog = favored === matchup.homeTeam ? matchup.awayTeam : matchup.homeTeam;
  const diff = Math.abs(homeInjuries - awayInjuries);
  const score = Math.min(1, 0.5 + diff / 10);

  return {
    team: favored,
    score,
    reason: `${underdog} has ${diff} more key injuries`,
  };
};
