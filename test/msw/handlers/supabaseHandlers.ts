import { rest } from 'msw';

export const supabaseHandlers = [
  rest.get('http://localhost/rest/v1/:table', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),
  rest.post('http://localhost/rest/v1/rpc/:fn', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),
];
