/** @jest-environment node */
import { getServerSession } from 'next-auth/next';
import { runFlow } from '../lib/flow/runFlow';
import { fetchSchedule } from '../lib/data/schedule';

jest.mock('next-auth/next');
jest.mock('../lib/flow/runFlow');
jest.mock('../lib/data/schedule');

process.env.LIVE_MODE = 'on';

const handler = require('../pages/api/run-agents').default;
const mockedGetSession = getServerSession as jest.Mock;
const mockedRunFlow = runFlow as jest.Mock;
const mockedSchedule = fetchSchedule as jest.Mock;

describe('run-agents auth', () => {
  beforeEach(() => {
    mockedSchedule.mockResolvedValue([
      { homeTeam: 'A', awayTeam: 'B', time: '', league: 'NFL', gameId: '1' },
    ]);
    mockedRunFlow.mockResolvedValue({ outputs: {} });
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_MOCK_AUTH;
    jest.clearAllMocks();
  });

  it('returns 401 when no session and LIVE_MODE on', async () => {
    mockedGetSession.mockResolvedValue(null);
    const req: any = { method: 'POST', body: { league: 'NFL', gameId: '1' } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockedRunFlow).not.toHaveBeenCalled();
  });

  it('allows when session exists', async () => {
    mockedGetSession.mockResolvedValue({ user: { name: 'Test' } });
    const req: any = { method: 'POST', body: { league: 'NFL', gameId: '1' } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await handler(req, res);

    expect(mockedRunFlow).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('allows without session when NEXT_PUBLIC_MOCK_AUTH=1', async () => {
    process.env.NEXT_PUBLIC_MOCK_AUTH = '1';
    mockedGetSession.mockResolvedValue(null);
    const req: any = { method: 'POST', body: { league: 'NFL', gameId: '1' } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await handler(req, res);

    expect(mockedRunFlow).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

