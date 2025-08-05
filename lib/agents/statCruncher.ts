import { AgentResult, Matchup } from '../types';
import { pseudoMetric } from './utils';

export const statCruncher = async (matchup: Matchup): Promise<AgentResult> => {
  const [homeEff, awayEff] = await Promise.all([
    pseudoMetric(`${matchup.homeTeam}-stats`, 100),
    pseudoMetric(`${matchup.awayTeam}-stats`, 100),
  ]);

  const favored = homeEff >= awayEff ? matchup.homeTeam : matchup.awayTeam;
  const diff = Math.abs(homeEff - awayEff);
  const score = Math.min(1, 0.5 + diff / 200);

  return {
    team: favored,
    score,
    reason: `${favored} shows a ${diff}% efficiency edge`,
  };
};
