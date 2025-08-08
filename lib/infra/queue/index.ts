import { ENV } from '../../env';
import { QueueDriver } from './driver';
import { MemoryQueueDriver } from './memory';
import { RedisQueueDriver } from './redis';

let driver: QueueDriver;

function init() {
  if (driver) return;
  driver = ENV.QUEUE_DRIVER === 'redis' ? new RedisQueueDriver() : new MemoryQueueDriver();
}

export function getQueueDriver(): QueueDriver {
  init();
  return driver;
}

export function setQueueDriver(d: QueueDriver) {
  driver = d;
}
