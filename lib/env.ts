import dotenv from 'dotenv';
import { REQUIRED_ENV_KEYS } from './envKeys';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.local' });
}

for (const key of REQUIRED_ENV_KEYS) {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required key: ${key}`);
  }
}

export const ENV = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  SUPABASE_KEY: process.env.SUPABASE_KEY!,
  SUPABASE_URL: process.env.SUPABASE_URL!,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  SPORTS_API_KEY: process.env.SPORTS_API_KEY!,
  SPORTS_DB_NFL_ID: process.env.SPORTS_DB_NFL_ID,
  SPORTS_DB_MLB_ID: process.env.SPORTS_DB_MLB_ID,
  SPORTS_DB_NBA_ID: process.env.SPORTS_DB_NBA_ID,
  SPORTS_DB_NHL_ID: process.env.SPORTS_DB_NHL_ID,
  ODDS_API_KEY: process.env.ODDS_API_KEY,
} as const;
