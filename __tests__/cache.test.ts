import { createMemoryStore, getCache, setCache, withTtl } from '../lib/server/cache';

describe.skip('cache helpers', () => {
  it('returns cached value on hit', async () => {
    const store = createMemoryStore();
    const fn = jest.fn(async () => 'value');
    const first = await withTtl('a', 60, fn, store);
    const second = await withTtl('a', 60, fn, store);
    expect(first).toBe('value');
    expect(second).toBe('value');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('expires entries after TTL', async () => {
    jest.useFakeTimers();
    const store = createMemoryStore();
    let counter = 0;
    const fn = jest.fn(async () => ++counter);
    const first = await withTtl('b', 1, fn, store);
    jest.advanceTimersByTime(1001);
    const second = await withTtl('b', 1, fn, store);
    expect(first).toBe(1);
    expect(second).toBe(2);
    expect(fn).toHaveBeenCalledTimes(2);
    jest.useRealTimers();
  });

  it('serializes values to avoid mutation', async () => {
    const store = createMemoryStore();
    const obj = { a: 1 };
    await setCache('c', obj, 60, store);
    obj.a = 2;
    const cached = await getCache<{ a: number }>('c', store);
    expect(cached).toEqual({ a: 1 });
    if (cached) cached.a = 3;
    const cachedAgain = await getCache<{ a: number }>('c', store);
    expect(cachedAgain).toEqual({ a: 1 });
  });
});
