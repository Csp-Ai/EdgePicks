/** @jest-environment node */
import { readFileSync, writeFileSync } from 'fs';
import { spawnSync } from 'child_process';

describe('validate-env script', () => {
  const file = '.env.local.example';
  const original = readFileSync(file, 'utf8');

  afterAll(() => {
    writeFileSync(file, original);
  });

  it('fails when required keys are missing', () => {
    // remove SUPABASE_URL line
    const modified = original
      .split('\n')
      .filter((line) => !line.startsWith('SUPABASE_URL'))
      .join('\n');
    writeFileSync(file, modified);
    const result = spawnSync('npm', ['run', '--silent', 'validate-env']);
    expect(result.status).not.toBe(0);
  });

  it('passes when all required keys exist', () => {
    writeFileSync(file, original);
    const result = spawnSync('npm', ['run', '--silent', 'validate-env']);
    expect(result.status).toBe(0);
  });
});
