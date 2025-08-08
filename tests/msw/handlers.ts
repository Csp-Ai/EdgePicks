import { rest } from 'msw';

export const handlers = [
  // Define request handlers for tests.
  rest.get('/test', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ ok: true }));
  }),
];
