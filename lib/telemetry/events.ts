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
export const DASHBOARD_EVENTS = {
  OPEN_DRAWER: 'openDrawer',
  TOGGLE_ADVANCED_VIEW: 'toggleAdvancedView',
  RUN_FLOW: 'runFlow',
  REVEAL_PREDICTIONS: 'revealPredictions',
} as const;

export const dashboardEventSchema = z.object({
  type: z.enum([
    DASHBOARD_EVENTS.OPEN_DRAWER,
    DASHBOARD_EVENTS.TOGGLE_ADVANCED_VIEW,
    DASHBOARD_EVENTS.RUN_FLOW,
    DASHBOARD_EVENTS.REVEAL_PREDICTIONS,
  ]),
});

export type DashboardEvent = z.infer<typeof dashboardEventSchema>;
export type DashboardEventType = (typeof DASHBOARD_EVENTS)[keyof typeof DASHBOARD_EVENTS];

