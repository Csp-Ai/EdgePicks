import { AgentResult, Matchup } from '../types';
import { pseudoMetric, logAgentReflection } from './utils';
import { AgentReflection } from '../../types/AgentReflection';

export const lineWatcher = async (matchup: Matchup): Promise<AgentResult> => {
  if (matchup.odds?.spread !== undefined) {
    const favored = matchup.odds.spread < 0 ? matchup.homeTeam : matchup.awayTeam;
    const movement = Math.abs(matchup.odds.spread);
    const score = Math.min(1, 0.5 + movement / 20);
    const reason = `Spread ${matchup.odds.spread} from ${matchup.odds.bookmaker} (updated ${matchup.odds.lastUpdate})`;
    const reflection: AgentReflection = {
      whatIObserved: reason,
      whatIChose: `Favored ${favored}`,
      whatCouldImprove: 'Track live line movement',
    };
    logAgentReflection('lineWatcher', reflection);
    return {
      team: favored,
      score,
      reason,
    };
  }

  const [homeLine, awayLine] = await Promise.all([
    pseudoMetric(`${matchup.homeTeam}-line`, 10),
    pseudoMetric(`${matchup.awayTeam}-line`, 10),
  ]);

  const diff = homeLine - awayLine;
  const favored = diff <= 0 ? matchup.awayTeam : matchup.homeTeam;
  const movement = Math.abs(diff);
  const score = Math.min(1, 0.5 + movement / 20);
  const reason = `Betting line favors ${favored} by ${movement.toFixed(1)} pts`;
  const reflection: AgentReflection = {
    whatIObserved: reason,
    whatIChose: `Favored ${favored}`,
    whatCouldImprove: 'Obtain bookmaker data',
  };
  logAgentReflection('lineWatcher', reflection);

  return {
    team: favored,
    score,
    reason,
  };
};
