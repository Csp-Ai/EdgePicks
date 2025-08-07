import { getSupabaseClient } from './supabaseClient';
import { triggerToast } from './useToast';

export async function logUiEvent(
  uiEvent: string,
  metadata?: Record<string, any>,
): Promise<void> {
  try {
    const meta = metadata ?? {};
    console.log(`[UI EVENT] ${uiEvent}`, Object.keys(meta).length ? meta : '');
    const client = getSupabaseClient();
    await client.from('ui_events').insert({
      event: uiEvent,
      metadata: meta,
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
