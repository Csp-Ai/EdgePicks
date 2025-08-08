export async function logUiEvent(
  uiEvent: string,
  metadata: Record<string, unknown> = {},
  correlationId?: string,
): Promise<void> {
  const corr = correlationId ??
    (typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? (crypto as any).randomUUID()
      : undefined);

  console.log(`[UI EVENT] ${uiEvent}`, Object.keys(metadata).length ? metadata : '');

  if (typeof window !== 'undefined') {
    await fetch('/api/log-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: uiEvent, metadata, correlationId: corr }),
    });
    return;
  }

  const { logToSupabase } = await import('./logToSupabase');
  logToSupabase('ui_events', {
    event: uiEvent,
    metadata,
    correlation_id: corr,
  });
}
