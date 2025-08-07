import React, { useState } from 'react';
import MatchupInputForm from '../components/MatchupInputForm';
import PredictionsPanel from '../components/PredictionsPanel';
import useFlowVisualizer from '../lib/dashboard/useFlowVisualizer';
import type { AgentOutputs, AgentResult, PickSummary } from '../lib/types';

const PredictionsPage: React.FC = () => {
  const [agents, setAgents] = useState<AgentOutputs>({});
  const [pick, setPick] = useState<PickSummary | null>(null);
  const { statuses, handleLifecycleEvent, reset } = useFlowVisualizer();

  return (
    <main className="min-h-screen bg-gray-50 p-6 space-y-6">
      <MatchupInputForm
        onStart={() => {
          setAgents({});
          setPick(null);
          reset();
        }}
        onAgent={(name: string, result: AgentResult) =>
          setAgents((prev) => ({ ...prev, [name]: result }))
        }
        onComplete={(data: { pick: PickSummary }) => setPick(data.pick)}
        onLifecycle={handleLifecycleEvent}
      />
      <PredictionsPanel agents={agents} pick={pick} statuses={statuses} />
    </main>
  );
};

export default PredictionsPage;
