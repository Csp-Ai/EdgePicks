import React from 'react';
import type { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import AgentTimeline from '../lib/dashboard/AgentTimeline';
import useFlowVisualizer from '../lib/dashboard/useFlowVisualizer';
import MatchupInputForm from '../components/MatchupInputForm';

const DashboardPage: React.FC = () => {
  const { nodes, startTime, handleLifecycleEvent, reset } = useFlowVisualizer();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Agent Dashboard</h1>
      <MatchupInputForm
        onStart={(_info) => reset()}
        onAgent={(_name, _result) => {}}
        onComplete={(_data) => {}}
        onLifecycle={handleLifecycleEvent}
      />
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
