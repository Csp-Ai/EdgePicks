/** @jest-environment node */
import { spawnSync } from 'child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import os from 'os';

describe('checkMergeMarkers script', () => {
  const repoRoot = join(__dirname, '..');
  const project = join(repoRoot, 'tsconfig.node.json');
  const script = join(repoRoot, 'scripts/checkMergeMarkers.ts');
  const run = (cwd: string) =>
    spawnSync('node', ['-r', 'ts-node/register', script], {
      cwd,
      env: { ...process.env, TS_NODE_PROJECT: project },
      encoding: 'utf8',
    });

  it('exits 0 when no markers', () => {
    const dir = mkdtempSync(join(os.tmpdir(), 'mm-'));
    const result = run(dir);
    rmSync(dir, { recursive: true, force: true });
    expect(result.status).toBe(0);
  });

  it('exits 1 when markers are present', () => {
    const dir = mkdtempSync(join(os.tmpdir(), 'mm-'));
    writeFileSync(join(dir, 'bad.txt'), '<<<<<<< HEAD\n=======\n>>>>>>>');
    const result = run(dir);
    rmSync(dir, { recursive: true, force: true });
    expect(result.status).toBe(1);
  });
});
