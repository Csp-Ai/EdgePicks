import { z } from 'zod';
import { logAgentReflection } from './utils';
import type { AgentReflection } from '../../types/AgentReflection';
import type { Matchup } from '../types';

// Ensure matchup type has required fields
const TeamSchema = z.object({
  name: z.string(),
  score: z.number().optional(),
}).passthrough();

// --- Schemas ---
const MatchupSchema = z.object({
  homeTeam: TeamSchema,
  awayTeam: TeamSchema,
  date: z.string().optional(),
  odds: z.object({
    home: z.number(),
    away: z.number()
  }).optional(),
}).passthrough();

const AgentOutputSchema = z.object({
  team: z.string(),
  reason: z.string().optional(),
  confidence: z.number().optional(),
});

const AgentOutputsSchema = z.record(AgentOutputSchema);

export const GuardianAgentResultSchema = z.object({
  team: z.string(),
  score: z.number(),
  reason: z.string(),
  warnings: z.array(z.string()).optional(),
});

export type GuardianMatchup = z.infer<typeof MatchupSchema>;
export type GuardianAgentOutputs = Partial<z.infer<typeof AgentOutputsSchema>>;
export type GuardianAgentResult = z.infer<typeof GuardianAgentResultSchema>;

const entries = <T extends Record<string, unknown>>(obj: T) =>
  Object.entries(obj) as [keyof T, T[keyof T]][];

/**
 * Reviews previous agent outputs for inconsistencies or missing data
 * and returns any warnings discovered. Does not contribute to scoring
 * but surfaces potential issues with agent reasoning.
 */
export const guardianAgent = async (
  matchup: Matchup,
  agents: GuardianAgentOutputs = {},
): Promise<GuardianAgentResult> => {
  const warnings: string[] = [];
  const results = entries(agents);

  if (results.length === 0) {
    warnings.push('No agent outputs available for review.');
  } else {
    // Check for missing reasoning
    for (const [name, result] of results) {
      const parsed = AgentOutputSchema.safeParse(result);
      if (!parsed.success || !parsed.data.reason || parsed.data.reason.trim().length < 5) {
        warnings.push(`Agent ${String(name)} provided incomplete reasoning.`);
      }
    }

    // Check if agents disagree on predicted winner
    const teams = new Set(
      results.map(([_, r]) => AgentOutputSchema.parse(r).team),
    );
    if (teams.size > 1) {
      warnings.push('Agents disagree on the predicted winner.');
    }
  }

  const reason = 'Guardian review completed';
  const reflection: AgentReflection = {
    whatIObserved: warnings.join('; ') || 'All clear',
    whatIChose: 'Reported review findings',
    whatCouldImprove: 'Add more consistency checks',
  };
  await logAgentReflection('guardianAgent', reflection);

  const m = MatchupSchema.parse(matchup);
  
  // Determine most confident pick
  let topTeam = m.homeTeam.name;
  let maxConfidence = 0;
  
  results.forEach(([_, result]) => {
    const parsed = AgentOutputSchema.parse(result);
    const confidence = parsed.confidence || 0;
    if (confidence > maxConfidence) {
      maxConfidence = confidence;
      topTeam = parsed.team;
    }
  });

  return GuardianAgentResultSchema.parse({
    team: topTeam,
    score: maxConfidence,
    reason: warnings.length > 0 ? `Review completed with warnings: ${warnings.join('; ')}` : reason,
    warnings: warnings.length > 0 ? warnings : undefined,
  });
};

export default guardianAgent;
