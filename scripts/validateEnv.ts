const required = [
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'SUPABASE_URL',
  'SUPABASE_KEY',
  'SPORTS_API_KEY'
] as const;

// In mock mode we allow Google OAuth vars to be missing locally
const isMockAuth =
  process.env.NEXT_PUBLIC_MOCK_AUTH === '1' ||
  process.env.LIVE_MODE === 'off';

const issues: string[] = [];

const addIssue = (msg: string) => {
  issues.push(msg);
};

const missing = required.filter((k) => !process.env[k]);
if (missing.length) addIssue(`Missing env: ${missing.join(', ')}`);

if (!isMockAuth) {
  ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'].forEach((k) => {
    if (!process.env[k]) addIssue(`Missing env: ${k}`);
  });
}

if (issues.length) {
  console.error('❌ Env validation failed.');
  issues.forEach((i) => console.error(` - ${i}`));
  process.exit(1);
}

console.log('✅ All env files contain required keys.');

