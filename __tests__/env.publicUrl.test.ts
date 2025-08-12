describe('public site URL resolution', () => {
  const OLD = process.env;
  beforeEach(() => { jest.resetModules(); process.env = { ...OLD }; });
  afterEach(() => { process.env = OLD; });

  it('prefers NEXT_PUBLIC_SITE_URL when set and non-empty', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com/';
    const { getPublicSiteUrl } = await import('@/lib/env');
    expect(getPublicSiteUrl()).toBe('https://example.com');
  });

  it('falls back to https://VERCEL_URL when present', async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.VERCEL_URL = 'my-app.vercel.app';
    const { getPublicSiteUrl } = await import('@/lib/env');
    expect(getPublicSiteUrl()).toBe('https://my-app.vercel.app');
  });
});
