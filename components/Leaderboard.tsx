'use client';

import React, { useEffect, useState } from 'react';
import { formatAgentName } from '@/lib/utils';

interface Stat {
  name: string;
  wins: number;
  losses: number;
  accuracy: number; // 0-1
}

const sampleAgents: Stat[] = [
  { name: 'injuryScout', wins: 3, losses: 1, accuracy: 0.75 },
  { name: 'lineWatcher', wins: 2, losses: 2, accuracy: 0.5 },
];

const sampleFlows: Stat[] = [
  { name: 'football-pick', wins: 5, losses: 3, accuracy: 0.625 },
];

const Leaderboard: React.FC = () => {
  const [agents, setAgents] = useState<Stat[]>([]);
  const [flows, setFlows] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/accuracy');
        if (!res.ok) throw new Error('Request failed');
        const data = await res.json();
        setAgents((data.agents && data.agents.length) ? data.agents : sampleAgents);
        setFlows((data.flows && data.flows.length) ? data.flows : sampleFlows);
      } catch (err) {
        console.error('Error fetching accuracy data', err);
        setAgents(sampleAgents);
        setFlows(sampleFlows);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-12" suppressHydrationWarning>
      <section>
        <h2 className="text-2xl font-mono font-bold text-center mb-4">Agent Rankings</h2>
        {agents.length === 0 ? (
          <p className="text-center text-gray-600">No data</p>
        ) : (
          <ol className="max-w-2xl mx-auto space-y-2">
            {agents.map((a, idx) => (
              <li key={a.name} className="bg-white rounded shadow p-4 flex items-center">
                <span className="w-6 text-lg font-bold">{idx + 1}</span>
                <span className="flex-1 font-semibold">
                  {formatAgentName(a.name)}
                </span>
                <span className="text-sm text-gray-500 mr-2">
                  {a.wins}/{a.wins + a.losses}
                </span>
                <span className="text-sm text-gray-600">
                  {(a.accuracy * 100).toFixed(1)}%
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
      <section>
        <h2 className="text-2xl font-mono font-bold text-center mb-4">Flow Rankings</h2>
        {flows.length === 0 ? (
          <p className="text-center text-gray-600">No data</p>
        ) : (
          <ol className="max-w-2xl mx-auto space-y-2">
            {flows.map((f, idx) => (
              <li key={f.name} className="bg-white rounded shadow p-4 flex items-center">
                <span className="w-6 text-lg font-bold">{idx + 1}</span>
                <span className="flex-1 font-semibold">{f.name}</span>
                <span className="text-sm text-gray-500 mr-2">
                  {f.wins}/{f.wins + f.losses}
                </span>
                <span className="text-sm text-gray-600">
                  {(f.accuracy * 100).toFixed(1)}%
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
};

export default Leaderboard;

