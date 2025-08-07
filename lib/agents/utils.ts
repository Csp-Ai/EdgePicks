import { AgentReflection } from '../../types/AgentReflection';
import { writeAgentReflection } from '../agentReflectionStore';

export const pseudoMetric = async (seed: string, mod: number): Promise<number> => {
  const hash = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return hash % mod;
};

export async function logAgentReflection(agent: string, reflection: AgentReflection): Promise<void> {
  await writeAgentReflection(agent, reflection);
}
