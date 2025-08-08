import { z } from 'zod';

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().nonempty(),
  GOOGLE_CLIENT_SECRET: z.string().nonempty(),
  SUPABASE_KEY: z.string().nonempty(),
  SUPABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().nonempty(),
  NEXTAUTH_URL: z.string().url(),
  SPORTS_API_KEY: z.string().nonempty(),
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

export const ENV = envSchema.parse(process.env);
