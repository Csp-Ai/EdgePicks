const provider = process.env.SPORTS_API_PROVIDER ?? 'sportsdata';
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

export const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',

  // Public/browser
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    '',

  // Server-only
  SUPABASE_URL:
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

  provider,
  tdbVersion,
  apiKey,
  isTest,
  isProdLike,
};

export const Env = ENV;
