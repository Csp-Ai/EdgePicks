import { ENV } from '../lib/env';
import { REQUIRED_ENV_KEYS } from '../lib/envKeys';

REQUIRED_ENV_KEYS.forEach((key) => {
  if (!(key in ENV)) {
    console.error(`❌ Missing required key: ${key}`);
    process.exit(1);
  }
});

console.log('✅ All env files contain required keys.');
