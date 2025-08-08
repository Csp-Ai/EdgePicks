import React, { useState } from 'react';
import MatchupInputForm from '../components/MatchupInputForm';
import PredictionsPanel from '../components/PredictionsPanel';
import useFlowVisualizer from '../lib/dashboard/useFlowVisualizer';
import type { AgentOutputs, PickSummary } from '../lib/types';
import type { AgentExecution } from '../lib/flow/runFlow';

const PredictionsPage: React.FC = () => {
  const [agents, setAgents] = useState<AgentOutputs>({});
  const [pick, setPick] = useState<PickSummary | null>(null);
  const { statuses, handleLifecycleEvent, reset, nodes, edges } =
    useFlowVisualizer();

  return (
    <main className="min-h-screen p-6 space-y-6 bg-neutral-100 dark:bg-neutral-900">
      <MatchupInputForm
        onStart={(
          _info: { homeTeam: string; awayTeam: string; week: number }
        ) => {
          setAgents({});
          setPick(null);
          reset();
        }}
        onAgent={(exec: AgentExecution) => {
          if (exec.result) {
            setAgents((prev) => ({ ...prev, [exec.name]: exec.result }));
          }
        }}
        onComplete={(data: { pick: PickSummary }) => setPick(data.pick)}
        onLifecycle={handleLifecycleEvent}
      />
      <PredictionsPanel
        agents={agents}
        pick={pick}
        statuses={statuses}
        nodes={nodes}
        edges={edges}
      />
    </main>
  );
};

export default PredictionsPage;
