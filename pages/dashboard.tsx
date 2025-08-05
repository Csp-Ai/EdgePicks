import React, { useEffect } from 'react';
import AgentTimeline from '../lib/dashboard/AgentTimeline';
import useFlowVisualizer from '../lib/dashboard/useFlowVisualizer';

const DashboardPage: React.FC = () => {
  const { nodes, startTime, handleLifecycleEvent } = useFlowVisualizer();

  useEffect(() => {
    const es = new EventSource('/api/run-agents?teamA=LAL&teamB=BOS&matchDay=1');
    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'lifecycle') {
        handleLifecycleEvent(data);
      }
    };
    return () => es.close();
  }, [handleLifecycleEvent]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Agent Dashboard</h1>
      <AgentTimeline nodes={nodes} startTime={startTime} />
    </div>
  );
};

export default DashboardPage;

