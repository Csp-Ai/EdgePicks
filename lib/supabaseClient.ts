import { createClient } from '@supabase/supabase-js';
import { ENV } from '@/lib/config/env';

// Edge/browser-safe client (public)
export const supabaseClient = (() => {
  const url = ENV.NEXT_PUBLIC_SUPABASE_URL;
  const key = ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // If missing at build, return a lazy factory that throws only when actually used.
  if (!url || !key) {
    return null as unknown as ReturnType<typeof createClient>;
  }
  return createClient(url, key, { auth: { persistSession: true } });
})();

// Server-only factory (service role) — call inside handlers
export function supabaseServer() {
  const url = ENV.SUPABASE_URL;
  const key = ENV.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    // Don’t crash module load; let caller decide how to handle.
    throw new Error('Supabase server credentials missing');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export const createServiceClient = supabaseServer;

export const supabase = (() => {
  const url = ENV.SUPABASE_URL;
  const key = ENV.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return null as unknown as ReturnType<typeof createClient>;
  }
  return createClient(url, key, { auth: { persistSession: false } });
})();

