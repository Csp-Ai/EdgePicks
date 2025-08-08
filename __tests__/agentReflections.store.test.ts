import fs from 'fs/promises';
import path from 'path';

import { writeAgentReflection, readAgentReflections } from '../lib/writeAgentReflection';
import { AgentReflection } from '../types/AgentReflection';

const logPath = path.join(process.cwd(), 'logs', 'agent-reflections.json');

const sample = (suffix: string): AgentReflection => ({
  whatIObserved: `obs-${suffix}`,
  whatIChose: `choice-${suffix}`,
  whatCouldImprove: `improve-${suffix}`,
});

beforeEach(async () => {
  await fs.rm(logPath, { force: true });
});

test('multiple writes in quick succession preserve all entries', async () => {
  await writeAgentReflection('agent1', sample('1'));
  await writeAgentReflection('agent2', sample('2'));
  const contents = await fs.readFile(logPath, 'utf8');
  const entries = JSON.parse(contents);
  expect(entries).toHaveLength(2);
  expect(entries.map((e: any) => e.agent)).toEqual(expect.arrayContaining(['agent1', 'agent2']));
});

test('invalid JSON is recovered by rewriting a valid array', async () => {
  await fs.mkdir(path.dirname(logPath), { recursive: true });
  await fs.writeFile(logPath, '{ invalid json');
  await writeAgentReflection('agent1', sample('1'));
  const contents = await fs.readFile(logPath, 'utf8');
  const entries = JSON.parse(contents);
  expect(Array.isArray(entries)).toBe(true);
  expect(entries).toHaveLength(1);
  expect(entries[0].agent).toBe('agent1');
});

test('log file remains valid after concurrent writes', async () => {
  await Promise.all([
    writeAgentReflection('agent1', sample('1')),
    writeAgentReflection('agent2', sample('2')),
    writeAgentReflection('agent3', sample('3')),
  ]);
  const contents = await fs.readFile(logPath, 'utf8');
  const entries = JSON.parse(contents);
  expect(entries).toHaveLength(3);
  expect(entries.map((e: any) => e.agent)).toEqual(
    expect.arrayContaining(['agent1', 'agent2', 'agent3'])
  );
  // ensure file can be parsed again via readAgentReflections
  const map = await readAgentReflections();
  expect(Object.keys(map)).toEqual(
    expect.arrayContaining(['agent1', 'agent2', 'agent3'])
  );
});
