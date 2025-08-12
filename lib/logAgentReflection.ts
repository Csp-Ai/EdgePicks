import { AgentReflection } from '../types/AgentReflection';
import { logToSupabase } from './logToSupabase';

export async function logAgentReflection(agent: string, reflection: AgentReflection): Promise<void> {
  // Always try to log to Supabase first
  try {
    await logToSupabase('agent_reflections', {
      agent,
      ...reflection,
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL ? 'production' : 'development'
    });
  } catch (err) {
    console.error('Failed to log agent reflection to Supabase:', err);
    
    // Fall back to filesystem in development
    if (!process.env.VERCEL) {
      const { writeAgentReflection } = await import('./writeAgentReflection');
      try {
        await writeAgentReflection(agent, reflection);
      } catch (fsErr) {
        console.error('Failed to write agent reflection to filesystem:', fsErr);
      }
    }
  }
}
