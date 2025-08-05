export interface Matchup {
  homeTeam: string;
  awayTeam: string;
  week?: number;
}

export interface AgentResult {
  team: string;
  score: number; // higher score favors team
  reason: string;
}

export interface PickResult {
  pick: string;
  confidence: number;
  reasons: string[];
}

export type MatchupWithPick = Matchup & PickResult;
