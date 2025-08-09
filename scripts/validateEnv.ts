import { config } from 'dotenv';

// Load .env.local in dev/CI; Vercel injects envs so this is harmless there
config({ path: '.env.local' });
config(); // also load .env if present

const required = [
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'SUPABASE_URL',
  'SUPABASE_KEY',
  'SPORTS_API_KEY',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
] as const;

if (!process.env.SUPABASE_KEY && process.env.SUPABASE_ANON_KEY) {
  process.env.SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
}

const missing: string[] = required.filter((k) => !process.env[k]);

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
