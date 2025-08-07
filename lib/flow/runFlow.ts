import type {
  Matchup,
  AgentOutputs,
  AgentResult,
  AgentName,
  AgentLifecycle,
} from '../types';
import { loadAgents } from '../agents/loadAgents';
import type { FlowConfig } from './loadFlow';

export interface AgentExecution {
  name: AgentName;
  result?: AgentResult;
  error?: true;
  errorInfo?: { message?: string; stack?: string };
  scoreTotal?: number;
  confidenceEstimate?: number;
  agentDurationMs?: number;
  sessionId?: string;
}

export interface FlowRunResult {
  outputs: Partial<AgentOutputs>;
  executions: AgentExecution[];
}

/**
 * Execute a flow sequentially, running each agent in order.
 * Logs input and output for each agent and marks failures.
 */
export async function runFlow(
  flow: FlowConfig,
  matchup: Matchup,
  onAgent?: (exec: AgentExecution) => void,
  onLifecycle?: (event: { name: AgentName } & AgentLifecycle) => void
): Promise<FlowRunResult> {
  const outputs: Partial<AgentOutputs> = {};
  const executions: AgentExecution[] = [];
  const agents = await loadAgents();

  for (const name of flow.agents) {
    const agent = agents.find((a) => a.name === name);
    if (!agent) {
      console.error(`[runFlow] Agent not found: ${name}`);
      onAgent?.({ name, error: true });
      continue;
    }

    console.log(`[runFlow] ${name} input:`, matchup);
    const start = Date.now();
    onLifecycle?.({ name, status: 'started', startedAt: start });
    try {
      const result = await agent.run(matchup, outputs);
      const end = Date.now();
      const duration = end - start;
      console.log(`[runFlow] ${name} output:`, result);
      outputs[name] = result;
      const exec: AgentExecution = { name, result };
      executions.push(exec);
      onAgent?.(exec);
      onLifecycle?.({
        name,
        status: 'completed',
        startedAt: start,
        endedAt: end,
        durationMs: duration,
      });
    } catch (err: any) {
      const end = Date.now();
      const duration = end - start;
      console.error(`[runFlow] ${name} error:`, err);
      const errorInfo = {
        message: err?.message || 'Unknown error',
        stack: err?.stack,
      };
      const exec: AgentExecution = { name, error: true, errorInfo };
      executions.push(exec);
      onAgent?.(exec);
      onLifecycle?.({
        name,
        status: 'errored',
        startedAt: start,
        endedAt: end,
        durationMs: duration,
        error: errorInfo,
      });
    }
  }

  return { outputs, executions };
}
