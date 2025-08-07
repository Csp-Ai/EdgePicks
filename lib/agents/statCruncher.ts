import { AgentResult, Matchup } from '../types';
import { pseudoMetric, logAgentReflection } from './utils';
import { AgentReflection } from '../../types/AgentReflection';

export const statCruncher = async (matchup: Matchup): Promise<AgentResult> => {
  const [homeEff, awayEff] = await Promise.all([
    pseudoMetric(`${matchup.homeTeam}-stats`, 100),
    pseudoMetric(`${matchup.awayTeam}-stats`, 100),
  ]);

  const favored = homeEff >= awayEff ? matchup.homeTeam : matchup.awayTeam;
  const diff = Math.abs(homeEff - awayEff);
  const score = Math.min(1, 0.5 + diff / 200);
  const reason = `${favored} shows a ${diff}% efficiency edge`;
  const reflection: AgentReflection = {
    whatIObserved: reason,
    whatIChose: `Favored ${favored}`,
    whatCouldImprove: 'Consider strength of schedule',
  };
  await logAgentReflection('statCruncher', reflection);

  return {
    team: favored,
    score,
    reason,
  };
};
