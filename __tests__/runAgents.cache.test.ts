/** @jest-environment node */
import { getServerSession } from 'next-auth/next';
import { runFlow } from '../lib/flow/runFlow';
import { loadFlow } from '../lib/flow/loadFlow';
import { fetchSchedule } from '../lib/data/schedule';

jest.mock('next-auth/next');
jest.mock('../lib/flow/runFlow');
jest.mock('../lib/flow/loadFlow');
jest.mock('../lib/data/schedule');
jest.mock('../lib/logUiEvent', () => ({ logUiEvent: jest.fn() }));
jest.mock('../lib/agents/registry', () => ({
  registry: [{ name: 'injuryScout', weight: 1 }],
}));

jest.mock('../lib/supabaseClient', () => {
  const store = new Map<string, any>();
  return {
    supabase: {
      from: () => ({
        select: () => ({
          eq: (_col: string, key: string) => ({
            single: async () => ({ data: store.get(key) || null, error: null }),
          }),
        }),
        upsert: async (row: any) => {
          store.set(row.key, row);
          return { data: row, error: null };
        },
      }),
    },
    __store: store,
  };
});

const handler = require('../pages/api/run-agents').default;
const { __clearRunAgentsCache } = require('../pages/api/run-agents');
const { __store } = require('../lib/supabaseClient');

const mockedSession = getServerSession as jest.Mock;
const mockedRunFlow = runFlow as jest.Mock;
const mockedLoadFlow = loadFlow as jest.Mock;
const mockedSchedule = fetchSchedule as jest.Mock;

describe('run-agents caching', () => {
  beforeEach(() => {
    __clearRunAgentsCache();
    __store.clear();
    mockedSession.mockResolvedValue({ user: { id: '1' } });
    mockedLoadFlow.mockResolvedValue({ name: 'flow', agents: ['injuryScout'] });
    mockedSchedule.mockResolvedValue([
      { gameId: 'g1', homeTeam: 'A', awayTeam: 'B', matchDay: 1 },
    ]);
    let runId = 0;
    mockedRunFlow.mockImplementation(async () => {
      runId += 1;
      return {
        outputs: { injuryScout: { team: 'A', score: runId, reasoning: 'ok' } },
        executions: [],
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function createReqRes() {
    const req: any = { method: 'POST', body: { league: 'NFL', gameId: 'g1' } };
    const json = jest.fn();
    const res: any = { status: jest.fn().mockReturnThis(), json, setHeader: jest.fn(), end: jest.fn() };
    return { req, res, json };
  }

  it('caches responses in memory and Supabase', async () => {
    const total = 10;
    for (let i = 0; i < total; i++) {
      const { req, res } = createReqRes();
      await handler(req, res);
    }
    // memory cache hit - runFlow should be called once
    expect(mockedRunFlow).toHaveBeenCalledTimes(1);
    const hitRatio = (total - mockedRunFlow.mock.calls.length) / total;
    expect(hitRatio).toBeGreaterThan(0.5);
    // clear memory to force Supabase path
    __clearRunAgentsCache();
    const { req, res } = createReqRes();
    await handler(req, res);
    expect(mockedRunFlow).toHaveBeenCalledTimes(1);
  });

  it('expires cache after TTL', async () => {
    jest.useFakeTimers();
    const { req, res, json } = createReqRes();
    await handler(req, res);
    const firstScore = json.mock.calls[0][0].agents.injuryScout.score;
    __clearRunAgentsCache();
    jest.advanceTimersByTime(61000); // advance beyond 60s TTL
    const { req: req2, res: res2, json: json2 } = createReqRes();
    await handler(req2, res2);
    const secondScore = json2.mock.calls[0][0].agents.injuryScout.score;
    expect(secondScore).not.toBe(firstScore);
    expect(mockedRunFlow).toHaveBeenCalledTimes(2);
  });
});
