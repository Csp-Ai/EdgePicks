import { getSupabaseClient } from './supabaseClient';
import { AgentOutputs, Matchup, PickSummary } from './types';
import { recomputeAccuracy } from './accuracy';

type LogEntry = {
  matchup: Matchup;
  agents: AgentOutputs;
  pick: PickSummary;
  actualWinner: string | null;
  flow: string;
  isAutoPick?: boolean;
  extras?: Record<string, any>;
  loggedAt: string;
  attempts: number;
};

const queue: LogEntry[] = [];
let processing = false;
let lastError: string | null = null;
const MAX_ATTEMPTS = 5;
const BASE_DELAY_MS = 1000;

async function processQueue() {
  if (processing || queue.length === 0) {
    return;
  }
  processing = true;
  const entry = queue.shift()!;
  let retryDelay: number | null = null;
  try {
    const client = getSupabaseClient();
    const { error } = await client.from('matchups').insert({
      team_a: entry.matchup.homeTeam,
      team_b: entry.matchup.awayTeam,
      match_day: entry.matchup.matchDay,
      agents: entry.agents,
      pick: entry.pick,
      flow: entry.flow,
      actual_winner: entry.actualWinner,
      is_auto_pick: entry.isAutoPick,
      extras: entry.extras,
      created_at: entry.loggedAt,
    });

    if (error) {
      throw error;
    }

    lastError = null;
    if (entry.actualWinner) {
      recomputeAccuracy().catch((err) =>
        console.error('Error updating accuracy metrics:', err)
      );
    }
  } catch (err: any) {
    console.error('Error inserting matchup log:', err);
    lastError = err.message || String(err);
    entry.attempts += 1;
    if (entry.attempts < MAX_ATTEMPTS) {
      queue.push(entry); // Re-queue for retry
      retryDelay = BASE_DELAY_MS * 2 ** (entry.attempts - 1);
    } else {
      console.error('Max retry attempts reached for log entry; dropping.');
    }
  } finally {
    processing = false;
    if (queue.length > 0) {
      if (retryDelay !== null) {
        setTimeout(processQueue, retryDelay);
      } else {
        setImmediate(processQueue);
      }
    }
  }
}

export function logToSupabase(
  matchup: Matchup,
  agents: AgentOutputs,
  pick: PickSummary,
  actualWinner: string | null = null,
  flow: string = 'unknown',
  isAutoPick: boolean = false,
  extras: Record<string, any> = {},
  loggedAt: string = new Date().toISOString()
): string {
  queue.push({
    matchup,
    agents,
    pick,
    actualWinner,
    flow,
    isAutoPick,
    extras,
    loggedAt,
    attempts: 0,
  });
  setImmediate(processQueue);
  return loggedAt;
}

export function getLogStatus() {
  return {
    pending: queue.length,
    lastError,
  };
}

