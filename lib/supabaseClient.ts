import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Env } from '@/lib/config/env';

export function createServiceClient() {
  // server/edge safe (no realtime usage)
  return createSupabaseClient(
    Env.SUPABASE_URL!,
    Env.SUPABASE_SERVICE_ROLE_KEY || Env.SUPABASE_KEY || '',
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Client-only singleton (when you truly need Realtime in the browser)
export function getBrowserClient() {
  if (typeof window === 'undefined') {
    throw new Error('getBrowserClient() called on server');
  }
  return createSupabaseClient(Env.SUPABASE_URL!, Env.SUPABASE_KEY || '', {
    auth: { autoRefreshToken: true, persistSession: true },
  });
}

