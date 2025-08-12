export type League = "nfl" | "nba" | "mlb" | "nhl" | string;

export interface Game {
  gameId: string;
  league: League;
  homeTeam: string;
  awayTeam: string;
  time: string | number | Date;
}

export interface PickSummary {
  winner: string;         // team name or side
  confidence: number;     // 0..1
  reasons?: string[];
}

export type AgentName = string;

export interface AgentEvent {
  type: "agent" | "lifecycle" | "summary" | "error";
  name?: AgentName;
  message?: string;
  // summary fields
  pick?: PickSummary;
  // optional confidence estimate per step
  confidenceEstimate?: number;
  // error
  code?: string;
}

export interface TrendsResult {
  trend: string;
  strength: number; // 0..1
  sample?: number;
}

export interface OddsSnapshot {
  moneyline?: { home?: number; away?: number; draw?: number };
  spread?: { homeSpread?: number; awaySpread?: number; total?: number };
}
