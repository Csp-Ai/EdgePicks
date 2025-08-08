import { z } from 'zod';

export const logsQuerySchema = z.object({
  agent: z.string().optional(),
  state: z.string().optional(),
  cursor: z.string().optional(),
  limit: z
    .coerce.number()
    .int()
    .max(200)
    .optional(),
});

export type LogsQuery = z.infer<typeof logsQuerySchema>;

export function parseLogsQuery(q: unknown): LogsQuery {
  return logsQuerySchema.parse(q);
}
