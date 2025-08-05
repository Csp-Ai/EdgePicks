import { getSupabaseClient } from './supabaseClient';
import { AgentOutputs, Matchup, PickSummary } from './types';

type LogEntry = {
  matchup: Matchup;
  agents: AgentOutputs;
  pick: PickSummary;
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
      created_at: entry.loggedAt,
    });
    if (error) {
      throw error;
    }
    lastError = null;
  } catch (err: any) {
    console.error('Error inserting matchup log:', err);
    lastError = err.message || String(err);
    queue.push(entry);
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
  loggedAt: string = new Date().toISOString()
): string {
  queue.push({ matchup, agents, pick, loggedAt });
  setImmediate(processQueue);
  return loggedAt;
}

export function getLogStatus() {
  return {
    pending: queue.length,
    lastError,
  };
}
