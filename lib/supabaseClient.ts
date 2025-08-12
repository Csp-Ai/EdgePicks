import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';

if (typeof window !== 'undefined') {
  throw new Error('supabaseClient should only be used server-side');
}

if (!ENV.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

if (!ENV.SUPABASE_KEY && !ENV.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_KEY or SUPABASE_SERVICE_ROLE_KEY environment variable');
}

export const supabase = createClient(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_SERVICE_ROLE_KEY || ENV.SUPABASE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
