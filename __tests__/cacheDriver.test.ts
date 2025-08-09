import { MemoryCacheDriver } from '../lib/infra/cache/memory';

describe('MemoryCacheDriver', () => {
  it('stores values with TTL', async () => {
    jest.useFakeTimers({ now: new Date('2024-01-01T00:00:00Z') });
    const cache = new MemoryCacheDriver();
    await cache.set('a', 'b', 0.1);
    expect(await cache.get<string>('a')).toBe('b');
    jest.advanceTimersByTime(150);
    expect(await cache.get<string>('a')).toBeNull();
    jest.useRealTimers();
  });
});
