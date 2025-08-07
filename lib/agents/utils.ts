import fs from 'fs';
import path from 'path';
import { AgentReflection } from '../../types/AgentReflection';

export const pseudoMetric = async (seed: string, mod: number): Promise<number> => {
  const hash = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return hash % mod;
};

export function logAgentReflection(agent: string, reflection: AgentReflection) {
  const logFile = path.join(process.cwd(), 'logs', 'agent-reflections.json');
  let entries: any[] = [];
  try {
    entries = JSON.parse(fs.readFileSync(logFile, 'utf8'));
  } catch {
    entries = [];
  }
  entries.push({ agent, ...reflection, timestamp: new Date().toISOString() });
  fs.writeFileSync(logFile, JSON.stringify(entries, null, 2));
}
