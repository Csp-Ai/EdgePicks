import { getSupabaseClient } from './supabaseClient';
import { triggerToast } from './useToast';

export async function logUiEvent(
  uiEvent: string,
  sessionType: string,
  userId?: string,
  extras: Record<string, any> = {}
): Promise<void> {
  try {
    const client = getSupabaseClient();
    await client.from('ui_events').insert({
      event: uiEvent,
      session_type: sessionType,
      user_id: userId,
      extras,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Failed to log UI event', err);
    triggerToast({
      message: 'Unable to log event; please sign in again',
      type: 'error',
    });
  }
}
