import { createClient, SupabaseClient } from '@supabase/supabase-js';
import './env';

let client: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      throw new Error(
        'Supabase environment variables SUPABASE_URL and SUPABASE_ANON_KEY must be set.'
      );
    }

    client = createClient(url, anonKey);
  }
  return client;
};
