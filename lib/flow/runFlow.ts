import type {
  Matchup,
  AgentOutputs,
  AgentResult,
  AgentName,
  AgentLifecycle,
} from '../types';
import { loadAgents } from '../agents/loadAgents';
import type { FlowConfig } from './loadFlow';
import pLimit from 'p-limit';
import { ENV } from '../env';
import crypto from 'crypto';
import { getCacheDriver } from '../infra/cache';

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

function cacheKey(flow: FlowConfig, matchup: Matchup) {
  const version = ENV.FLOW_CACHE_VERSION;
  const inputHash = crypto
    .createHash('sha1')
    .update(JSON.stringify(matchup))
    .digest('hex');
  const agentsHash = crypto
    .createHash('sha1')
    .update(flow.agents.join(','))
    .digest('hex');
  return `flow:${flow.name}:${version}:${agentsHash}:${inputHash}`;
}

export async function runFlow(
  flow: FlowConfig,
  matchup: Matchup,
  onAgent?: (exec: AgentExecution) => void,
  onLifecycle?: (event: { name: AgentName } & AgentLifecycle) => void
): Promise<FlowRunResult> {
  const key = cacheKey(flow, matchup);
  const cacheDriver = getCacheDriver();
  const cached = await cacheDriver.get<FlowRunResult>(key);
  if (cached) {
    console.log('cache:hit');
    return cached;
  }

  const outputs: Partial<AgentOutputs> = {};
  const executions: AgentExecution[] = new Array(flow.agents.length);
  const agents = await loadAgents();
  const getAgent = (name: AgentName) => agents.find((a) => a.name === name);
  const limit = pLimit(ENV.MAX_FLOW_CONCURRENCY);

  let index = 0;
  while (index < flow.agents.length) {
    const batch: { name: AgentName; idx: number; agent: typeof agents[number] }[] = [];

    while (index < flow.agents.length) {
      const name = flow.agents[index];
      const agent = getAgent(name);
      if (!agent) {
        console.error(`[runFlow] Agent not found: ${name}`);
        const exec: AgentExecution = { name, error: true };
        executions[index] = exec;
        onAgent?.(exec);
        index++;
        continue;
      }
      if (agent.run.length >= 2) break;
      batch.push({ name, idx: index, agent });
      index++;
    }

    if (batch.length > 0) {
      await Promise.allSettled(
        batch.map(({ name, idx, agent }) =>
          limit(async () => {
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
              executions[idx] = exec;
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
              const errorInfo = { message: err?.message || 'Unknown error', stack: err?.stack };
              const exec: AgentExecution = { name, error: true, errorInfo };
              executions[idx] = exec;
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
          })
        )
      );
    }

    if (index < flow.agents.length) {
      const name = flow.agents[index];
      const agent = getAgent(name);
      if (!agent) {
        console.error(`[runFlow] Agent not found: ${name}`);
        const exec: AgentExecution = { name, error: true };
        executions[index] = exec;
        onAgent?.(exec);
        index++;
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
        executions[index] = exec;
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
        const errorInfo = { message: err?.message || 'Unknown error', stack: err?.stack };
        const exec: AgentExecution = { name, error: true, errorInfo };
        executions[index] = exec;
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
      index++;
    }
  }

  const result: FlowRunResult = { outputs, executions };
  await cacheDriver.set(key, result, ENV.PREDICTION_CACHE_TTL_SEC);
  return result;
}

