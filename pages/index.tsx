import { useState } from 'react';
import MatchupInputForm from '../components/MatchupInputForm';
import PredictionsPanel from '../components/PredictionsPanel';
import AgentNodeGraph from '../components/AgentNodeGraph';
import Leaderboard from '../components/Leaderboard';
import LiveGameLogsPanel from '../components/LiveGameLogsPanel';
import AgentStatusPanel from '../components/AgentStatusPanel';
import useFlowVisualizer from '../lib/dashboard/useFlowVisualizer';
import type { AgentOutputs, PickSummary } from '../lib/types';
import type { AgentExecution } from '../lib/flow/runFlow';

export default function Home() {
  const [agents, setAgents] = useState<AgentOutputs>({});
  const [pick, setPick] = useState<PickSummary | null>(null);
  const [logs, setLogs] = useState<AgentExecution[][]>([]);
  const { statuses, handleLifecycleEvent, reset } = useFlowVisualizer();

  const handleStart = () => {
    setAgents({});
    setPick(null);
    reset();
    setLogs((prev) => [...prev, []]);
  };

  const handleAgent = (exec: AgentExecution) => {
    setLogs((prev) => {
      const updated = [...prev];
      const current = updated[updated.length - 1] || [];
      current.push(exec);
      updated[updated.length - 1] = current;
      return updated;
    });
    if (exec.result) {
      setAgents((prev) => ({ ...prev, [exec.name]: exec.result }));
    }
  };

  const handleComplete = (data: { pick: PickSummary }) => {
    setPick(data.pick);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 to-neutral-950 text-white p-6 space-y-8">
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold">Win more pick&apos;em contests with live AI predictions</h1>
        <p className="text-gray-300">Agents scour news, lines and stats in real time so you lock the sharp side first.</p>
      </section>

      <MatchupInputForm
        onStart={handleStart}
        onAgent={handleAgent}
        onComplete={handleComplete}
        onLifecycle={handleLifecycleEvent}
      />

      <AgentNodeGraph statuses={statuses} />
      <LiveGameLogsPanel logs={logs} />

      <PredictionsPanel agents={agents} pick={pick} statuses={statuses} />

      <section className="pt-8">
        <h2 className="text-center text-2xl font-semibold mb-4">Agent Leaderboard Snapshot</h2>
        <Leaderboard />
      </section>
      <AgentStatusPanel statuses={statuses} />
    </main>
  );
}
