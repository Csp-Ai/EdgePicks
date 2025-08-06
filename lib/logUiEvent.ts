import { getSupabaseClient } from './supabaseClient';

export async function logUiEvent(
  uiEvent: string,
  extras: Record<string, any> = {}
): Promise<void> {
  try {
    const client = getSupabaseClient();
    await client.from('ui_events').insert({
      event: uiEvent,
      extras,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Failed to log UI event', err);
  }
}
