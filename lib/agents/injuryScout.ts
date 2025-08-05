export interface AgentResult {
  team: string;
  score: number; // higher score favors team
  reason: string;
}

interface Matchup {
  homeTeam: string;
  awayTeam: string;
}

export const injuryScout = (matchup: Matchup): AgentResult => {
  return {
    team: matchup.homeTeam,
    score: 0.6,
    reason: `${matchup.awayTeam} missing key starters`,
  };
};
