import { AgentReflection } from '../types/AgentReflection';
import { logToSupabase } from './logToSupabase';

export async function logAgentReflection(agent: string, reflection: AgentReflection): Promise<void> {
  if (process.env.VERCEL) {
    // When running on Vercel, log to Supabase
    await logToSupabase('agent_reflections', {
      agent,
      ...reflection,
      timestamp: new Date().toISOString()
    }).catch(err => console.error('Failed to log agent reflection:', err));
  } else {
    // In development, we can still write to the filesystem
    const { writeAgentReflection } = await import('./writeAgentReflection');
    await writeAgentReflection(agent, reflection);
  }
}
