import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('http://localhost/api/health', (_req, res, ctx) =>
    res(ctx.status(200), ctx.json({ ok: true }))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('health endpoint responds with ok', async () => {
  const res = await fetch('http://localhost/api/health');
  expect(res.status).toBe(200);
  await expect(res.json()).resolves.toEqual({ ok: true });
});
