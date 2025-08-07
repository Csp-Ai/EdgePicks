if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: '.env.local' });
}

import { REQUIRED_ENV_KEYS } from './envKeys';

export const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

export const ENV = Object.fromEntries(
  REQUIRED_ENV_KEYS.map((key) => [key, getEnvVar(key)])
) as Record<(typeof REQUIRED_ENV_KEYS)[number], string>;

export const SPORTS_DB_NFL_ID = process.env.SPORTS_DB_NFL_ID;
export const SPORTS_DB_MLB_ID = process.env.SPORTS_DB_MLB_ID;
export const SPORTS_DB_NBA_ID = process.env.SPORTS_DB_NBA_ID;
export const SPORTS_DB_NHL_ID = process.env.SPORTS_DB_NHL_ID;
export const ODDS_API_KEY = process.env.ODDS_API_KEY;
