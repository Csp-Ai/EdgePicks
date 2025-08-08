import fs from 'fs/promises';
import path from 'path';

import { AgentReflection } from '../types/AgentReflection';

const filePath = path.join(process.cwd(), 'logs', 'agent-reflections.json');
let writeChain: Promise<unknown> = Promise.resolve();

export async function writeAgentReflection(agent: string, reflection: AgentReflection): Promise<void> {
  // queue writes to avoid race conditions
  writeChain = writeChain.then(async () => {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    let entries: Array<Record<string, any>> = [];
    try {
      const existing = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(existing);
      entries = Array.isArray(parsed) ? parsed : [];
    } catch {
      entries = [];
    }
    entries.push({ agent, ...reflection, timestamp: new Date().toISOString() });
    const tempPath = `${filePath}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(entries, null, 2));
    await fs.rename(tempPath, filePath);
  });
  return writeChain.then(() => undefined);
}

export async function readAgentReflections(): Promise<Record<string, AgentReflection>> {
  try {
    const contents = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(contents) as Array<{ agent: string } & AgentReflection>;
    if (!Array.isArray(parsed)) return {};
    const map: Record<string, AgentReflection> = {};
    for (const entry of parsed) {
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
