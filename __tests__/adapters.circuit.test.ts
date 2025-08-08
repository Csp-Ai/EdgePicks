import { setCacheDriver } from '../lib/infra/cache';
import { MemoryCacheDriver } from '../lib/infra/cache/memory';

jest.mock('../lib/analytics/logUiEvent', () => ({
  logAdapterMetric: jest.fn(),
}));

describe('adapter circuit breaker', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.LIVE_MODE = 'on';
    setCacheDriver(new MemoryCacheDriver());
  });

  test('trips circuit after error budget', async () => {
    const { fetchStats, ERROR_BUDGET } = await import('../lib/data/stats');
    const fetchMock = jest.fn().mockRejectedValue(new Error('fail'));
    global.fetch = fetchMock as any;
    for (let i = 0; i < ERROR_BUDGET; i++) {
      await fetchStats('NFL' as any);
    }
    fetchMock.mockClear();
    await fetchStats('NFL' as any);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
