import { uiEventNameSchema } from '../lib/telemetry/events';

describe('uiEventNameSchema', () => {
  it('accepts onboarding and builder events', () => {
    expect(uiEventNameSchema.parse('onboardingStart')).toBe('onboardingStart');
    expect(uiEventNameSchema.parse('builderOpen')).toBe('builderOpen');
  });

  it('rejects unknown events', () => {
    expect(() => uiEventNameSchema.parse('unknownEvent')).toThrow();
  });
});
