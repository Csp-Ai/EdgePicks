import { rest } from 'msw';
import schedule from '../../../__tests__/fixtures/sports/schedule.json';
import odds from '../../../__tests__/fixtures/sports/odds.json';
import injuries from '../../../__tests__/fixtures/sports/injuries.json';

export const sportsHandlers = [
  rest.get('https://api.sportsdata.io/:path*', (req, res, ctx) => {
    const pathname = req.url.pathname.toLowerCase();
    if (pathname.includes('schedule')) {
      return res(ctx.status(200), ctx.json(schedule));
    }
    if (pathname.includes('odds')) {
      return res(ctx.status(200), ctx.json(odds));
    }
    if (pathname.includes('injur')) {
      return res(ctx.status(200), ctx.json(injuries));
    }
    return res(ctx.status(404));
  }),
];
