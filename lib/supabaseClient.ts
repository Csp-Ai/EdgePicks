import { createClient as _createClient } from '@supabase/supabase-js';
import { Env } from '@/lib/config/env';

/** Server/Edge-safe factory (no realtime assumptions) */
export function createServiceClient() {
  const url = Env.SUPABASE_URL!;
  const key = Env.SUPABASE_SERVICE_ROLE_KEY || Env.SUPABASE_KEY || '';
  return _createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

/** Browser client for UI features that need persisted session */
export function createBrowserClient() {
  if (typeof window === 'undefined') throw new Error('createBrowserClient() on server');
  const url = Env.SUPABASE_URL!;
  const key = Env.SUPABASE_KEY || '';
  return _createClient(url, key, { auth: { autoRefreshToken: true, persistSession: true } });
}

/** 🔁 Back-compat named export for tests & legacy code */
export const supabase = (() => {
  // Create a lightweight server instance for code paths/tests expecting `supabase`
  try {
    return createServiceClient();
  } catch {
    // In typecheck-only contexts without env, return a typed dummy
    return _createClient('https://example.supabase.co', 'anon', { auth: { autoRefreshToken: false, persistSession: false } });
  }
})();

