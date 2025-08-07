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
      <div className="p-4 bg-white rounded shadow text-center text-gray-600">
        No data yet
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow divide-y">
      {rows.map((r, idx) => (
        <div key={r.name} className="flex items-center justify-between p-2 text-sm">
          <span className="font-medium flex-1">
            {idx + 1}. {formatAgentName(r.name)}
          </span>
          <span className="w-24 text-right">{(r.avgConfidence * 100).toFixed(1)}%</span>
          <span className="w-24 text-right">{r.totalScore.toFixed(2)}</span>
          <span className="w-16 text-right text-gray-500">{r.count}</span>
        </div>
      ))}
    </div>
  );
};

export default AgentLeaderboardPanel;
