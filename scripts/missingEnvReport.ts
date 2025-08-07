import fs from 'fs';
import { REQUIRED_ENV_KEYS } from '../lib/envKeys';

const missing = REQUIRED_ENV_KEYS.filter((k) => !process.env[k]);

if (missing.length) {
  fs.writeFileSync('missing-env-report.txt', missing.join('\n'));
  console.warn(`[env] Missing required env vars:\n${missing.join('\n')}`);
} else if (fs.existsSync('missing-env-report.txt')) {
  fs.unlinkSync('missing-env-report.txt');
}
