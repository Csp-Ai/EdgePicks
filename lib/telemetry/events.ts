import { z } from 'zod';

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
