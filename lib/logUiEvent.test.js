process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_KEY = 'anon';
process.env.NEXTAUTH_URL = 'http://localhost';
process.env.NEXTAUTH_SECRET = 'secret';
process.env.GOOGLE_CLIENT_ID = 'gid';
process.env.GOOGLE_CLIENT_SECRET = 'gsecret';
process.env.SPORTS_API_KEY = 'key';

require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'CommonJS' } });
const assert = require('assert');
const { logUiEvent } = require('./logUiEvent');
const supabase = require('./supabaseClient');
const { flushLogQueue, getLogStatus } = require('./logToSupabase');

supabase.supabase = {
  from: () => ({
    insert: () => Promise.resolve({ error: new Error('fail') }),
  }),
};

(async () => {
  await logUiEvent('test');
  await flushLogQueue();
  const status = await getLogStatus();
  assert(status.lastError, 'error should be recorded');
  console.log('logUiEvent error recorded');
})();
