import * as logger from '../../lib/telemetry/logger';
import type { TelemetryEvent } from '../../lib/telemetry/logger';

export function mockTelemetry() {
  const events: TelemetryEvent[] = [];
  jest.spyOn(logger, 'logEvent').mockImplementation(async (e: TelemetryEvent) => {
    events.push(e);
  });
  return { events };
}
