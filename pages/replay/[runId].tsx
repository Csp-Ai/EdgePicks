import React from 'react';
import { useRouter } from 'next/router';
import AgentReplay from '../../components/replay/AgentReplay';

const ReplayPage: React.FC = () => {
  const { query } = useRouter();
  const runId = typeof query.runId === 'string' ? query.runId : '';

  if (!runId) return null;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <header className="text-center mb-4">
        <h1 className="text-2xl font-bold">Agent Replay</h1>
        <p className="text-gray-600">Run {runId}</p>
      </header>
      <AgentReplay runId={runId} />
    </main>
  );
};

export default ReplayPage;
