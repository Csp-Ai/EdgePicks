import { rest } from 'msw';
import issue from '../../../__tests__/fixtures/github/issue.json';

export const githubHandlers = [
  rest.post('https://api.github.com/repos/:owner/:repo/issues', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(issue));
  }),
];
