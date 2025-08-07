import fs from 'fs/promises';
import path from 'path';

import { AgentReflection } from '../types/AgentReflection';

const filePath = path.join(process.cwd(), 'logs', 'agent-reflections.json');

export async function writeAgentReflection(agent: string, reflection: AgentReflection): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  let entries: Array<Record<string, any>> = [];
  try {
    const existing = await fs.readFile(filePath, 'utf8');
    entries = JSON.parse(existing);
  } catch {
    entries = [];
  }
  entries.push({ agent, ...reflection, timestamp: new Date().toISOString() });
  await fs.writeFile(filePath, JSON.stringify(entries, null, 2));
}

export async function readAgentReflections(): Promise<Record<string, AgentReflection>> {
  try {
    const contents = await fs.readFile(filePath, 'utf8');
    const entries = JSON.parse(contents) as Array<{ agent: string } & AgentReflection>;
    const map: Record<string, AgentReflection> = {};
    for (const entry of entries) {
      map[entry.agent] = {
        whatIObserved: entry.whatIObserved,
        whatIChose: entry.whatIChose,
        whatCouldImprove: entry.whatCouldImprove,
      };
    }
    return map;
  } catch {
    return {};
  }
}
