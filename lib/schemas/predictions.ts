import { z } from 'zod';
import { agentReflectionSchema } from './reflections';

const agentResultSchema = z.object({
  team: z.string(),
  score: z.number(),
  reason: z.string().optional(),
  warnings: z.array(z.string()).optional(),
  reflection: agentReflectionSchema.optional(),
  weight: z.number().optional(),
  scoreTotal: z.number().optional(),
  confidenceEstimate: z.number().optional(),
  description: z.string().optional(),
});

const agentExecutionSchema = z.object({
  name: z.string(),
  result: agentResultSchema.optional(),
  error: z.literal(true).optional(),
  errorInfo: z
    .object({ message: z.string().optional(), stack: z.string().optional() })
    .optional(),
  scoreTotal: z.number().optional(),
  confidenceEstimate: z.number().optional(),
  agentDurationMs: z.number().optional(),
  sessionId: z.string().optional(),
});

const gameSchema = z.object({
  homeTeam: z.object({ name: z.string() }),
  awayTeam: z.object({ name: z.string() }),
  time: z.string(),
});

const predictionSchema = z.object({
  game: gameSchema,
  winner: z.string(),
  confidence: z.number(),
  agents: z.record(agentResultSchema),
  agentScores: z.record(z.number()),
  executions: z.array(agentExecutionSchema),
});

export const predictionsSchema = z.object({
  predictions: z.array(predictionSchema),
  agentScores: z.record(z.number()),
  weightsUsed: z.record(z.number()),
  timestamp: z.string(),
  cacheVersion: z.string(),
});

export type PredictionsResponse = z.infer<typeof predictionsSchema>;
