import fs from 'fs/promises';
import path from 'path';
import { run as runReflection } from './agentSelfReflection';
import { run as runSOPs } from './generateSOPs';
import agentsMeta from '../lib/agents/agents.json';

async function generateApiDocs() {
  const apiDir = path.join(process.cwd(), 'pages', 'api');
  const files = await fs.readdir(apiDir);
  const lines = ['# API Routes', ''];
  files.forEach((f) => {
    if (f.endsWith('.ts')) lines.push(`- /api/${f.replace(/\.ts$/, '')}`);
  });
  await fs.writeFile(path.join(process.cwd(), 'docs', 'api.md'), lines.join('\n') + '\n');
}

async function generateAgentRegistry() {
  const lines = ['# Agents', '', '| Name | Weight |', '| --- | --- |'];
  (agentsMeta as any[]).forEach((a) => {
    lines.push(`| ${a.name} | ${a.weight} |`);
  });
  await fs.writeFile(path.join(process.cwd(), 'docs', 'agents.md'), lines.join('\n') + '\n');
}

async function generateDbDocs() {
  const sql = await fs.readFile(path.join(process.cwd(), 'supabase', 'schema.sql'), 'utf8');
  await fs.writeFile(path.join(process.cwd(), 'docs', 'db-schema.md'), '```sql\n' + sql + '\n```\n');
}

async function generateSystemDiagram() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"><text x="10" y="50">System Diagram</text></svg>`;
  await fs.writeFile(path.join(process.cwd(), 'docs', 'system-diagram.svg'), svg);
}

async function generateChangelog() {
  const log = await fs.readFile(path.join(process.cwd(), 'llms.txt'), 'utf8');
  await fs.writeFile(path.join(process.cwd(), 'CHANGELOG.md'), '# Changelog\n\n' + log);
}

export async function run(): Promise<void> {
  if (process.env.DOCS_SELF_REFLECT !== 'off') {
    await runReflection();
  }
  await runSOPs();
  await generateApiDocs();
  await generateAgentRegistry();
  await generateDbDocs();
  await generateSystemDiagram();
  await generateChangelog();
}

if (require.main === module) {
  run();
}
