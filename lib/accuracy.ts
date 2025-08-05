import { getSupabaseClient } from './supabaseClient';
import { agents as agentRegistry } from './agents/registry';
import type { AgentName, AgentOutputs } from './types';

interface MatchupRow {
  agents: AgentOutputs;
  pick: { winner?: string } | null;
  actual_winner: string | null;
  flow: string | null;
}

export interface AccuracyStat {
  name: string;
  wins: number;
  losses: number;
  accuracy: number;
}

export async function recomputeAccuracy() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('matchups')
    .select('agents, pick, actual_winner, flow');
  if (error || !data) {
    throw new Error(error?.message || 'Failed to fetch matchups');
  }

  const agentTallies: Record<AgentName, { wins: number; losses: number }> = {};
  agentRegistry.forEach(({ name }) => {
    agentTallies[name as AgentName] = { wins: 0, losses: 0 };
  });
  const flowTallies: Record<string, { wins: number; losses: number }> = {};

  data.forEach((row: MatchupRow) => {
    const actual = row.actual_winner;
    if (!actual) return;

    // Agent stats
    agentRegistry.forEach(({ name }) => {
      const pick = row.agents?.[name]?.team;
      if (!pick) return;
      if (pick === actual) {
        agentTallies[name as AgentName].wins += 1;
      } else {
        agentTallies[name as AgentName].losses += 1;
      }
    });

    // Flow stats
    const flowName = row.flow || 'unknown';
    const predicted = row.pick?.winner;
    if (!flowTallies[flowName]) flowTallies[flowName] = { wins: 0, losses: 0 };
    if (predicted) {
      if (predicted === actual) {
        flowTallies[flowName].wins += 1;
      } else {
        flowTallies[flowName].losses += 1;
      }
    }
  });

  const agentStats = Object.entries(agentTallies).map(([agent, t]) => ({
    agent,
    wins: t.wins,
    losses: t.losses,
    accuracy: t.wins + t.losses > 0 ? t.wins / (t.wins + t.losses) : 0,
  }));

  const flowStats = Object.entries(flowTallies).map(([flow, t]) => ({
    flow,
    wins: t.wins,
    losses: t.losses,
    accuracy: t.wins + t.losses > 0 ? t.wins / (t.wins + t.losses) : 0,
  }));

  await client.from('agent_stats').upsert(agentStats, { onConflict: 'agent' });
  await client.from('flow_stats').upsert(flowStats, { onConflict: 'flow' });

  return { agentStats, flowStats };
}

