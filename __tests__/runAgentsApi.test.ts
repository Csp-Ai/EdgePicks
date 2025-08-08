/** @jest-environment node */
import handler from '../pages/api/run-agents';
import { runFlow } from '../lib/flow/runFlow';
import { logToSupabase } from '../lib/logToSupabase';
import { logEvent } from '../lib/server/logEvent';

jest.mock('../lib/flow/runFlow');
jest.mock('../lib/logToSupabase');
jest.mock('../lib/server/logEvent');

const mockedRunFlow = runFlow as jest.Mock;
const mockedLog = logToSupabase as jest.Mock;
const mockedLogEvent = logEvent as jest.Mock;

describe('run-agents API', () => {
  it('streams agent results and logs summary', async () => {
    mockedRunFlow.mockResolvedValue({
      outputs: {
        injuryScout: { team: 'A', score: 0.7, reason: 'healthy' },
      },
      executions: [
        {
          name: 'injuryScout',
          result: { team: 'A', score: 0.7, reason: 'healthy' },
        },
      ],
    });

    const req: any = {
      query: { homeTeam: 'A', awayTeam: 'B', week: '1', sessionId: 'test-session' },
      headers: {},
    };
    const chunks: string[] = [];
    const res: any = {
      setHeader: jest.fn(),
      write: (c: string) => chunks.push(c),
      end: jest.fn(),
      flush: jest.fn(),
      flushHeaders: jest.fn(),
    };

    await handler(req, res);

    expect(mockedRunFlow).toHaveBeenCalled();
    expect(mockedLog).toHaveBeenCalled();
    expect(mockedLogEvent).toHaveBeenCalled();
    const summary = chunks.find((c) => c.includes('summary'));
    expect(summary).toBeDefined();
  });

  it('matches snapshot of agent stream', async () => {
    mockedRunFlow.mockResolvedValue({
      outputs: {
        injuryScout: { team: 'A', score: 0.72, reason: 'Key WR out' },
      },
      executions: [
        {
          name: 'injuryScout',
          result: { team: 'A', score: 0.72, reason: 'Key WR out' },
        },
      ],
    });

    const req: any = {
      query: { homeTeam: 'A', awayTeam: 'B', week: '1', sessionId: 'test-session' },
      headers: {},
    };
    const chunks: string[] = [];
    const res: any = {
      setHeader: jest.fn(),
      write: (c: string) => chunks.push(c),
      end: jest.fn(),
      flush: jest.fn(),
      flushHeaders: jest.fn(),
    };

    await handler(req, res);

    expect(chunks.join('')).toMatchSnapshot();
  });
});
