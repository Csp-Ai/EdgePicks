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

const missing: string[] = required.filter((k) => !process.env[k]);

if (!isMockAuth) {
  ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'].forEach((k) => {
    if (!process.env[k]) missing.push(k);
  });
}

const isProd = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
const skipCheck = process.env.SKIP_BUILD_ENV_CHECK === '1';

if (missing.length) {
  if (isProd) {
    console.error('❌ Env validation failed.');
    missing.forEach((k) => console.error(` - Missing env: ${k}`));
    process.exit(1);
  }
  if (skipCheck) {
    console.warn(`⚠️ Env validation skipped. Missing env: ${missing.join(', ')}`);
  } else {
    console.warn(`⚠️ Missing env: ${missing.join(', ')}`);
  }
} else if (skipCheck) {
  console.warn('⚠️ Env validation skipped.');
} else {
  console.log('✅ All env files contain required keys.');
}
