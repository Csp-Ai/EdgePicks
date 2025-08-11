import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';
import { computeWeight } from '@/lib/weights';

interface OutcomeRow {
  agent: string;
  correct: boolean | null;
}

async function run(): Promise<void> {
  const { data, error } = await supabase
    .from('agent_outcomes')
    .select('agent, correct')
    .order('ts', { ascending: false })
    .limit(50);

  if (error || !data) {
    console.error('Failed to fetch agent_outcomes', error?.message);
    return;
  }

  const tallies: Record<string, { wins: number; losses: number }> = {};
  (data as OutcomeRow[]).forEach((row) => {
    if (!tallies[row.agent]) {
      tallies[row.agent] = { wins: 0, losses: 0 };
    }
    if (row.correct) {
      tallies[row.agent].wins += 1;
    } else {
      tallies[row.agent].losses += 1;
    }
  });

  const registryPath = path.join(__dirname, '../lib/agents/agents.json');
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

  registry.forEach((agent: any) => {
    if (agent.weight === 0) return;
    const stats = tallies[agent.name] || { wins: 0, losses: 0 };
    const newWeight = computeWeight(stats);
    console.log(
      `${agent.name}: ${agent.weight.toFixed(3)} -> ${newWeight.toFixed(3)} (W:${stats.wins} L:${stats.losses})`,
    );
    agent.weight = newWeight;
  });

  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
  console.log('Agent weights updated in registry.');
}

if (require.main === module) {
  run();
}
