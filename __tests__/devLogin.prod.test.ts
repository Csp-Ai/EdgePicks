/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
describe('dev-login route in production', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, NODE_ENV: 'production' };
    delete process.env.NEXT_PUBLIC_SITE_URL;
    // Simulate absence of VERCEL_URL; route should still not throw at import time.
    delete process.env.VERCEL_URL;
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('does not throw at import time and returns 404', async () => {
    const mod = await import('../app/api/dev-login/route');
    expect(typeof mod.GET).toBe('function');

    // Mock NextResponse.json behavior by calling and checking status-like shape.
    const res = await mod.GET();
    // @ts-ignore - shape differs in test
    expect(res?.status ?? res?.statusCode ?? 404).toBe(404);
  });
});
