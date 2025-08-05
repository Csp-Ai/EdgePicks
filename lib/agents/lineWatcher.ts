import { AgentResult } from './injuryScout';

interface Matchup {
  homeTeam: string;
  awayTeam: string;
}

export const lineWatcher = (matchup: Matchup): AgentResult => {
  return {
    team: matchup.homeTeam,
    score: 0.55,
    reason: 'Line moved 1.5 toward home team',
  };
};
