import { EventBuffer } from '../lib/telemetry/buffer';
import type { TelemetryEvent } from '../lib/telemetry/schema';

describe('EventBuffer', () => {
  it('enqueues and dequeues events', () => {
    const buffer = new EventBuffer<TelemetryEvent>();
    const evt: TelemetryEvent = { type: 'test', payload: { foo: 'bar' } };
    buffer.enqueue(evt);
    expect(buffer.dequeue()).toEqual(evt);
    expect(buffer.dequeue()).toBeUndefined();
  });
});
