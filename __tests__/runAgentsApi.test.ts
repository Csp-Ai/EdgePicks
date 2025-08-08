/** @jest-environment node */
import { runFlow } from '../lib/flow/runFlow';
import { fetchSchedule } from '../lib/data/schedule';

jest.mock('../lib/flow/runFlow');
jest.mock('../lib/data/schedule');

process.env.LIVE_MODE = 'on';
process.env.NEXT_PUBLIC_MOCK_AUTH = '1';

const handler = require('../pages/api/run-agents').default;
const mockedRunFlow = runFlow as jest.Mock;
const mockedSchedule = fetchSchedule as jest.Mock;

describe('run-agents API', () => {
  beforeEach(() => {
    mockedSchedule.mockResolvedValue([
      { homeTeam: 'A', awayTeam: 'B', time: '', league: 'NFL', gameId: '1' },
    ]);
    mockedRunFlow.mockResolvedValue({
      outputs: {
        injuryScout: { team: 'A', score: 0.7, reason: 'healthy' },
      },
    });
  });

  it('returns pick and agents', async () => {
    const req: any = { method: 'POST', body: { league: 'NFL', gameId: '1' } };
    const json = jest.fn();
    const res: any = { status: jest.fn().mockReturnThis(), json };

    await handler(req, res);

    expect(mockedRunFlow).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      pick: 'A',
      finalConfidence: 0.35,
      agents: { injuryScout: { team: 'A', score: 0.7, reason: 'healthy' } },
    });
  });

  it('matches snapshot', async () => {
    mockedRunFlow.mockResolvedValueOnce({
      outputs: {
        injuryScout: { team: 'A', score: 0.72, reason: 'Key WR out' },
      },
    });

    const req: any = { method: 'POST', body: { league: 'NFL', gameId: '1' } };
    const json = jest.fn();
    const res: any = { status: jest.fn().mockReturnThis(), json };

    await handler(req, res);
    expect(json.mock.calls[0][0]).toMatchSnapshot();
  });
});

