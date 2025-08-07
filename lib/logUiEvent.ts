import { triggerToast } from './useToast';

export async function logUiEvent(
  uiEvent: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    const meta = metadata ?? {};
    console.log(`[UI EVENT] ${uiEvent}`, Object.keys(meta).length ? meta : '');

    if (typeof window !== 'undefined') {
      await fetch('/api/log-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: uiEvent, metadata: meta }),
      });
      return;
    }

    const { supabase } = await import('./supabaseClient');
    await supabase.from('ui_events').insert({
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
