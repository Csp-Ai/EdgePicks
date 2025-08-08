/** @jest-environment node */
import { getServerSession } from 'next-auth/next';
import { runFlow } from '../lib/flow/runFlow';
import { loadFlow } from '../lib/flow/loadFlow';
import { getDynamicWeights } from '../lib/weights';
import { ENV } from '../lib/env';

jest.mock('next-auth/next');
jest.mock('../lib/flow/runFlow');
jest.mock('../lib/flow/loadFlow');
jest.mock('../lib/logToSupabase', () => ({ logToSupabase: jest.fn(), logMatchup: jest.fn() }));
jest.mock('../lib/server/logEvent', () => ({ logEvent: jest.fn() }));
jest.mock('../lib/weights');

process.env.GOOGLE_CLIENT_ID = 'gid';
process.env.GOOGLE_CLIENT_SECRET = 'gsec';
process.env.SUPABASE_KEY = 'key';
process.env.SUPABASE_URL = 'http://localhost';
process.env.NEXTAUTH_SECRET = 'secret';
process.env.NEXTAUTH_URL = 'http://localhost';
process.env.SPORTS_API_KEY = 'sports';

const handler = require('../pages/api/run-predictions').default;

const mockedSession = getServerSession as jest.Mock;
const mockedRunFlow = runFlow as jest.Mock;
const mockedLoadFlow = loadFlow as jest.Mock;
const mockedWeights = getDynamicWeights as jest.Mock;

describe('run-predictions dynamic weights', () => {
  beforeEach(() => {
    mockedSession.mockResolvedValue({ user: { id: '1' } });
    mockedLoadFlow.mockResolvedValue({ agents: ['injuryScout'] });
    mockedRunFlow.mockResolvedValue({
      outputs: { injuryScout: { team: 'A', score: 0.9, reason: 'ok' } },
      executions: [],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uses dynamic weights when enabled', async () => {
    ENV.WEIGHTS_DYNAMIC = 'on' as any;
    mockedWeights.mockResolvedValue({ injuryScout: 0.8 });

    const req: any = {
      method: 'POST',
      headers: {},
      body: {
        league: 'NFL',
        games: [{ homeTeam: { name: 'A' }, awayTeam: { name: 'B' }, time: 't' }],
      },
    };
    const json = jest.fn();
    const res: any = { status: jest.fn().mockReturnThis(), json };

    await handler(req, res);

    expect(mockedWeights).toHaveBeenCalled();
    const data = json.mock.calls[0][0];
    expect(data.weightsUsed.injuryScout).toBe(0.8);
    expect(data.predictions[0].confidence).toBe(72);
  });

  it('falls back to static weights when disabled', async () => {
    ENV.WEIGHTS_DYNAMIC = 'off' as any;
    mockedWeights.mockResolvedValue({ injuryScout: 0.8 });

    const req: any = {
      method: 'POST',
      headers: {},
      body: {
        league: 'NFL',
        games: [{ homeTeam: { name: 'A' }, awayTeam: { name: 'B' }, time: 't' }],
      },
    };
    const json = jest.fn();
    const res: any = { status: jest.fn().mockReturnThis(), json };

    await handler(req, res);

    const data = json.mock.calls[0][0];
    expect(data.weightsUsed.injuryScout).toBe(0.5);
    expect(data.predictions[0].confidence).toBe(45);
  });
});
