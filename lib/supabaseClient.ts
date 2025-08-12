import { createClient as _create } from '@supabase/supabase-js';

export function createClient(url: string, key: string) {
  return _create(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export const supabase =
  process.env.SUPABASE_URL
    ? createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
          process.env.SUPABASE_KEY ||
          ''
      )
    : undefined as any;

