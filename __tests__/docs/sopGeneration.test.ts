import fs from 'fs/promises';
import path from 'path';
import { run as runSOPs } from '../../scripts/generateSOPs';
import { AgentReflection } from '../../scripts/agentSelfReflection';

describe('SOP generation', () => {
  const dir = path.join(process.cwd(), 'agents', 'injuryScout');
  const sopPath = path.join(dir, 'SOP.md');
  const reflectionPath = path.join(dir, 'reflection.json');

  beforeAll(async () => {
    const reflection: AgentReflection = {
      agentId: 'injuryScout',
      windowDays: 14,
      correctPct: 50,
      samples: 2,
      avgConfCorrect: 0.8,
      avgConfWrong: 0.9,
      commonFailureModes: ['Issues vs C'],
      changeHints: ['Calibrate confidence on misses'],
      timestamp: '2024-01-01T00:00:00.000Z',
    };
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      sopPath,
      `# injuryScout SOP\n\n<!-- Notes from Maintainer -->\nKEEP ME\n<!-- End Notes from Maintainer -->\n`,
    );
    await fs.writeFile(reflectionPath, JSON.stringify(reflection, null, 2));
  });

  it('merges reflection and preserves notes', async () => {
    await runSOPs();
    const content = await fs.readFile(sopPath, 'utf8');
    expect(content).toMatch('KEEP ME');
    expect(content).toMatch('Calibrate confidence on misses');
    expect(content).toMatch('Issues vs C');
  });
});
