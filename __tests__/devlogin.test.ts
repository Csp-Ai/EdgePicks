/** @jest-environment node */
import handler from '../app/api/dev-login/route';
import { withNodeEnv } from './utils/env';
import { NextRequest } from 'next/server';

describe('dev-login API', () => {
  it('returns mock user in development', async () => {
    withNodeEnv('development', async () => {
      const req = new NextRequest('http://localhost/api/dev-login');
      const res = await handler(req);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ id: 'dev-user', name: 'Dev User' });
    });
  });

  it('returns 404 outside development', async () => {
    withNodeEnv('production', async () => {
      const req = new NextRequest('http://localhost/api/dev-login');
      const res = await handler(req);

      expect(res.status).toBe(404);
      expect(await res.json()).toEqual({ error: 'Not found' });
    });
  });
});
