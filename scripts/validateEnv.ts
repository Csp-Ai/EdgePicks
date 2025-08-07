import dotenv from 'dotenv';
import { REQUIRED_ENV_KEYS } from '../lib/envKeys';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.local' });
}

REQUIRED_ENV_KEYS.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required key: ${key}`);
    process.exit(1);
  }
});

console.log('✅ All env files contain required keys.');
