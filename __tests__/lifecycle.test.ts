import { getAllAgentLogs, clearAgentLogs } from '../lib/agentLogsStore';

describe('agent lifecycle logs', () => {
  beforeAll(async () => {
    await clearAgentLogs();
  });

  it('matches snapshot', async () => {
    const logs = await getAllAgentLogs();
    expect(logs).toMatchSnapshot();
  });
});
