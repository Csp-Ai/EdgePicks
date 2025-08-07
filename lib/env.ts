import { z } from 'zod';

if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require
  require('dotenv').config({ path: '.env.local' });
}

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().nonempty(),
  GOOGLE_CLIENT_SECRET: z.string().nonempty(),
  SUPABASE_KEY: z.string().nonempty(),
  SUPABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().nonempty(),
  NEXTAUTH_URL: z.string().url(),
  SPORTS_API_KEY: z.string().nonempty(),
  SPORTS_DB_NFL_ID: z.string().optional(),
  SPORTS_DB_MLB_ID: z.string().optional(),
  SPORTS_DB_NBA_ID: z.string().optional(),
  SPORTS_DB_NHL_ID: z.string().optional(),
  ODDS_API_KEY: z.string().optional(),
});

export const ENV = envSchema.parse(process.env);
