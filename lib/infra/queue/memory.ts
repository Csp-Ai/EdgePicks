import { QueueDriver } from './driver';

export class MemoryQueueDriver implements QueueDriver {
  private queues: Record<string, any[]> = {};

  async enqueue<T>(queue: string, item: T): Promise<void> {
    if (!this.queues[queue]) this.queues[queue] = [];
    this.queues[queue].push(item);
  }

  async dequeue<T>(queue: string): Promise<T | null> {
    const q = this.queues[queue];
    if (!q || q.length === 0) return null;
    return q.shift() as T;
  }

  async size(queue: string): Promise<number> {
    return this.queues[queue]?.length || 0;
  }
}
