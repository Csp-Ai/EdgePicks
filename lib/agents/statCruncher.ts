import { AgentResult, Matchup } from '../types';
import { pseudoMetric, logAgentReflection } from './utils';
import { AgentReflection } from '../../types/AgentReflection';
import { fetchStats } from '../data/stats';
import type { League } from '../data/schedule';

export const statCruncher = async (matchup: Matchup): Promise<AgentResult> => {
  // Map efficiency gap to confidence.
  // Input: efficiency difference (diff).
  // Score: 0.5 base + diff/200, capped at 1.
  const stats = await fetchStats(matchup.league as League);
  let homeEff = stats.find((s) => s.team === matchup.homeTeam)?.efficiency;
  let awayEff = stats.find((s) => s.team === matchup.awayTeam)?.efficiency;

  if (homeEff === undefined || awayEff === undefined) {
    [homeEff, awayEff] = await Promise.all([
      pseudoMetric(`${matchup.homeTeam}-stats`, 100),
      pseudoMetric(`${matchup.awayTeam}-stats`, 100),
    ]);
  }

  const favored = (homeEff as number) >= (awayEff as number) ? matchup.homeTeam : matchup.awayTeam;
  const diff = Math.abs((homeEff as number) - (awayEff as number));
  const score = Math.min(1, 0.5 + diff / 200);
  const reason = `${favored} shows a ${diff}% efficiency edge`;
  const reflection: AgentReflection = {
    whatIObserved: reason,
    whatIChose: `Favored ${favored}`,
    whatCouldImprove: 'Consider strength of schedule',
  };
  await logAgentReflection('statCruncher', reflection);

  return {
    name: 'statCruncher',
    team: favored,
    score,
    reason,
  };
};
