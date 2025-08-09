import 'dotenv/config';

type Provider = 'sportsdata' | 'thesportsdb';

function required(name: string, condition = true) {
  const val = process.env[name];
  if (!condition) return val ?? '';
  if (!val) throw new Error(`[env] Missing required env: ${name}`);
  return val;
}

const provider = (process.env.SPORTS_API_PROVIDER ?? 'sportsdata') as Provider;
const tdbVersion = Number(process.env.THESPORTSDB_API_VERSION ?? '1');

// In tests with TSDb v1, allow key=123. In prod/preview, require real key.
const isTest = process.env.NODE_ENV === 'test' || process.env.CI === '1';
const isProdLike = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

const apiKey =
  provider === 'thesportsdb'
    ? (isProdLike ? required('SPORTS_API_KEY') : (process.env.SPORTS_API_KEY ?? '123'))
    : required('SPORTS_API_KEY', true);

export const Env = {
  provider,
  tdbVersion,
  apiKey,
  isTest,
  isProdLike,
};
