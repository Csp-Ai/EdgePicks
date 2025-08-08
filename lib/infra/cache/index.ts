import { ENV } from '../../env';
import { CacheDriver } from './driver';
import { MemoryCacheDriver } from './memory';
import { RedisCacheDriver } from './redis';

let driver: CacheDriver;

function init() {
  if (driver) return;
  driver = ENV.CACHE_DRIVER === 'redis' ? new RedisCacheDriver() : new MemoryCacheDriver();
}

export function getCacheDriver(): CacheDriver {
  init();
  return driver;
}

export function setCacheDriver(d: CacheDriver) {
  driver = d;
}
