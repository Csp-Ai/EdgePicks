import { z } from 'zod';

// Existing logUiEvent event names used throughout the app
const legacyEvents = [
  'adapterMetric',
  'apiRunAgents',
  'landingRunPredictions',
  'landingPredictionComplete',
  'landingPredictionError',
  'runPredictions',
  'prediction_tracker_complete',
] as const;

// Onboarding funnel events
export const onboardingEvents = [
  'onboardingStart',
  'onboardingStep',
  'onboardingComplete',
] as const;

// Builder funnel events
export const builderEvents = [
  'builderOpen',
  'builderStep',
  'builderComplete',
] as const;

const allEvents = [
  ...legacyEvents,
  ...onboardingEvents,
  ...builderEvents,
] as const;

export const uiEventNameSchema = z.enum(allEvents);
export type UiEventName = z.infer<typeof uiEventNameSchema>;
