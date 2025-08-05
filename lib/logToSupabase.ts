import { getSupabaseClient } from './supabaseClient';
import { AgentOutputs, Matchup, PickSummary } from './types';

export async function logToSupabase(
  matchup: Matchup,
  agents: AgentOutputs,
  pick: PickSummary,
  actualWinner: string | null = null,
  loggedAt: string = new Date().toISOString()
): Promise<string> {
  const client = getSupabaseClient();
  const { error } = await client.from('matchups').insert({
    team_a: matchup.homeTeam,
    team_b: matchup.awayTeam,
    match_day: matchup.matchDay,
    agents,
    pick,
    actual_winner: actualWinner,
    created_at: loggedAt,
  });

  if (error) {
    console.error('Error inserting matchup log:', error);
  }

  return loggedAt;
}
