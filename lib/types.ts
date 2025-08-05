export interface Matchup {
  homeTeam: string;
  awayTeam: string;
  matchDay?: number;
}

export interface AgentResult {
  team: string;
  score: number; // higher score favors team
  reason: string;
}

import type { AgentName } from './agents/registry';
export type { AgentName } from './agents/registry';

export type AgentFunc = (matchup: Matchup) => Promise<AgentResult>;

export type AgentOutputs = Record<AgentName, AgentResult>;

export interface PickSummary {
  winner: string;
  confidence: number;
  topReasons: string[];
}

export interface PickResult {
  pick: string;
  confidence: number;
  reasons: string[];
}

export type MatchupWithPick = Matchup & PickResult;
