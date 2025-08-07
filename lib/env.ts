if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: '.env.local' });
}

export const SUPABASE_URL = (() => {
  const v = process.env.SUPABASE_URL;
  if (!v) throw new Error('Missing SUPABASE_URL in environment variables.');
  return v;
})();

export const SUPABASE_ANON_KEY = (() => {
  const v = process.env.SUPABASE_ANON_KEY;
  if (!v) throw new Error('Missing SUPABASE_ANON_KEY in environment variables.');
  return v;
})();

export const NEXTAUTH_URL = (() => {
  const v = process.env.NEXTAUTH_URL;
  if (!v) throw new Error('Missing NEXTAUTH_URL in environment variables.');
  return v;
})();

export const NEXTAUTH_SECRET = (() => {
  const v = process.env.NEXTAUTH_SECRET;
  if (!v) throw new Error('Missing NEXTAUTH_SECRET in environment variables.');
  return v;
})();

export const GOOGLE_CLIENT_ID = (() => {
  const v = process.env.GOOGLE_CLIENT_ID;
  if (!v) throw new Error('Missing GOOGLE_CLIENT_ID in environment variables.');
  return v;
})();

export const GOOGLE_CLIENT_SECRET = (() => {
  const v = process.env.GOOGLE_CLIENT_SECRET;
  if (!v) throw new Error('Missing GOOGLE_CLIENT_SECRET in environment variables.');
  return v;
})();

export const SPORTS_API_KEY = (() => {
  const v = process.env.SPORTS_API_KEY;
  if (!v) throw new Error('Missing SPORTS_API_KEY in environment variables.');
  return v;
})();

export const SPORTS_DB_NFL_ID = process.env.SPORTS_DB_NFL_ID;
export const SPORTS_DB_MLB_ID = process.env.SPORTS_DB_MLB_ID;
export const SPORTS_DB_NBA_ID = process.env.SPORTS_DB_NBA_ID;
export const SPORTS_DB_NHL_ID = process.env.SPORTS_DB_NHL_ID;
export const ODDS_API_KEY = process.env.ODDS_API_KEY;

export const ENV = {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  NEXTAUTH_URL,
  NEXTAUTH_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  SPORTS_API_KEY,
  SPORTS_DB_NFL_ID,
  SPORTS_DB_MLB_ID,
  SPORTS_DB_NBA_ID,
  SPORTS_DB_NHL_ID,
  ODDS_API_KEY,
} as const;

