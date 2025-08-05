import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!client) {
    const url = process.env.SUPABASE_URL as string;
    const anonKey = process.env.SUPABASE_ANON_KEY as string;
    client = createClient(url, anonKey);
  }
  return client;
};
