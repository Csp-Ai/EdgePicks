import React, { useEffect, useState } from 'react';
import AgentTile from '../../components/agents/AgentTile';
import { registry, type AgentName } from '../../lib/agents/registry';
import type { AccuracyPoint } from '../../components/AccuracyTrend';

interface AccuracyHistory {
  history: AccuracyPoint[];
}

const sampleReasoning: Record<AgentName, string> = {
  injuryScout:
    "Multiple starters on defense are out, weakening the team's run defense. Moderate concern flagged.",
  lineWatcher:
    'Line moved from -3 to -1 despite majority bets on Team A, indicating sharp money on Team B.',
  statCruncher:
    'Over the last 5 matchups, Team A has averaged 12% more rushing yards and allowed 15% fewer 3rd-down conversions.',
  trendsAgent:
    'Team A has lost 3 straight road games, trending downward.',
  guardianAgent: 'Outputs are consistent with no contradictions.',
};

export default function AgentsPage() {
  const [history, setHistory] = useState<AccuracyPoint[]>([]);

  useEffect(() => {
    fetch('/api/accuracy-history')
      .then((r) => r.json())
      .then((d: AccuracyHistory) => setHistory(d.history || []))
      .catch(() => setHistory([]));
  }, []);

  return (
    <main className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {registry.map((agent) => (
        <AgentTile
          key={agent.name}
          name={agent.name}
          purpose={agent.description}
          sampleReasoning={sampleReasoning[agent.name]}
          history={history}
        />
      ))}
    </main>
  );
}
