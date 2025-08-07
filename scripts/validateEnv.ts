const { REQUIRED_ENV_KEYS } = require('../lib/envKeys');

for (const key of REQUIRED_ENV_KEYS) {
  if (!process.env[key]) {
    console.error(`❌ Missing required key: ${key}`);
    process.exit(1);
  }
}
console.log('✅ All env files contain required keys.');
