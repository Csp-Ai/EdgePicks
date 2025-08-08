import { z } from 'zod';

export const agentSpecSchema = z.object({
  name: z.string().min(1),
  inputs: z.array(z.string()).nonempty(),
  weights: z.record(z.number()),
});

export type AgentSpec = z.infer<typeof agentSpecSchema>;
