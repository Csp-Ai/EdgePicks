import path from 'path';
import { validateAgents } from '@/lib/validateAgentMetadata';

try {
  const metaPath = path.join(__dirname, '../lib/agents/agents.json');
  const docsDir = path.join(__dirname, '../docs');
  validateAgents(metaPath, docsDir);
  console.log('✅ Agent metadata is valid and docs are in sync.');
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error('❌ Agent metadata validation failed:', message);
  process.exit(1);
}
