import { useState } from 'react';
import MatchupInputForm from '../components/MatchupInputForm';
import PredictionsPanel from '../components/PredictionsPanel';
import AgentNodeGraph from '../components/AgentNodeGraph';
import Leaderboard from '../components/Leaderboard';
import useFlowVisualizer from '../lib/dashboard/useFlowVisualizer';
import type { AgentOutputs, AgentResult, PickSummary } from '../lib/types';

export default function Home() {
  const [agents, setAgents] = useState<AgentOutputs>({});
  const [pick, setPick] = useState<PickSummary | null>(null);
  const { statuses, handleLifecycleEvent, reset } = useFlowVisualizer();

  const handleStart = () => {
    setAgents({});
    setPick(null);
    reset();
  };

  const handleAgent = (name: string, result: AgentResult) => {
    setAgents((prev) => ({ ...prev, [name]: result }));
  };

  const handleComplete = (data: { pick: PickSummary }) => {
    setPick(data.pick);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 to-neutral-950 text-white p-6 space-y-8">
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold">Win more pick'em contests with live AI predictions</h1>
        <p className="text-gray-300">Agents scour news, lines and stats in real time so you lock the sharp side first.</p>
      </section>

      <MatchupInputForm
        onStart={handleStart}
        onAgent={handleAgent}
        onComplete={handleComplete}
        onLifecycle={handleLifecycleEvent}
        defaultTeamA="BOS"
        defaultTeamB="LAL"
        defaultMatchDay={1}
        autostart
      />

      <AgentNodeGraph statuses={statuses} />

      <PredictionsPanel agents={agents} pick={pick} statuses={statuses} />

      <section className="pt-8">
        <h2 className="text-center text-2xl font-semibold mb-4">Agent Leaderboard Snapshot</h2>
        <Leaderboard />
      </section>
    </main>
  );
}
