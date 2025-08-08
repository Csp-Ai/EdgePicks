import React from 'react';
import useSWR from 'swr';

interface LogEntry {
  id: string;
  ts: string;
  level: string;
  message: string;
  meta?: Record<string, any>;
}

interface LogsResponse {
  items: LogEntry[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const HistoryPage: React.FC = () => {
  const { data, error, isLoading, mutate } = useSWR<LogsResponse>('/api/logs', fetcher);

  let content: React.ReactNode;
  if (isLoading) {
    content = (
      <ul className="space-y-2 max-w-3xl mx-auto">
        {Array.from({ length: 8 }).map((_, i) => (
          <li key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
        ))}
      </ul>
    );
  } else if (error) {
    content = (
      <div className="text-center">
        <p className="mb-4 text-red-600">Failed to load logs.</p>
        <button className="text-blue-600 underline" onClick={() => mutate()}>
          Retry
        </button>
      </div>
    );
  } else if (!data || data.items.length === 0) {
    content = <p className="text-center">No logs yet.</p>;
  } else {
    content = (
      <ul className="space-y-4 max-w-3xl mx-auto">
        {data.items.map((item) => (
          <li key={item.id} className="bg-white rounded-lg shadow p-4">
            <div className="text-xs text-gray-500 mb-1">
              {item.ts} &middot; {item.level}
            </div>
            <div className="text-sm whitespace-pre-line">{item.message}</div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6" suppressHydrationWarning>
      <header className="text-center mb-8">
        <h1 className="text-3xl font-mono font-bold">Log History</h1>
        <p className="text-gray-600">Recent system logs</p>
      </header>
      {content}
    </main>
  );
};

export default HistoryPage;
