import fs from 'fs/promises';
import path from 'path';
import agentsMeta from '../lib/agents/agents.json';
import { AgentReflection } from './agentSelfReflection';

interface AgentMeta {
  name: string;
  description: string;
}

function extractNotes(content: string): string {
  const match = content.match(/<!-- Notes from Maintainer -->([\s\S]*?)<!-- End Notes from Maintainer -->/);
  return match ? match[1].trim() : 'TBD notes.';
}

async function buildSOP(agent: AgentMeta, reflection: AgentReflection | undefined, notes: string): Promise<string> {
  const lines: string[] = [];
  lines.push(`# ${agent.name} SOP`);
  lines.push('');
  lines.push('## Purpose');
  lines.push(agent.description);
  lines.push('');
  lines.push('## Inputs & Feature Mapping');
  lines.push('TBD');
  lines.push('');
  lines.push('## Current Scoring Logic');
  lines.push('TBD');
  lines.push('');
  lines.push('## Recent Outcomes & Reflection');
  if (reflection) {
    lines.push(`Accuracy: ${reflection.correctPct}% over ${reflection.samples} samples.`);
    if (reflection.summary) lines.push(reflection.summary);
  } else {
    lines.push('No recent data.');
  }
  lines.push('');
  lines.push('## Guardrails & Failure Modes');
  if (reflection && reflection.commonFailureModes.length) {
    reflection.commonFailureModes.forEach((f) => lines.push(`- ${f}`));
  } else {
    lines.push('- TBD');
  }
  lines.push('');
  lines.push('## Next Experiments');
  if (reflection && reflection.changeHints.length) {
    reflection.changeHints.forEach((h) => lines.push(`- ${h}`));
  } else {
    lines.push('- TBD');
  }
  lines.push('');
  lines.push('<!-- Notes from Maintainer -->');
  lines.push(notes);
  lines.push('<!-- End Notes from Maintainer -->');
  lines.push('');
  return lines.join('\n');
}

export async function run(): Promise<void> {
  for (const agent of agentsMeta as AgentMeta[]) {
    const dir = path.join(process.cwd(), 'agents', agent.name);
    const sopPath = path.join(dir, 'SOP.md');
    let notes = 'TBD notes.';
    try {
      const existing = await fs.readFile(sopPath, 'utf8');
      notes = extractNotes(existing);
    } catch {}
    let reflection: AgentReflection | undefined;
    try {
      const raw = await fs.readFile(path.join(dir, 'reflection.json'), 'utf8');
      reflection = JSON.parse(raw);
    } catch {}
    const sop = await buildSOP(agent, reflection, notes);
    await fs.writeFile(sopPath, sop);
  }
}

if (require.main === module) {
  run();
}
