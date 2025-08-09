import React, { useEffect, useMemo, useState } from 'react';
import useEventSource from '../lib/hooks/useEventSource';
import { FixedSizeList as List } from 'react-window';
import { searchLogs, logsToCSV } from '../lib/logs/search';

interface AgentLog {
  agent: string;
  state: string;
  [key: string]: any;
}

const STORAGE_KEY = 'agentLogStream.filters';

const Outer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} role="log" aria-live="polite" {...props} />,
);
Outer.displayName = 'Outer';

const AgentLogStream: React.FC = () => {
  const [paused, setPaused] = useState(false);
  const [agentFilter, setAgentFilter] = useState(() => {
    if (typeof window === 'undefined') return '';
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored).agent || '' : '';
    } catch {
      return '';
    }
  });
  const [stateFilter, setStateFilter] = useState(() => {
    if (typeof window === 'undefined') return '';
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored).state || '' : '';
    } catch {
      return '';
    }
  });
  const [query, setQuery] = useState(() => {
    if (typeof window === 'undefined') return '';
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored).query || '' : '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ agent: agentFilter, state: stateFilter, query }),
      );
    }
  }, [agentFilter, stateFilter, query]);

  const { events } = useEventSource('/api/reflections', { enabled: !paused });

  const filtered = useMemo(() => {
    const base = (events as AgentLog[]).filter(
      (e) =>
        (!agentFilter || e.agent?.includes(agentFilter)) &&
        (!stateFilter || e.state === stateFilter),
    );
    return searchLogs(base, query);
  }, [events, agentFilter, stateFilter, query]);

  const renderRow = ({ index, style }: { index: number; style: any }) => {
    const item = filtered[index];
    return (
      <div style={style} className="px-2 py-1 border-b" role="listitem">
        <span className="font-mono">{item.agent}</span> [{item.state}]
      </div>
    );
  };

  const list =
    filtered.length > 500 ? (
      <List
        height={400}
        itemCount={filtered.length}
        itemSize={32}
        width="100%"
        outerElementType={Outer}
      >
        {renderRow}
      </List>
    ) : (
      <ul role="log" aria-live="polite" className="divide-y max-h-96 overflow-auto">
        {filtered.map((item, idx) => (
          <li key={idx} className="px-2 py-1">
            <span className="font-mono">{item.agent}</span> [{item.state}]
          </li>
        ))}
      </ul>
    );

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <input
          aria-label="Agent filter"
          className="border p-1 flex-1"
          value={agentFilter}
          onChange={(e) => setAgentFilter(e.target.value)}
        />
        <input
          aria-label="State filter"
          className="border p-1 flex-1"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
        />
        <input
          aria-label="Search logs"
          className="border p-1 flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={() => setPaused((p) => !p)}
          className="px-3 py-1 border rounded"
        >
          {paused ? 'Resume' : 'Pause'}
        </button>
        <button
          onClick={() =>
            navigator.clipboard.writeText(
              JSON.stringify(filtered, null, 2),
            )
          }
          className="px-3 py-1 border rounded"
        >
          Copy
        </button>
        <button
          onClick={() => {
            const csv = logsToCSV(filtered);
            const blob = new Blob([csv], {
              type: 'text/csv;charset=utf-8;',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'agent-logs.csv';
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="px-3 py-1 border rounded"
        >
          Export CSV
        </button>
      </div>
      {list}
    </div>
  );
};

export default AgentLogStream;

