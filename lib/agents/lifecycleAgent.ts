import type { AgentLifecycle, AgentName, Matchup, AgentOutputs, PickSummary } from '../types';
import { logToSupabase } from '../logToSupabase';

// Listen for agent lifecycle events and log them. Optionally persists
// the event to Supabase using the existing logToSupabase helper when a
// matchup is provided.
export function lifecycleAgent(
  event: { name: AgentName } & AgentLifecycle,
  matchup?: Matchup
) {
  console.log('[lifecycleAgent]', event);
  if (!matchup) return;
  try {
    const agents: AgentOutputs = {} as AgentOutputs;
    const pick: PickSummary = {
      winner: event.name,
      confidence: event.durationMs ?? 0,
      topReasons: [`status: ${event.status}`],
    };
    logToSupabase(matchup, agents, pick, null, 'lifecycle');
  } catch (err) {
    console.error('[lifecycleAgent] failed to log to Supabase:', err);
  }
}
