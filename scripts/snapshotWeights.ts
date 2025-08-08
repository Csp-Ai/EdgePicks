import { supabase } from '../lib/supabaseClient';
import { computeWeight } from '../lib/weights';

interface AgentStatsRow {
  agent: string;
  wins: number | null;
  losses: number | null;
}

export async function run(): Promise<void> {
  const { data, error } = await supabase
    .from('agent_stats')
    .select('agent, wins, losses');
  if (error || !data) {
    console.error('Failed to load agent_stats', error?.message);
    return;
  }
  const rows = (data as AgentStatsRow[]).map((row) => {
    const wins = row.wins ?? 0;
    const losses = row.losses ?? 0;
    const weight = computeWeight({ wins, losses });
    return {
      agent: row.agent,
      alpha: wins + 1,
      beta: losses + 1,
      weight,
      sample_size: wins + losses,
    };
  });
  const { error: insertError } = await supabase
    .from('agent_weights_snapshot')
    .insert(rows);
  if (insertError) {
    console.error('Failed to insert agent_weights_snapshot', insertError.message);
  }
}

if (require.main === module) {
  run();
}
