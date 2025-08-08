/** @jest-environment node */

import type { NextApiRequest, NextApiResponse } from 'next';

jest.mock('../lib/data/schedule', () => ({
  fetchSchedule: jest.fn(),
}));
jest.mock('../lib/data/odds', () => ({
  fetchOdds: jest.fn(),
}));
jest.mock('../lib/flow/runFlow', () => ({
  runFlow: jest.fn().mockResolvedValue({ outputs: {}, executions: [] }),
}));
jest.mock('../lib/logToSupabase', () => ({ logToSupabase: jest.fn(), logMatchup: jest.fn() }));
jest.mock('../lib/utils/fallbackMatchups', () => ({ getFallbackMatchups: jest.fn(() => []) }));
jest.mock('../lib/utils/formatKickoff', () => ({ formatKickoff: () => '' }));
jest.mock('../lib/agents/registry', () => ({ registry: [] }));

const handler = require('../pages/api/upcoming-games').default;
const { fetchSchedule } = require('../lib/data/schedule');
const { fetchOdds } = require('../lib/data/odds');

describe('upcoming-games API', () => {
  it('joins odds data with schedule', async () => {
    fetchSchedule.mockResolvedValue([
      { homeTeam: 'A', awayTeam: 'B', time: '2020', league: 'NFL' },
    ]);
    fetchOdds.mockResolvedValue([
      {
        home_team: 'A',
        away_team: 'B',
        bookmakers: [
          {
            title: 'Book',
            last_update: '2020',
            markets: [
              { key: 'h2h', outcomes: [{ name: 'A', price: -110 }, { name: 'B', price: 100 }] },
            ],
          },
        ],
      },
    ]);

    const req = { query: { league: 'NFL' } } as unknown as NextApiRequest;
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status } as unknown as NextApiResponse;

    await handler(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          odds: expect.objectContaining({
            moneyline: { home: -110, away: 100 },
          }),
        }),
      ])
    );
  });
});
