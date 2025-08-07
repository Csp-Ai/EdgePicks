/** @jest-environment node */
import { spawnSync } from 'child_process';

describe('validate-env script', () => {
  const run = (env: NodeJS.ProcessEnv) =>
    spawnSync('node', ['-r', 'ts-node/register', 'scripts/validateEnv.ts'], {
      env: { ...env, TS_NODE_COMPILER_OPTIONS: '{"module":"CommonJS"}' },
    });

  const baseEnv = { PATH: process.env.PATH, NODE_ENV: 'test' } as NodeJS.ProcessEnv;

  it('fails when required keys are missing', () => {
    const result = run(baseEnv);
    expect(result.status).not.toBe(0);
  });

  it('passes when all required keys exist', () => {
    const env = {
      ...baseEnv,
      GOOGLE_CLIENT_ID: 'gid',
      GOOGLE_CLIENT_SECRET: 'gsecret',
      NEXTAUTH_SECRET: 'secret',
      NEXTAUTH_URL: 'http://localhost',
      SUPABASE_URL: 'http://localhost',
      SUPABASE_KEY: 'key',
      SPORTS_API_KEY: 'sports',
      LIVE_MODE: 'off',
      PREDICTION_CACHE_TTL_SEC: '120',
      MAX_FLOW_CONCURRENCY: '3',
    };
    const result = run(env);
    expect(result.status).toBe(0);
  });
});
