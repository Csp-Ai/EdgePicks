export interface Game {
  gameId: string;
  league: 'NFL' | 'NBA' | 'MLB' | 'NHL';
  homeTeam: string;
  awayTeam: string;
  time: string; // ISO
  /** Preformatted relative time for UI; supplied by API for consistency */
  kickoffDisplay?: string;
  homeLogo?: string;
  awayLogo?: string;
  odds?: {
    spread?: number;
    overUnder?: number;
    moneyline?: { home?: number; away?: number };
    bookmaker?: string;
    lastUpdate?: string;
  };
  source?: 'live-nfl-api' | 'live-nba-api' | 'fallback' | 'mock';
}

export interface Matchup {
  homeTeam: string;
  awayTeam: string;
  matchDay?: number;
  /** Local start time for the event */
  time: string;
  /** League or competition, e.g., NFL, NBA */
  league: string;
  /** Optional unique identifier from a sports API */
  gameId?: string;
  /** Optional team badge URLs */
  homeLogo?: string;
  awayLogo?: string;
  /** Optional betting odds */
  odds?: {
    spread?: number;
    overUnder?: number;
    moneyline?: {
      home?: number;
      away?: number;
    };
    bookmaker?: string;
    lastUpdate?: string;
  };
  /** Flags to indicate real-time data */
  isLiveData?: boolean;
  source?: string;
  useFallback?: boolean;
  /** Preformatted relative time for UI; supplied by API for consistency */
  kickoffDisplay?: string;
}

export interface AgentResult {
  team: string;
  score: number; // higher score favors team
  reason: string;
  warnings?: string[];
  reflection?: AgentReflection;
  weight?: number;
  scoreTotal?: number;
  confidenceEstimate?: number;
  description?: string;
}

export interface AgentReflection {
  whatIObserved: string;
  whatIChose: string;
  whatCouldImprove: string;
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
  error?: { message?: string; stack?: string };
}
