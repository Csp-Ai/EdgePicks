import React, { useState } from 'react';
import useSWR from 'swr';

interface AuditLog {
  id: string;
  timestamp: string;
  type: string;
  severity: string;
  message: string;
  details?: string;
}

interface ApiResponse {
  logs: AuditLog[];
  total: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const AuditLogList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [type, setType] = useState('all');
  const [timeframe, setTimeframe] = useState('all');
  const [severity, setSeverity] = useState('all');
  const [selected, setSelected] = useState<AuditLog | null>(null);

  const params = new URLSearchParams();
  params.set('page', String(page));
  if (type !== 'all') params.set('type', type);
  if (timeframe !== 'all') params.set('timeframe', timeframe);
  if (severity !== 'all') params.set('severity', severity);

  const { data } = useSWR<ApiResponse>(
    `/api/audit-logs?${params.toString()}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const logs = data?.logs || [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select
          aria-label="Filter by type"
          value={type}
          onChange={(e) => {
            setPage(1);
            setType(e.target.value);
          }}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All Types</option>
          <option value="policy">Policy</option>
          <option value="action">Action</option>
        </select>
        <select
          aria-label="Filter by timeframe"
          value={timeframe}
          onChange={(e) => {
            setPage(1);
            setTimeframe(e.target.value);
          }}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All Time</option>
          <option value="24h">Last 24h</option>
          <option value="7d">Last 7d</option>
          <option value="30d">Last 30d</option>
        </select>
        <select
          aria-label="Filter by severity"
          value={severity}
          onChange={(e) => {
            setPage(1);
            setSeverity(e.target.value);
          }}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All Severity</option>
          <option value="info">Info</option>
          <option value="warn">Warning</option>
          <option value="error">Error</option>
        </select>
      </div>
      <ul className="space-y-2">
        {logs.map((log) => (
          <li
            key={log.id}
            className="border rounded p-2 cursor-pointer"
            onClick={() => setSelected(log)}
          >
            <div className="text-xs text-gray-500">
              {log.timestamp} · {log.type} · {log.severity}
            </div>
            <div className="text-sm truncate">{log.message}</div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((p) => p + 1)}
          disabled={logs.length === 0}
        >
          Next
        </button>
      </div>
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setSelected(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="bg-white rounded p-4 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-2">Log Detail</h2>
            <p className="text-xs text-gray-500 mb-2">
              {selected.timestamp} · {selected.type} · {selected.severity}
            </p>
            <p className="text-sm whitespace-pre-wrap">{selected.details || selected.message}</p>
            <div className="text-right mt-4">
              <button
                className="px-3 py-1 border rounded"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogList;

