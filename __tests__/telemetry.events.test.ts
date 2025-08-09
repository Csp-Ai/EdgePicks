
import {
  uiEventNameSchema,
  DASHBOARD_EVENTS,
  dashboardEventSchema,
} from '../lib/telemetry/events';
import { logEvent } from '../lib/telemetry/logger';
import { mockTelemetry } from '../test/utils/mockTelemetry';

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

describe('telemetry emission', () => {
  it('collects logged events', async () => {
    const { events } = mockTelemetry();
    jest.useFakeTimers();
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
    Object.defineProperty(navigator, 'userAgent', { value: 'jest', configurable: true });
    setTimeout(() => {
      logEvent({ level: 'info', name: 'test' });
    }, 1000);
    jest.advanceTimersByTime(1000);
    await Promise.resolve();
    expect(events).toEqual([{ level: 'info', name: 'test' }]);
  });
});
