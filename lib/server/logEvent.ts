import { supabase } from '../supabaseClient';

interface LogOptions {
  requestId?: string;
  userId?: string;
}

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 200;

export async function logEvent(
  kind: string,
  payload: Record<string, unknown> = {},
  options: LogOptions = {}
): Promise<void> {
  const { requestId, userId } = options;
  const ts = new Date().toISOString();
  const entry = { kind, payload, request_id: requestId, user_id: userId, ts };

  let attempt = 0;
  let lastError: any = null;

  while (attempt < MAX_RETRIES) {
    attempt += 1;
    const { error } = await supabase.from('logs').insert(entry);
    if (!error) {
      lastError = null;
      break;
    }
    lastError = error;
    if (attempt < MAX_RETRIES) {
      await new Promise((res) => setTimeout(res, BASE_DELAY_MS * attempt));
    }
  }

  if (lastError) {
    console.error('Failed to log event', lastError);
  }
}
