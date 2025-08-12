import 'dotenv/config';

type Provider = 'sportsdata' | 'thesportsdb';

const provider = (process.env.SPORTS_API_PROVIDER ?? 'sportsdata') as Provider;
const tdbVersion = Number(process.env.THESPORTSDB_API_VERSION ?? '1');

const isTest = process.env.NODE_ENV === 'test' || process.env.CI === '1';
const isProdLike = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

let apiKey = process.env.SPORTS_API_KEY;
if (!apiKey && provider === 'thesportsdb' && !isProdLike) {
  apiKey = '123';
}
if (isProdLike && !apiKey) {
  throw new Error('[env] Missing required env: SPORTS_API_KEY');
}

export const Env = {
  provider,
  tdbVersion,
  apiKey,
  isTest,
  isProdLike,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
};
