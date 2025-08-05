import type { Matchup, AgentOutputs, AgentResult, AgentName } from '../types';
import { agents as registry } from '../agents/registry';
import type { FlowConfig } from './loadFlow';

export interface AgentExecution {
  name: AgentName;
  result?: AgentResult;
  error?: true;
}

/**
 * Execute a flow sequentially, running each agent in order.
 * Logs input and output for each agent and marks failures.
 */
export async function runFlow(
  flow: FlowConfig,
  matchup: Matchup,
  onAgent?: (exec: AgentExecution) => void
): Promise<Partial<AgentOutputs>> {
  const outputs: Partial<AgentOutputs> = {};

  for (const name of flow.agents) {
    const agent = registry.find((a) => a.name === name);
    if (!agent) {
      console.error(`[runFlow] Agent not found: ${name}`);
      onAgent?.({ name, error: true });
      continue;
    }

    console.log(`[runFlow] ${name} input:`, matchup);
    try {
      const result = await agent.run(matchup);
      console.log(`[runFlow] ${name} output:`, result);
      outputs[name] = result;
      onAgent?.({ name, result });
    } catch (err) {
      console.error(`[runFlow] ${name} error:`, err);
      onAgent?.({ name, error: true });
    }
  }

  return outputs;
}
