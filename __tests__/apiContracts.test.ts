/** @jest-environment node */
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Schemas
const agentResultSchema = z.object({
  team: z.string(),
  score: z.number(),
  reason: z.string().optional(),
});
const runAgentsLiveSchema = z.object({
  pick: z.string(),
  finalConfidence: z.number(),
  agents: z.record(agentResultSchema),
});
const runAgentsMockSchema = z.object({
  events: z.array(
    z.object({
      type: z.string(),
      agentId: z.string(),
      ts: z.number(),
      payload: z.unknown().optional(),
    })
  ),
  final: z.object({ winner: z.string(), confidence: z.number() }),
});

const upcomingGameSchema = z
  .object({
    gameId: z.string(),
    homeTeam: z.object({ name: z.string() }).passthrough(),
    awayTeam: z.object({ name: z.string() }).passthrough(),
    confidence: z.number(),
    time: z.string(),
    league: z.string(),
    winner: z.string(),
    edgeDelta: z.number(),
    confidenceDrop: z.number(),
    disagreements: z.array(z.string()),
    edgePick: z.array(z.any()),
    kickoffDisplay: z.string(),
  })
  .passthrough();
const upcomingGamesSchema = z.array(upcomingGameSchema);

// Global mocks
jest.mock('../lib/flow/runFlow', () => ({ runFlow: jest.fn() }));
jest.mock('../lib/data/schedule', () => ({ fetchSchedule: jest.fn() }));
jest.mock('../lib/data/odds', () => ({ fetchOdds: jest.fn() }));
jest.mock('../lib/logToSupabase', () => ({ logToSupabase: jest.fn() }));
jest.mock('../lib/utils/fallbackMatchups', () => ({ getFallbackMatchups: jest.fn(() => []) }));
jest.mock('../lib/utils/formatKickoff', () => ({ formatKickoff: () => '' }));
jest.mock('../lib/agents/registry', () => ({ registry: [] }));

const runAgentsHandler = require('../pages/api/run-agents').default;
const upcomingGamesHandler = require('../pages/api/upcoming-games').default;
const { ENV } = require('../lib/env');

describe('API contract schemas', () => {
  test('run-agents live schema snapshot', () => {
    const schema = zodToJsonSchema(runAgentsLiveSchema, 'RunAgentsLive');
    expect(schema).toMatchSnapshot();
  });

  test('run-agents mock schema snapshot', () => {
    const schema = zodToJsonSchema(runAgentsMockSchema, 'RunAgentsMock');
    expect(schema).toMatchSnapshot();
  });

  test('upcoming-games schema snapshot', () => {
    const schema = zodToJsonSchema(upcomingGamesSchema, 'UpcomingGames');
    expect(schema).toMatchSnapshot();
  });
});

describe('run-agents API contract', () => {
  const { runFlow } = require('../lib/flow/runFlow');
  const { fetchSchedule } = require('../lib/data/schedule');

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.NEXT_PUBLIC_MOCK_AUTH;
    ENV.LIVE_MODE = 'off';
  });

  it('validates live response', async () => {
    ENV.LIVE_MODE = 'on';
    process.env.NEXT_PUBLIC_MOCK_AUTH = '1';
    (runFlow as jest.Mock).mockResolvedValue({
      outputs: {
        injuryScout: { team: 'A', score: 0.7, reason: 'ok' },
      },
    });
    (fetchSchedule as jest.Mock).mockResolvedValue([
      { homeTeam: 'A', awayTeam: 'B', time: '', league: 'NFL', gameId: '1' },
    ]);

    const req = { method: 'POST', body: { league: 'NFL', gameId: '1' } } as NextApiRequest;
    const json = jest.fn();
    const res = { status: jest.fn(() => ({ json })) } as unknown as NextApiResponse;

    await runAgentsHandler(req, res);
    const data = json.mock.calls[0][0];
    expect(() => runAgentsLiveSchema.parse(data)).not.toThrow();
  });

  it('validates mock response', async () => {
    ENV.LIVE_MODE = 'off';
    const req = { method: 'POST', body: { league: 'NFL', gameId: '1' } } as NextApiRequest;
    const json = jest.fn();
    const res = { status: jest.fn(() => ({ json })) } as unknown as NextApiResponse;

    await runAgentsHandler(req, res);
    const data = json.mock.calls[0][0];
    expect(() => runAgentsMockSchema.parse(data)).not.toThrow();
  });
});

describe('upcoming-games API contract', () => {
  const { fetchSchedule } = require('../lib/data/schedule');
  const { fetchOdds } = require('../lib/data/odds');
  const { runFlow } = require('../lib/flow/runFlow');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('response matches schema', async () => {
    (fetchSchedule as jest.Mock).mockResolvedValue([
      { homeTeam: 'A', awayTeam: 'B', time: '2020', league: 'NFL' },
    ]);
    (fetchOdds as jest.Mock).mockResolvedValue([
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
    (runFlow as jest.Mock).mockResolvedValue({ outputs: {}, executions: [] });

    const req = { query: { league: 'NFL' } } as unknown as NextApiRequest;
    const json = jest.fn();
    const res = { status: jest.fn(() => ({ json })) } as unknown as NextApiResponse;
    await upcomingGamesHandler(req, res);
    const data = json.mock.calls[0][0];
    expect(() => upcomingGamesSchema.parse(data)).not.toThrow();
  });
});
