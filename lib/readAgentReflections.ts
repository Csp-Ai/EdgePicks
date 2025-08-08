import { promises as fs } from 'fs';
import path from 'path';

export type AgentReflection = {
  id?: string;
  agentId?: string;
  timestamp?: number;
  notes?: string;
  improvement?: string; // “lessons learned” style field
  [k: string]: any;
};

const LOG_PATH = path.resolve('logs', 'agent-reflections.json');

/**
 * Returns the most recent N reflections, newest first.
 * Tolerates missing/corrupt files and returns [] on error.
 */
export async function readRecentAgentReflections(limit = 10): Promise<AgentReflection[]> {
  try {
    const buf = await fs.readFile(LOG_PATH, 'utf8');
    let data: unknown = [];
    try {
      data = JSON.parse(buf);
    } catch {
      // Attempt to recover from malformed content by returning empty array.
      return [];
    }
    if (!Array.isArray(data)) return [];
    const items = data as AgentReflection[];
    // Sort by timestamp desc if present; otherwise stable order
    const sorted = [...items].sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
    return sorted.slice(0, limit);
  } catch {
    return [];
  }
}
