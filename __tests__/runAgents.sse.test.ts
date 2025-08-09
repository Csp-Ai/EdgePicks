/** @jest-environment node */
import { runFlow } from '../lib/flow/runFlow';

jest.mock('../lib/flow/runFlow');

const handler = require('../pages/api/run-agents').default;
const mockedRunFlow = runFlow as jest.Mock;

describe('run-agents SSE API', () => {
  it('streams lifecycle, agent, and summary messages', async () => {
    mockedRunFlow.mockImplementation(
      async (_flow, _matchup, onAgent, onLifecycle) => {
        onLifecycle?.({ name: 'injuryScout', status: 'started', startedAt: 1 });
        onAgent?.({
          name: 'injuryScout',
          result: { team: 'A', score: 0.7, reason: 'ok' },
        });
        onLifecycle?.({
          name: 'injuryScout',
          status: 'completed',
          startedAt: 1,
          endedAt: 2,
          durationMs: 1,
        });
        return {
          outputs: {
            injuryScout: { team: 'A', score: 0.7, reason: 'ok' },
          },
          executions: [],
        };
      },
    );

    const write = jest.fn();
    const end = jest.fn();
    const setHeader = jest.fn();

    const req: any = {
      method: 'GET',
      query: { homeTeam: 'A', awayTeam: 'B', week: '1' },
    };
    const res: any = { setHeader, write, end };

    await handler(req, res);

    const messages = write.mock.calls.map((c) => c[0]);
    expect(setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
    expect(messages.some((m: string) => m.includes('"type":"lifecycle"'))).toBe(true);
    expect(messages.some((m: string) => m.includes('"type":"agent"'))).toBe(true);
    expect(messages.some((m: string) => m.includes('"type":"summary"'))).toBe(true);
    expect(end).toHaveBeenCalled();
  });
});

