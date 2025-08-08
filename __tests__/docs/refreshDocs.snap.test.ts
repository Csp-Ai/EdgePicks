import fs from 'fs/promises';
import { run as refresh } from '../../scripts/refreshDocs';
import agentsMeta from '../../lib/agents/agents.json';

describe('docs refresh snapshots', () => {
  it('generates docs', async () => {
    process.env.DOCS_SELF_REFLECT = 'off';
    await refresh();
    const api = await fs.readFile('docs/api.md', 'utf8');
    const db = await fs.readFile('docs/db-schema.md', 'utf8');
    const stableAgents = (agentsMeta as any[])
      .map((a) => ({
        id: a.name,
        name: a.name,
        purpose: a.description,
        tools: a.sources,
      }))
      .sort((a, b) => a.id.localeCompare(b.id));
    expect(api).toMatchSnapshot();
    expect(stableAgents).toMatchSnapshot();
    expect(db).toMatchSnapshot();
  });
});
