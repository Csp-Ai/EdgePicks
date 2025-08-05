import { AgentResult, Matchup } from '../types';

export const statCruncher = (matchup: Matchup): AgentResult => {
  return {
    team: matchup.awayTeam,
    score: 0.52,
    reason: 'Passing efficiency edge for away team',
  };
};
