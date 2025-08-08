import { supabase } from '../lib/supabaseClient';
import { recordAgentOutcomes } from '../lib/accuracy';

async function main() {
  const { data, error } = await supabase
    .from('matchups')
    .select('id, agents, actual_winner, created_at')
    .not('actual_winner', 'is', null);

  if (error) {
    throw new Error(error.message);
  }
  if (!data) return;

  for (const row of data as any[]) {
    await recordAgentOutcomes(row.id, row.agents, row.actual_winner, row.created_at);
  }
  console.log('✅ Agent outcomes backfill complete');
}

main().catch((err) => {
  console.error('Backfill failed', err);
  process.exit(1);
});
