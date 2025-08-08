export function formatKickoff(iso: string, nowMs: number = Date.now()): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return 'TBD';
  const diff = t - nowMs;
  if (diff <= 0) return 'started';
  const min = Math.round(diff / 60000);
  if (min < 60) return `in ${min}m`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `in ${hours}h`;
  const days = Math.floor(hours / 24);
  return `in ${days}d`;
}

export function formatAbsolute(iso: string, locale?: string): string {
  const d = new Date(iso);
  try {
    return d.toLocaleString(locale ?? undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  } catch {
    return d.toISOString();
  }
}

