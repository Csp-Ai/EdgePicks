import { supabase } from '../supabaseClient';

export interface AgentStats {
  wins: number;
  losses: number;
}

interface AgentStatsRow {
  agent: string;
  wins: number | null;
  losses: number | null;
}

interface SnapshotRow {
  agent: string;
  weight: number | null;
  ts: string;
}

export function computeWeight(
  { wins, losses }: AgentStats,
  {
    decay = 0.9,
    min = 0.1,
    max = 0.9,
  }: { decay?: number; min?: number; max?: number } = {},
): number {
  const alpha = wins + 1;
  const beta = losses + 1;
  const mean = alpha / (alpha + beta);
  const smoothed = decay * mean + (1 - decay) * 0.5;
  return Math.min(max, Math.max(min, smoothed));
}

export async function getDynamicWeights(): Promise<Record<string, number>> {
  // First try latest snapshots
  const snapshotQuery = await supabase
    .from('agent_weights_snapshot')
    .select('agent, weight, ts')
    .order('ts', { ascending: false })
    .limit(100);
  if (!snapshotQuery.error && snapshotQuery.data && snapshotQuery.data.length) {
    const weights: Record<string, number> = {};
    (snapshotQuery.data as SnapshotRow[]).forEach((row) => {
      if (row.weight != null && weights[row.agent] === undefined) {
        weights[row.agent] = row.weight;
      }
    });
    if (Object.keys(weights).length) {
      return weights;
    }
  }

  // Fallback to computing from agent_stats
  const { data, error } = await supabase
    .from('agent_stats')
    .select('agent, wins, losses');
  if (error || !data) {
    console.error('Failed to load agent_stats', error?.message);
    return {};
  }
  const weights: Record<string, number> = {};
  (data as AgentStatsRow[]).forEach((row) => {
    const wins = row.wins ?? 0;
    const losses = row.losses ?? 0;
    weights[row.agent] = computeWeight({ wins, losses });
  });
  return weights;
}
