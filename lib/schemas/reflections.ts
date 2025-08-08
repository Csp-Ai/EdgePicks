import { z } from 'zod';

export const agentReflectionSchema = z.object({
  whatIObserved: z.string(),
  whatIChose: z.string(),
  whatCouldImprove: z.string(),
});

export const reflectionsSchema = z.record(agentReflectionSchema);

export type ReflectionsResponse = z.infer<typeof reflectionsSchema>;
