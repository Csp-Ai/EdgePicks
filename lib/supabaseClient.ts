import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';

if (typeof window !== 'undefined') {
  throw new Error('supabaseClient should only be used server-side');
}

export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_KEY);

