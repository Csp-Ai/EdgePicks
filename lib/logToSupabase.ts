import { supabase } from './supabaseClient';
import { AgentOutputs, Matchup, PickSummary } from './types';
import { recomputeAccuracy, recordAgentOutcomes } from './accuracy';
import { getQueueDriver } from './infra/queue';

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
const QUEUE_NAME = 'matchup-logs';
const queue = getQueueDriver();
let processing = false;
let lastError: string | null = null;
const MAX_ATTEMPTS = 5;
const BASE_DELAY_MS = 1000;

async function processQueue() {
  if (processing) {
    return;
  }
  processing = true;
  const entry = await queue.dequeue<LogEntry>(QUEUE_NAME);
  if (!entry) {
    processing = false;
    return;
  }
  let retryDelay: number | null = null;
  try {
    const { data: inserted, error } = await supabase
      .from('matchups')
      .insert({
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
      })
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    lastError = null;
    if (entry.actualWinner && inserted) {
      await recordAgentOutcomes(
        inserted.id,
        entry.agents,
        entry.actualWinner,
        entry.loggedAt
      ).catch((err) =>
        console.error('Error recording agent outcomes:', err)
      );
      recomputeAccuracy().catch((err) =>
        console.error('Error updating accuracy metrics:', err)
      );
    }
  } catch (err: any) {
    console.error('Error inserting matchup log:', err);
    lastError = err.message || String(err);
    entry.attempts += 1;
    if (entry.attempts < MAX_ATTEMPTS) {
      await queue.enqueue(QUEUE_NAME, entry);
      retryDelay = BASE_DELAY_MS * 2 ** (entry.attempts - 1);
    } else {
      console.error('Max retry attempts reached for log entry; dropping.');
    }
  } finally {
    processing = false;
    const pending = await queue.size(QUEUE_NAME);
    if (pending > 0) {
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
  void queue.enqueue(QUEUE_NAME, {
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

export async function getLogStatus() {
  return {
    pending: await queue.size(QUEUE_NAME),
    lastError,
  };
}

