import { z } from 'zod';

export const telemetryEventSchema = z.object({
  type: z.string(),
  payload: z.record(z.any()).optional(),
});

export type TelemetryEvent = z.infer<typeof telemetryEventSchema>;

export type TelemetryHandler<E extends TelemetryEvent = TelemetryEvent> = (
  event: E
) => void;
