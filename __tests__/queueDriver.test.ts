import { MemoryQueueDriver } from '../lib/infra/queue/memory';

describe('MemoryQueueDriver', () => {
  it('enqueues and dequeues items', async () => {
    const driver = new MemoryQueueDriver();
    await driver.enqueue('q', 1);
    await driver.enqueue('q', 2);
    expect(await driver.size('q')).toBe(2);
    expect(await driver.dequeue<number>('q')).toBe(1);
    expect(await driver.dequeue<number>('q')).toBe(2);
    expect(await driver.dequeue<number>('q')).toBeNull();
  });
});
