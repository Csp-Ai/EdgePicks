import React from 'react';
import useSWR from 'swr';

interface AuditLog {
  id: string;
  type: string;
  timestamp: string;
}

const FALLBACK: AuditLog[] = [
  {
    id: '1',
    type: 'blocked output',
    timestamp: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    type: 'HMAC reject',
    timestamp: '2024-01-02T00:00:00Z',
  },
];

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Network error');
    return res.json();
  });

const AuditActivity: React.FC = () => {
  const { data, error } = useSWR<AuditLog[]>(
    '/api/audit-logs',
    fetcher,
    { fallbackData: FALLBACK }
  );

  const logs = data ?? FALLBACK;
  const sample = Boolean(error);

  return (
    <section aria-labelledby="audit-heading">
      <h2 id="audit-heading" className="text-lg font-semibold">
        Recent Audit Activity
      </h2>
      <ul className="list-disc ml-5 mt-2">
        {logs.slice(0, 10).map((log) => (
          <li key={log.id}>
            {log.type} – {new Date(log.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
      {sample && (
        <p className="text-sm text-gray-500 italic">Using sample data</p>
      )}
    </section>
  );
};

export default AuditActivity;
