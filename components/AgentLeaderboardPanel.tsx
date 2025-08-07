import React from 'react';
import { formatAgentName } from '../lib/utils';

export interface AgentLeaderboardEntry {
  totalConfidence: number;
  totalScore: number;
  count: number;
}

interface Props {
  stats: Record<string, AgentLeaderboardEntry>;
}

const AgentLeaderboardPanel: React.FC<Props> = ({ stats }) => {
  const rows = Object.entries(stats).map(([name, s]) => ({
    name,
    avgConfidence: s.count ? s.totalConfidence / s.count : 0,
    totalScore: s.totalScore,
    count: s.count,
  }));

  rows.sort((a, b) => b.totalScore - a.totalScore);

  if (rows.length === 0) {
    return (
      <div className="p-4 rounded shadow text-center bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
        No data yet
      </div>
    );
  }

  return (
    <div className="rounded shadow divide-y divide-neutral-200 dark:divide-neutral-700 bg-neutral-100 dark:bg-neutral-900">
      {rows.map((r, idx) => (
        <div key={r.name} className="flex items-center justify-between p-2 text-sm">
          <span className="font-medium flex-1">
            {idx + 1}. {formatAgentName(r.name)}
          </span>
          <span className="w-24 text-right">{(r.avgConfidence * 100).toFixed(1)}%</span>
          <span className="w-24 text-right">{r.totalScore.toFixed(2)}</span>
          <span className="w-16 text-right text-neutral-500 dark:text-neutral-400">{r.count}</span>
        </div>
      ))}
    </div>
  );
};

export default AgentLeaderboardPanel;
