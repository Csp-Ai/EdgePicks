import { supabase } from './supabaseClient';
import { getQueueDriver } from './infra/queue';
import type { AgentOutputs, Matchup, PickSummary } from '@/lib/types';
import { recomputeAccuracy, recordAgentOutcomes } from './accuracy';

interface QueueEntry {
  table: string;
  row: Record<string, any>;
  attempts: number;
}

const QUEUE_NAME = 'supabase-logs';
const queue = getQueueDriver();
let processing = false;
let lastError: string | null = null;
const MAX_ATTEMPTS = 5;
const BASE_DELAY_MS = 1000;

async function processQueue() {
  if (processing) return;
  processing = true;
  const entry = await queue.dequeue<QueueEntry>(QUEUE_NAME);
  if (!entry) {
    processing = false;
    return;
  }
  let retryDelay: number | null = null;
  try {
    const { table, row } = entry;
    const insertBuilder = supabase.from(table).insert(row);
    const exec = (insertBuilder as any).select
      ? (insertBuilder as any).select('id').single()
      : insertBuilder;
    const { data: inserted, error } = await exec;
    if (error) throw error;
    lastError = null;
    if (table === 'matchups' && row.actual_winner && inserted) {
      await recordAgentOutcomes(
        inserted.id,
        row.agents,
        row.actual_winner,
        row.created_at
      ).catch((err) => console.error('Error recording agent outcomes:', err));
      recomputeAccuracy().catch((err) =>
        console.error('Error updating accuracy metrics:', err)
      );
    }
  } catch (err: any) {
    console.error('Error inserting log:', err);
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

export function logToSupabase(table: string, row: Record<string, any>): string {
  const created = row.created_at || new Date().toISOString();
  void queue.enqueue(QUEUE_NAME, { table, row: { ...row, created_at: created }, attempts: 0 });
  setImmediate(processQueue);
  return created;
}

export async function flushLogQueue() {
  while ((await queue.size(QUEUE_NAME)) > 0) {
    await processQueue();
  }
}

export async function getLogStatus() {
  return { pending: await queue.size(QUEUE_NAME), lastError };
}

export function logMatchup(
  matchup: Matchup,
  agents: AgentOutputs,
  pick: PickSummary,
  actualWinner: string | null = null,
  flow: string = 'unknown',
  isAutoPick: boolean = false,
  extras: Record<string, any> = {},
  correlationId?: string,
  loggedAt: string = new Date().toISOString()
) {
  const row = {
    team_a: matchup.homeTeam,
    team_b: matchup.awayTeam,
    match_day: matchup.matchDay,
    agents,
    pick,
    flow,
    actual_winner: actualWinner,
    is_auto_pick: isAutoPick,
    extras: { ...extras, correlation_id: correlationId },
    created_at: loggedAt,
  };
  logToSupabase('matchups', row);
  return loggedAt;
}
