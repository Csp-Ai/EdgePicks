process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_ANON_KEY = 'anon';
process.env.NEXTAUTH_URL = 'http://localhost';
process.env.NEXTAUTH_SECRET = 'secret';
process.env.GOOGLE_CLIENT_ID = 'gid';
process.env.GOOGLE_CLIENT_SECRET = 'gsecret';

require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'CommonJS' } });
const assert = require('assert');
const { logUiEvent } = require('./logUiEvent');
const supabase = require('./supabaseClient');
const toast = require('./useToast');

let called = false;
toast.triggerToast = (t) => {
  called = true;
  assert.strictEqual(t.message, 'Unable to log event; please sign in again');
};

supabase.supabase = {
  from: () => ({
    insert: () => Promise.reject(new Error('fail')),
  }),
};

(async () => {
  await logUiEvent('test', { session_type: 'unauthenticated' });
  assert(called, 'toast should be triggered on error');
  console.log('logUiEvent error toast test passed');
})();
