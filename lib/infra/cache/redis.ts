import Redis from 'ioredis';
import { CacheDriver } from './driver';
import { ENV } from '../../env';

export class RedisCacheDriver implements CacheDriver {
  private client: Redis;
  constructor() {
    this.client = new Redis(ENV.REDIS_URL);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }
}
