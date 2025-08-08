import type { TelemetryEvent, TelemetryHandler } from './schema';

export class EventBuffer<E extends TelemetryEvent = TelemetryEvent> {
  private queue: E[] = [];
  private handler?: TelemetryHandler<E>;

  wire(handler: TelemetryHandler<E>): void {
    this.handler = handler;
    // flush existing queue when wired
    if (this.queue.length) {
      const pending = this.queue.slice();
      this.queue.length = 0;
      pending.forEach((e) => handler(e));
    }
  }

  enqueue(event: E): void {
    if (this.handler) {
      this.handler(event);
    } else if (process.env.NODE_ENV !== 'production') {
      this.queue.push(event);
    }
  }

  dequeue(): E | undefined {
    if (process.env.NODE_ENV === 'production' && !this.handler) {
      return undefined;
    }
    return this.queue.shift();
  }

  size(): number {
    return this.queue.length;
  }
}
