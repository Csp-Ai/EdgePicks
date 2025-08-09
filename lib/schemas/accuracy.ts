import { z } from 'zod';

const accuracyEntrySchema = z.object({
  name: z.string(),
  wins: z.number(),
  losses: z.number(),
  accuracy: z.number(),
});

export const accuracySchema = z.object({
  agents: z.array(accuracyEntrySchema),
  flows: z.array(accuracyEntrySchema),
});

export type AccuracyResponse = z.infer<typeof accuracySchema>;
