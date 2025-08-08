
import {
  uiEventNameSchema,
  DASHBOARD_EVENTS,
  dashboardEventSchema,
} from '../lib/telemetry/events';

describe('uiEventNameSchema', () => {
  it('accepts onboarding and builder events', () => {
    expect(uiEventNameSchema.parse('onboardingStart')).toBe('onboardingStart');
    expect(uiEventNameSchema.parse('builderOpen')).toBe('builderOpen');
  });

  it('rejects unknown events', () => {
    expect(() => uiEventNameSchema.parse('unknownEvent')).toThrow();
  });
});

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
