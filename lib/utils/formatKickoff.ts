export function formatKickoff(time: string): string {
  const kickoff = new Date(time);
  const now = new Date();
  const diffMs = kickoff.getTime() - now.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (isNaN(kickoff.getTime()) || diffMs <= 0) {
    return 'started';
  }
  if (diffMs < hour) {
    const m = Math.round(diffMs / minute);
    return `in ${m}m`;
  }
  if (diffMs < day) {
    const h = Math.round(diffMs / hour);
    return `in ${h}h`;
  }
  if (diffMs <= 7 * day) {
    const d = Math.round(diffMs / day);
    return `in ${d}d`;
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(kickoff);
}
