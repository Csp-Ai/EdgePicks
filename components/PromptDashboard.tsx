import React, { useState } from 'react';
import promptRegistry from '../data/prompt-registry.json';

interface Entry {
  source: string;
  timestamp?: string;
  header: string;
  summary: string;
}

const PromptDashboard: React.FC = () => {
  const [query, setQuery] = useState('');
  const entries = (promptRegistry as Entry[]).filter((e) => {
    const q = query.toLowerCase();
    return (
      e.header.toLowerCase().includes(q) ||
      e.summary.toLowerCase().includes(q) ||
      (e.timestamp || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Codex Prompt Registry</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search prompts..."
        className="border p-2 mb-4 w-full"
      />
      <ul>
        {entries.map((e, idx) => (
          <li key={idx} className="mb-4 border-b pb-2">
            {e.timestamp && (
              <div className="text-xs text-gray-500">{e.timestamp}</div>
            )}
            <div className="font-semibold">{e.header}</div>
            <div className="text-sm">{e.summary}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PromptDashboard;
