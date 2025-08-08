import { DASHBOARD_EVENTS, dashboardEventSchema } from '../lib/telemetry/events';

describe('dashboard telemetry events', () => {
  test('all known events validate', () => {
    Object.values(DASHBOARD_EVENTS).forEach((type) => {
      expect(() => dashboardEventSchema.parse({ type })).not.toThrow();
    });
  });

  test('unknown events fail validation', () => {
    expect(() => dashboardEventSchema.parse({ type: 'unknown' })).toThrow();
  });
});
