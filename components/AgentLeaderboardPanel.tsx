import React from 'react';
import { formatAgentName } from '../lib/utils';

export interface AgentAccuracyEntry {
  name: string;
  wins: number;
  losses: number;
  accuracy: number;
}

interface Props {
  agents?: AgentAccuracyEntry[];
  isLoading: boolean;
  error?: Error;
}

const AgentLeaderboardPanel: React.FC<Props> = ({ agents, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded shadow text-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded shadow text-center text-red-600">
        Failed to load leaderboard
      </div>
    );
  }

  if (!agents || agents.length === 0) {
    return (
      <div className="p-4 rounded shadow text-center bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
        No data yet
      </div>
    );
  }

  return (

    <div className="bg-white rounded shadow divide-y">
      {agents.map((r, idx) => (
=======
    <div className="rounded shadow divide-y divide-neutral-200 dark:divide-neutral-700 bg-neutral-100 dark:bg-neutral-900">
      {rows.map((r, idx) => (

        <div key={r.name} className="flex items-center justify-between p-2 text-sm">
          <span className="font-medium flex-1">
            {idx + 1}. {formatAgentName(r.name)}
          </span>
          <span className="w-24 text-right">{(r.accuracy * 100).toFixed(1)}%</span>
          <span className="w-24 text-right text-gray-500">
            {r.wins}-{r.losses}
          </span>
=======
          <span className="w-24 text-right">{(r.avgConfidence * 100).toFixed(1)}%</span>
          <span className="w-24 text-right">{r.totalScore.toFixed(2)}</span>
          <span className="w-16 text-right text-neutral-500 dark:text-neutral-400">{r.count}</span>
        </div>
      ))}
    </div>
  );
};

export default AgentLeaderboardPanel;
