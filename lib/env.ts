const required = ['NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

export const hasSportsDbKey =
  !!process.env.SPORTS_DB_API_KEY && process.env.SPORTS_DB_API_KEY !== '1';

if (!hasSportsDbKey) {
  console.warn('Sports API key missing. Add it to `.env.local` to enable live games.');
}
