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

export type AgentName = 'injuryScout' | 'lineWatcher' | 'statCruncher';

export type AgentOutputs = Record<AgentName, AgentResult>;

export interface PickSummary {
  winner: string;
  confidence: number;
  topReasons: string[];
}

export const displayNames: Record<AgentName, string> = {
  injuryScout: 'InjuryScout',
  lineWatcher: 'LineWatcher',
  statCruncher: 'StatCruncher',
};

export interface PickResult {
  pick: string;
  confidence: number;
  reasons: string[];
}

export type MatchupWithPick = Matchup & PickResult;
