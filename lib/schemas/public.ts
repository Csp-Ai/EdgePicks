import { z } from "zod";

export const PublicPredictionSchema = z.object({
  gameId: z.string(),
  league: z.string(),
  home: z.string(),
  away: z.string(),
  kickoffISO: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), "kickoffISO must be ISO datetime"),
  confidence: z.number().min(0).max(1).optional(),
  disagreement: z.boolean().optional(),
});

export const PublicPredictionListSchema = z.array(PublicPredictionSchema);
export type PublicPrediction = z.infer<typeof PublicPredictionSchema>;
