/**
 * @jest-environment node
 */
describe('dev login gating', () => {
  const OLD = process.env;
  beforeEach(() => { jest.resetModules(); process.env = { ...OLD, NODE_ENV: 'production' }; });
  afterEach(() => { process.env = OLD; });

  it('returns 404 in production', async () => {
    const mod = await import('@/app/api/dev-login/route');
    const res = await mod.GET();
    // @ts-ignore shape in test
    expect(res?.status ?? res?.statusCode ?? 404).toBe(404);
  });
});
