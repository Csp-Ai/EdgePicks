import { AgentResult, Matchup } from '../types';
import { getSupabaseClient } from '../supabaseClient';

export interface TrendsResult extends AgentResult {
  flowPopularity: { flow: string; count: number }[];
  agentHitRates: { agent: string; hitRate: number; correct: number; total: number }[];
}

export const trendsAgent = async (_: Matchup): Promise<TrendsResult> => {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('matchups')
    .select('flow, agents, actual_winner')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    throw error;
  }

  const flowCounts: Record<string, number> = {};
  const agentStats: Record<string, { correct: number; total: number }> = {};

  (data || []).forEach((row: any) => {
    const flow = row.flow || 'unknown';
    flowCounts[flow] = (flowCounts[flow] || 0) + 1;

    const actual: string | null = row.actual_winner;
    const agents = row.agents || {};

    if (actual) {
      Object.entries(agents as Record<string, { team: string }>).forEach(([name, result]) => {
        if (!agentStats[name]) {
          agentStats[name] = { correct: 0, total: 0 };
        }
        agentStats[name].total += 1;
        if (result.team === actual) {
          agentStats[name].correct += 1;
        }
      });
    }
  });

  const flowPopularity = Object.entries(flowCounts)
    .map(([flow, count]) => ({ flow, count }))
    .sort((a, b) => b.count - a.count);

  const agentHitRates = Object.entries(agentStats)
    .map(([agent, { correct, total }]) => ({
      agent,
      correct,
      total,
      hitRate: total ? correct / total : 0,
    }))
    .sort((a, b) => b.hitRate - a.hitRate);

  return {
    team: 'N/A',
    score: 0,
    reason: 'Trends analysis',
    flowPopularity,
    agentHitRates,
  };
};

