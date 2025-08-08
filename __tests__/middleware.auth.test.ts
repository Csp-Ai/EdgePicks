/** @jest-environment node */
import { middleware } from '../middleware';
import { ENV } from '../lib/env';
import { getToken } from 'next-auth/jwt';

jest.mock('next-auth/jwt');

const mockedGetToken = getToken as jest.Mock;

function buildReq(path: string, method: string = 'GET') {
  const url = `https://example.com${path}`;
  return { nextUrl: new URL(url), url, method } as any;
}

describe('middleware auth', () => {
  beforeEach(() => {
    ENV.LIVE_MODE = 'on' as any;
    mockedGetToken.mockReset();
  });

  it('denies protected api without token', async () => {
    mockedGetToken.mockResolvedValue(null);
    const res = await middleware(buildReq('/api/run-agents', 'POST'));
    expect(res.status).toBe(401);
    expect(res.headers.get('Content-Type')).toBe('application/json');
    expect(await res.text()).toBe(JSON.stringify({ error: 'auth_required' }));
  });

  it('allows protected api with token', async () => {
    mockedGetToken.mockResolvedValue({ sub: '123' });
    const res = await middleware(buildReq('/api/run-agents', 'POST'));
    expect(res.status).toBe(200);
  });

  it('allows log reads without token', async () => {
    mockedGetToken.mockResolvedValue(null);
    const res = await middleware(buildReq('/api/logs', 'GET'));
    expect(res.status).toBe(200);
  });

  it('denies log writes without token', async () => {
    mockedGetToken.mockResolvedValue(null);
    const res = await middleware(buildReq('/api/logs', 'POST'));
    expect(res.status).toBe(401);
    expect(res.headers.get('Content-Type')).toBe('application/json');
  });

  it('redirects unauthenticated page requests', async () => {
    mockedGetToken.mockResolvedValue(null);
    const res = await middleware(buildReq('/dashboard'));
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('https://example.com/auth/signin');
  });

  it('allows auth pages', async () => {
    mockedGetToken.mockResolvedValue(null);
    const res = await middleware(buildReq('/auth/signin'));
    expect(res.status).toBe(200);
  });

  it('returns 404 for dev-login in production', async () => {
    process.env.NODE_ENV = 'production';
    const res = await middleware(buildReq('/api/dev-login'));
    expect(res.status).toBe(404);
  });
});
