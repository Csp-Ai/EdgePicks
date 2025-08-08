import { setCacheDriver } from '../lib/infra/cache';
import { MemoryCacheDriver } from '../lib/infra/cache/memory';

jest.mock('../lib/analytics/logUiEvent', () => ({
  logAdapterMetric: jest.fn(),
}));

describe('adapters contract', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.LIVE_MODE = 'on';
    process.env.ODDS_API_KEY = 'key';
    setCacheDriver(new MemoryCacheDriver());
  });

  test('injuries invalid schema falls back to mock', async () => {
    const { fetchInjuries } = await import('../lib/data/injuries');
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: async () => [{ team: 1 }],
    } as any);
    const data = await fetchInjuries('NFL' as any);
    expect(data).toEqual([]);
  });

  test(
    'odds timeout returns mock',
    async () => {
      jest.setTimeout(10000);
      const { fetchOdds } = await import('../lib/data/odds');
      global.fetch = jest.fn((_url, opts) => {
        const signal = (opts as RequestInit).signal as AbortSignal;
        return new Promise((_resolve, reject) => {
          signal.addEventListener('abort', () => reject(new Error('Aborted')));
        });
      }) as any;
      const data = await fetchOdds('NFL' as any);
      expect(data).toEqual([]);
    },
    15000,
  );
});
