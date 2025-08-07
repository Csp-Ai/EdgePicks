import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const AgentSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(['injury', 'line', 'stat', 'analytics', 'guardian']),
  weight: z.number(),
  sources: z.array(z.string()),
}).strict();

export type AgentMetadata = z.infer<typeof AgentSchema>;

export function validateAgents(metaPath: string, docsDir: string): AgentMetadata[] {
  const raw = fs.readFileSync(metaPath, 'utf-8');
  const data = JSON.parse(raw);
  const agents = z.array(AgentSchema).parse(data);

  const names = new Set<string>();
  for (const agent of agents) {
    if (names.has(agent.name)) {
      throw new Error(`Duplicate agent name detected: ${agent.name}`);
    }
    names.add(agent.name);

    const docPath = path.join(docsDir, `agent-${agent.name}.md`);
    if (!fs.existsSync(docPath)) {
      throw new Error(`Missing doc for agent ${agent.name}`);
    }
    const docContent = fs.readFileSync(docPath, 'utf-8');
    if (!docContent.includes(agent.description)) {
      throw new Error(`Doc for agent ${agent.name} is out of sync with description`);
    }
  }

  const docFiles = fs
    .readdirSync(docsDir)
    .filter((f) => /^agent-[A-Za-z0-9]+\.md$/.test(f));
  const extraDocs = docFiles.filter((f) => {
    const name = f.replace(/^agent-(.*)\.md$/, '$1');
    return !agents.some((a) => a.name === name);
  });
  if (extraDocs.length) {
    throw new Error(`Doc files without matching agent metadata: ${extraDocs.join(', ')}`);
  }

  return agents;
}
