import { createClient } from '@supabase/supabase-js';

if (typeof window !== 'undefined') {
  throw new Error('supabaseClient should only be used server-side');
}

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_KEY = process.env.SUPABASE_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

