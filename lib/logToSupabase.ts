import { getSupabaseClient } from './supabaseClient';
import { AgentOutputs, Matchup, PickSummary } from './types';

export async function logToSupabase(
  matchup: Matchup,
  agents: AgentOutputs,
  pick: PickSummary
): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client.from('matchups').insert({
    team_a: matchup.homeTeam,
    team_b: matchup.awayTeam,
    week: matchup.week,
    agents,
    pick,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Error inserting matchup log:', error);
  }
}
