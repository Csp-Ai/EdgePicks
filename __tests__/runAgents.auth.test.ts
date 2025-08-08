/** @jest-environment node */
import handler from '../pages/api/run-agents';
import { getServerSession } from 'next-auth/next';
import { runFlow } from '../lib/flow/runFlow';
import { logToSupabase } from '../lib/logToSupabase';

jest.mock('next-auth/next');
jest.mock('../lib/flow/runFlow');
jest.mock('../lib/logToSupabase');

const mockedGetSession = getServerSession as jest.Mock;
const mockedRunFlow = runFlow as jest.Mock;

describe('run-agents auth', () => {
  beforeEach(() => {
    mockedRunFlow.mockResolvedValue({
      outputs: {},
      executions: [],
    });
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_MOCK_AUTH;
    jest.clearAllMocks();
  });

  it('returns 401 when no session and LIVE_MODE on', async () => {
    mockedGetSession.mockResolvedValue(null);
    const req: any = { query: { homeTeam: 'A', awayTeam: 'B', week: '1' } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockedRunFlow).not.toHaveBeenCalled();
  });

  it('allows when session exists', async () => {
    mockedGetSession.mockResolvedValue({ user: { name: 'Test' } });
    const req: any = {
      query: { homeTeam: 'A', awayTeam: 'B', week: '1', sessionId: '1' },
    };
    const res: any = {
      setHeader: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
      flushHeaders: jest.fn(),
      status: jest.fn(),
      json: jest.fn(),
    };

    await handler(req, res);

    expect(mockedRunFlow).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(401);
  });

  it('allows without session when NEXT_PUBLIC_MOCK_AUTH=1', async () => {
    process.env.NEXT_PUBLIC_MOCK_AUTH = '1';
    mockedGetSession.mockResolvedValue(null);
    const req: any = {
      query: { homeTeam: 'A', awayTeam: 'B', week: '1', sessionId: '1' },
    };
    const res: any = {
      setHeader: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
      flushHeaders: jest.fn(),
      status: jest.fn(),
      json: jest.fn(),
    };

    await handler(req, res);

    expect(mockedRunFlow).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(401);
  });
});
