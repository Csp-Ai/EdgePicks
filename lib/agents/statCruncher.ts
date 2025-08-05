import { AgentResult } from './injuryScout';

interface Matchup {
  homeTeam: string;
  awayTeam: string;
}

export const statCruncher = (matchup: Matchup): AgentResult => {
  return {
    team: matchup.awayTeam,
    score: 0.52,
    reason: 'Passing efficiency edge for away team',
  };
};
