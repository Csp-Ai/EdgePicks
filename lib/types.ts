export interface Matchup {
  homeTeam: string;
  awayTeam: string;
  matchDay?: number;
}

export interface AgentResult {
  team: string;
  score: number; // higher score favors team
  reason: string;
  warnings?: string[];
}

import type { AgentName } from './agents/registry';
export type { AgentName } from './agents/registry';

export type AgentOutputs = Record<AgentName, AgentResult>;

export type AgentFunc = (
  matchup: Matchup,
  agentOutputs?: Partial<AgentOutputs>
) => Promise<AgentResult>;

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

export interface AgentLifecycle {
  status: 'started' | 'completed' | 'errored';
  startedAt: number;
  endedAt?: number;
  durationMs?: number;
}
