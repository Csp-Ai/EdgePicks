import { z } from 'zod';

export const agentEventSchema = z.object({
  type: z.enum(['start', 'result', 'error', 'end']),
  agentId: z.string(),
  ts: z.number(),
  payload: z
    .object({
      team: z.string().optional(),
      score: z.number().optional(),
      reason: z.string().optional(),
      warning: z.string().optional(),
    })
    .optional(),
});

export type AgentEvent = z.infer<typeof agentEventSchema>;

export const predictionFinalSchema = z.object({
  winner: z.string(),
  confidence: z.number(),
  reasons: z.array(z.string()),
});

export type PredictionFinal = z.infer<typeof predictionFinalSchema>;

export const agentRunSchema = z.object({
  events: z.array(agentEventSchema),
  final: predictionFinalSchema,
});

export type AgentRun = z.infer<typeof agentRunSchema>;
