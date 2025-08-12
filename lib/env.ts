import { z } from 'zod';

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  SUPABASE_KEY: z.string().optional(),
  SUPABASE_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  SPORTS_API_KEY: z.string().optional(),
  SPORTS_WEBHOOK_SECRET: z.string().optional(),
  LIVE_MODE: z.enum(['on', 'off']).default('off'),
  WEIGHTS_DYNAMIC: z.enum(['on', 'off']).default('off'),
  PREDICTION_CACHE_TTL_SEC: z.coerce.number().int().positive().default(120),
  MAX_FLOW_CONCURRENCY: z.coerce.number().int().positive().default(3),
  CACHE_DRIVER: z.enum(['memory', 'redis']).default('memory'),
  QUEUE_DRIVER: z.enum(['memory', 'redis']).default('memory'),
  REDIS_URL: z.string().url().optional(),
  FLOW_CACHE_VERSION: z.string().default('v1'),
  SPORTS_DB_NFL_ID: z.string().optional(),
  SPORTS_DB_MLB_ID: z.string().optional(),
  SPORTS_DB_NBA_ID: z.string().optional(),
  SPORTS_DB_NHL_ID: z.string().optional(),
  ODDS_API_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  const missing = Object.keys(parsed.error.flatten().fieldErrors);
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`[env] Missing required env: ${missing.join(', ')}`);
  } else {
    console.warn('[env] Missing vars (using defaults):', missing.join(', '));
  }
}

export const ENV = parsed.success ? parsed.data : ({} as z.infer<typeof envSchema>);

if (process.env.FEATURE_AGENT_INTERFACE === 'true' && !process.env.SPORTS_API_KEY) {
  console.warn('SPORTS_API_KEY missing; running agent interface in demo mode.');
}

export type FlowMode = 'live' | 'sim';
/**
 * Client-safe env access. Use NEXT_PUBLIC_* for anything read in the browser.
 */
export const NEXT_PUBLIC_AGENT_FLOW_MODE: FlowMode =
  (process.env.NEXT_PUBLIC_AGENT_FLOW_MODE as FlowMode) || 'sim';

