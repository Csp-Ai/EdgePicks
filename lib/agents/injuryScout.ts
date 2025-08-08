import { AgentResult, Matchup } from '../types';

import { pseudoMetric, logAgentReflection } from './utils';
import { AgentReflection } from '../../types/AgentReflection';
import { fetchInjuries } from '../data/injuries';
import type { League } from '../data/schedule';

export const injuryScout = async (matchup: Matchup): Promise<AgentResult> => {
  // Map difference in injury counts to a confidence score.
  // Input: injury count difference (diff).
  // Score: 0.5 base + diff/10, capped at 1.
  const injuries = await fetchInjuries(matchup.league as League);
  let homeInjuries = injuries.filter((i) => i.team === matchup.homeTeam).length;
  let awayInjuries = injuries.filter((i) => i.team === matchup.awayTeam).length;

  if (homeInjuries === 0 && awayInjuries === 0) {
    [homeInjuries, awayInjuries] = await Promise.all([
      pseudoMetric(`${matchup.homeTeam}-injuries`, 5),
      pseudoMetric(`${matchup.awayTeam}-injuries`, 5),
    ]);
  }

  const favored = homeInjuries <= awayInjuries ? matchup.homeTeam : matchup.awayTeam;
  const underdog = favored === matchup.homeTeam ? matchup.awayTeam : matchup.homeTeam;
  const diff = Math.abs(homeInjuries - awayInjuries);
  const score = Math.min(1, 0.5 + diff / 10);
  const reason = `${underdog} has ${diff} more key injuries (${homeInjuries} vs ${awayInjuries})`;

  const reflection: AgentReflection = {
    whatIObserved: reason,
    whatIChose: `Favored ${favored}`,
    whatCouldImprove: 'Integrate real-time injury severity',
  };
  await logAgentReflection('injuryScout', reflection);

  return {
    team: favored,
    score,
    reason,
  };
};
