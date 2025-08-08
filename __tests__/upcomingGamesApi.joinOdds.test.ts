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
const schedule = require('./fixtures/schedule.json');
const odds = require('./fixtures/odds.json');

describe('upcoming-games API', () => {
  let live: string | undefined;
  beforeAll(() => {
    live = process.env.LIVE_MODE;
    process.env.LIVE_MODE = 'off';
  });
  afterAll(() => {
    process.env.LIVE_MODE = live;
  });

  it('joins odds data with schedule', async () => {
    fetchSchedule.mockResolvedValue(schedule);
    fetchOdds.mockResolvedValue(odds);

    const req = { query: { league: 'NFL' } } as unknown as NextApiRequest;
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status } as unknown as NextApiResponse;

    await handler(req, res);

    expect(status).toHaveBeenCalledWith(200);
    const payload = json.mock.calls[0][0];
    expect(payload).toHaveLength(3);

    expect(payload[0]).toEqual(
      expect.objectContaining({
        homeTeam: { name: 'A' },
        awayTeam: { name: 'B' },
        time: '2020-01-01T00:00:00Z',
        odds: expect.objectContaining({
          moneyline: { home: -110, away: 100 },
        }),
      }),
    );

    expect(payload[1]).toEqual(
      expect.objectContaining({
        homeTeam: { name: 'C' },
        awayTeam: { name: 'D' },
        time: '2020-01-02T00:00:00Z',
        odds: null,
      }),
    );

    expect(payload[2]).toEqual(
      expect.objectContaining({
        homeTeam: { name: 'E' },
        awayTeam: { name: 'F' },
        time: '2020-01-03T00:00:00Z',
        odds: null,
      }),
    );
  });
});
