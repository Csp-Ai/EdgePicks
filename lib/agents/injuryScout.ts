import { AgentResult, Matchup } from '../types';

export const injuryScout = (matchup: Matchup): AgentResult => {
  return {
    team: matchup.homeTeam,
    score: 0.6,
    reason: `${matchup.awayTeam} missing key starters`,
  };
};
