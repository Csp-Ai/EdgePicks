import fs from 'fs/promises';
import { run as refresh } from '../../scripts/refreshDocs';

describe('docs refresh snapshots', () => {
  it('generates docs', async () => {
    process.env.DOCS_SELF_REFLECT = 'off';
    await refresh();
    const api = await fs.readFile('docs/api.md', 'utf8');
    const agents = await fs.readFile('docs/agents.md', 'utf8');
    const db = await fs.readFile('docs/db-schema.md', 'utf8');
    expect(api).toMatchSnapshot();
    expect(agents).toMatchSnapshot();
    expect(db).toMatchSnapshot();
  });
});
