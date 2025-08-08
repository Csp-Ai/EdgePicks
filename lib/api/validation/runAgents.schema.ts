import { z } from 'zod';
import { registry, type AgentName } from '../../agents/registry';

const leagueSchema = z.enum(['NFL', 'MLB', 'NBA', 'NHL'], {
  required_error: 'league required',
});

const agentNames = registry.map((a) => a.name) as [AgentName, ...AgentName[]];
const agentNameSchema = z.enum(agentNames);

export const runAgentsBodySchema = z.object({
  league: leagueSchema,
  gameId: z.string({
    required_error: 'gameId required',
    invalid_type_error: 'gameId must be a string',
  }),
  agents: z
    .array(agentNameSchema, {
      invalid_type_error: 'agents must be an array',
    })
    .optional(),
});

export type RunAgentsBody = z.infer<typeof runAgentsBodySchema>;

export function parseRunAgentsBody(json: unknown): RunAgentsBody {
  return runAgentsBodySchema.parse(json);
}
