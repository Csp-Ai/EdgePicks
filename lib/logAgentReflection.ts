import { AgentReflection } from '../types/AgentReflection';
import { writeAgentReflection } from './writeAgentReflection';

export async function logAgentReflection(agent: string, reflection: AgentReflection): Promise<void> {
  await writeAgentReflection(agent, reflection);
}
