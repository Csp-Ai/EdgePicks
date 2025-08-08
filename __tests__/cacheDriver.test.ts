import { MemoryCacheDriver } from '../lib/infra/cache/memory';

describe('MemoryCacheDriver', () => {
  it('stores values with TTL', async () => {
    const cache = new MemoryCacheDriver();
    await cache.set('a', 'b', 0.1);
    expect(await cache.get<string>('a')).toBe('b');
    await new Promise((r) => setTimeout(r, 150));
    expect(await cache.get<string>('a')).toBeNull();
  });
});
