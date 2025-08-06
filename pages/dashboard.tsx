import React, { useEffect } from 'react';
import type { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
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


export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: '/auth/signin', permanent: false } };
  }
  return { props: { session } };
};
