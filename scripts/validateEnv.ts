import fs from 'fs';
import dotenv from 'dotenv';
import { REQUIRED_ENV_KEYS } from '../lib/envKeys';

const files = ['.env.local.example', '.env.development', '.env.production'];
let hasErrors = false;

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const parsed = dotenv.parse(fs.readFileSync(file));
  const missing = REQUIRED_ENV_KEYS.filter((k) => !(k in parsed));
  if (missing.length) {
    console.error(`${file} is missing required keys: ${missing.join(', ')}`);
    hasErrors = true;
  }
}

if (hasErrors) {
  process.exit(1);
} else {
  console.log('All env files contain required keys.');
}
