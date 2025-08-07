import { execSync } from 'child_process';
import { REQUIRED_ENV_KEYS } from '../lib/envKeys';

const missing = REQUIRED_ENV_KEYS.filter((k) => !process.env[k]);

if (missing.length === 0) {
  console.log('All required env vars set.');
  process.exit(0);
}

missing.forEach((key) => {
  console.log(`Missing ${key}`);
  try {
    const out = execSync(`rg --line-number ${key} .`, { stdio: ['pipe', 'pipe', 'ignore'] })
      .toString()
      .trim();
    if (out) {
      out.split('\n').forEach((line) => console.log(`  ${line}`));
    }
  } catch (err) {
    console.log('  (usage not found)');
  }
});

process.exit(1);
