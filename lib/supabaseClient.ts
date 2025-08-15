import { createClient } from '@supabase/supabase-js';
import { ENV } from '@/lib/config/env';

export const supabaseClient = createClient(
  ENV.NEXT_PUBLIC_SUPABASE_URL,
  ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: true } }
);

export const supabaseServer = () =>
  createClient(ENV.NEXT_PUBLIC_SUPABASE_URL, ENV.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

export const createServiceClient = supabaseServer;

export const supabase = supabaseServer();

