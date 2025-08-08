/** @jest-environment node */
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
        delete: () => {
          let keyFilter: string | undefined;
          let prefixFilter: string | undefined;
          const builder: any = {
            eq: (_c: string, k: string) => {
              keyFilter = k;
              return builder;
            },
            like: (_c: string, pattern: string) => {
              prefixFilter = pattern.replace('%', '');
              return builder;
            },
            async then(resolve: any) {
              for (const k of Array.from(store.keys())) {
                if (keyFilter && k !== keyFilter) continue;
                if (prefixFilter && !k.startsWith(prefixFilter)) continue;
                store.delete(k);
              }
              resolve({ data: null, error: null });
            },
          };
          return builder;
        },
      }),
    },
    __store: store,
  };
});
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

const handler = require('../pages/api/run-agents').default;
const {
  __clearRunAgentsCache,
  __setRunAgentsCacheTtl,
} = require('../pages/api/run-agents');
const purge = require('../pages/api/admin/purge-cache').default;
const { __store } = require('../lib/supabaseClient');
const mockedSession =
  require('next-auth/next').getServerSession as jest.Mock;
const mockedRunFlow = require('../lib/flow/runFlow').runFlow as jest.Mock;
const mockedLoadFlow = require('../lib/flow/loadFlow').loadFlow as jest.Mock;
const mockedSchedule =
  require('../lib/data/schedule').fetchSchedule as jest.Mock;

function createReqRes() {
  const req: any = { method: 'POST', body: { league: 'NFL', gameId: 'g1' } };
  const json = jest.fn();
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json,
    setHeader: jest.fn(),
    end: jest.fn(),
  };
  return { req, res, json };
}

function createPurgeReqRes(params: any, headers: any = {}) {
  const req: any = { method: 'POST', query: params, headers };
  const json = jest.fn();
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json,
    setHeader: jest.fn(),
    end: jest.fn(),
  };
  return { req, res, json };
}

beforeEach(() => {
  __clearRunAgentsCache();
  __store.clear();
  mockedSession.mockReset().mockResolvedValue({ user: { id: '1' } });
  mockedLoadFlow.mockReset().mockResolvedValue({
    name: 'flow',
    agents: ['injuryScout'],
  });
  mockedSchedule.mockReset().mockResolvedValue([
    { gameId: 'g1', homeTeam: 'A', awayTeam: 'B', matchDay: 1 },
  ]);
  let runId = 0;
  mockedRunFlow.mockReset().mockImplementation(async () => {
    runId += 1;
    return {
      outputs: { injuryScout: { team: 'A', score: runId, reasoning: 'ok' } },
      executions: [],
    };
  });
  __setRunAgentsCacheTtl(60);
  delete process.env.RUN_AGENTS_CACHE_TTL_SECONDS;
  delete process.env.ADMIN_API_KEY;
  process.env.NODE_ENV = 'test';
});

afterEach(() => {
  jest.clearAllMocks();
});

test('TTL respects env override', async () => {
  jest.useFakeTimers();
  process.env.RUN_AGENTS_CACHE_TTL_SECONDS = '120';
  __setRunAgentsCacheTtl(120);
  const { req, res } = createReqRes();
  await handler(req, res);
  jest.advanceTimersByTime(60000);
  const { req: req2, res: res2 } = createReqRes();
  await handler(req2, res2);
  expect(mockedRunFlow).toHaveBeenCalledTimes(1);
  jest.advanceTimersByTime(60000);
  jest.advanceTimersByTime(1);
  const { req: req3, res: res3 } = createReqRes();
  await handler(req3, res3);
  expect(mockedRunFlow).toHaveBeenCalledTimes(2);
  jest.useRealTimers();
});

test('purge removes matching entries in both caches', async () => {
  process.env.ADMIN_API_KEY = 'secret';
  const { req, res } = createReqRes();
  await handler(req, res);
  expect(mockedRunFlow).toHaveBeenCalledTimes(1);
  expect(__store.size).toBe(1);
  const { req: preq, res: pres } = createPurgeReqRes(
    { prefix: 'NFL' },
    { admin_api_key: 'secret' },
  );
  await purge(preq, pres);
  expect(pres.status).toHaveBeenCalledWith(200);
  expect(__store.size).toBe(0);
  const { req: req2, res: res2 } = createReqRes();
  await handler(req2, res2);
  expect(mockedRunFlow).toHaveBeenCalledTimes(2);
});

test('400 error when no filters provided', async () => {
  process.env.ADMIN_API_KEY = 'secret';
  const { req: preq, res: pres, json } = createPurgeReqRes(
    {},
    { admin_api_key: 'secret' },
  );
  await purge(preq, pres);
  expect(pres.status).toHaveBeenCalledWith(400);
  expect(json).toHaveBeenCalledWith({ error: 'Must provide key or prefix' });
});

test('admin key required', async () => {
  process.env.ADMIN_API_KEY = 'secret';
  const { req: preq, res: pres } = createPurgeReqRes({ prefix: 'NFL' }, {});
  await purge(preq, pres);
  expect(pres.status).toHaveBeenCalledWith(401);
});

test('_cached flag appears only in dev mode and only on cache hits', async () => {
  process.env.NODE_ENV = 'development';
  const { req, res, json } = createReqRes();
  await handler(req, res);
  expect(json.mock.calls[0][0]._cached).toBeUndefined();
  const { req: req2, res: res2, json: json2 } = createReqRes();
  await handler(req2, res2);
  expect(json2.mock.calls[0][0]._cached).toBe(true);
  process.env.NODE_ENV = 'production';
  const { req: req3, res: res3, json: json3 } = createReqRes();
  await handler(req3, res3);
  expect(json3.mock.calls[0][0]._cached).toBeUndefined();
});

