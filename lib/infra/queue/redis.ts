import Redis from 'ioredis';
import { QueueDriver } from './driver';
import { ENV } from '../../env';

export class RedisQueueDriver implements QueueDriver {
  private client: Redis;
  constructor() {
    this.client = new Redis(ENV.REDIS_URL);
  }

  async enqueue<T>(queue: string, item: T): Promise<void> {
    await this.client.rpush(queue, JSON.stringify(item));
  }

  async dequeue<T>(queue: string): Promise<T | null> {
    const res = await this.client.lpop(queue);
    return res ? (JSON.parse(res) as T) : null;
  }

  async size(queue: string): Promise<number> {
    return await this.client.llen(queue);
  }
}
