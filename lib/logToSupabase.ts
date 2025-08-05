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
};

const queue: LogEntry[] = [];
let processing = false;
let lastError: string | null = null;

async function processQueue() {
  if (processing || queue.length === 0) {
    return;
  }
  processing = true;
  const entry = queue.shift()!;
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
    queue.push(entry); // Re-queue for retry
  } finally {
    processing = false;
    if (queue.length > 0) {
      setImmediate(processQueue);
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

