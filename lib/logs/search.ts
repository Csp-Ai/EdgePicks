export interface AgentLog {
  [key: string]: any;
}

export function searchLogs(logs: AgentLog[], query: string): AgentLog[] {
  if (!query) return logs;
  const q = query.toLowerCase();
  return logs.filter((log) =>
    Object.values(log).some((value) =>
      String(typeof value === 'object' ? JSON.stringify(value) : value)
        .toLowerCase()
        .includes(q),
    ),
  );
}

export function logsToCSV(logs: AgentLog[]): string {
  if (!logs.length) return '';
  const keys = Array.from(
    logs.reduce<Set<string>>((set, log) => {
      Object.keys(log).forEach((k) => set.add(k));
      return set;
    }, new Set<string>()),
  );
  const header = keys.join(',');
  const rows = logs.map((log) =>
    keys
      .map((k) => {
        const raw = typeof log[k] === 'object' ? JSON.stringify(log[k]) : log[k];
        const str = String(raw ?? '').replace(/"/g, '""');
        return `"${str}"`;
      })
      .join(','),
  );
  return [header, ...rows].join('\n');
}
