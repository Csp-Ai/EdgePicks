/* eslint-disable no-console */
import 'dotenv/config';

const isProd = process.env.NODE_ENV === 'production';

function assert(msg: string, cond: boolean) {
  if (!cond) {
    console.error(`❌ ${msg}`);
    process.exit(1);
  }
}

// Always required (examples)
const always: string[] = [
  // add your universal keys here if any
];

// Conditionally required:
const hasPublic = !!process.env.NEXT_PUBLIC_SITE_URL;
const hasVercel = !!process.env.VERCEL_URL;

for (const k of always) {
  assert(`Missing required env: ${k}`, !!process.env[k]);
}

// Public site URL logic:
if (isProd) {
  // In prod, require at least one: NEXT_PUBLIC_SITE_URL or VERCEL_URL
  assert(
    'Missing NEXT_PUBLIC_SITE_URL or VERCEL_URL in production',
    hasPublic || hasVercel
  );
}

console.log('✅ All env files contain required keys.');
