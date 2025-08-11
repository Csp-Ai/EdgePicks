import React, { useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import AgentTimeline from '@/lib/dashboard/AgentTimeline';
import useFlowVisualizer from '@/lib/dashboard/useFlowVisualizer';
import AgentStatusPanel from '@/components/AgentStatusPanel';
import MatchupInputForm from '@/components/MatchupInputForm';
import LiveGameLogsPanel from '@/components/LiveGameLogsPanel';
import type { AgentExecution } from '@/lib/flow/runFlow';

const DashboardPage: React.FC = () => {
  const { nodes, startTime, handleLifecycleEvent, reset, statuses } =
    useFlowVisualizer();
  const [logs, setLogs] = useState<AgentExecution[][]>([]);
  const [flowStarted, setFlowStarted] = useState(false);
  const [sessionId, setSessionId] = useState('');

  const handleStart = (
    _info: { homeTeam: string; awayTeam: string; week: number }
  ) => {
    setFlowStarted(true);
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
  };

  useEffect(() => {
    const sid = typeof window !== 'undefined' ? localStorage.getItem('sessionId') || '' : '';
    setSessionId(sid);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Agent Dashboard</h1>
      <MatchupInputForm
        onStart={handleStart}
        onAgent={handleAgent}
        onComplete={() => {}}
        onLifecycle={handleLifecycleEvent}
      />
      {logs.length > 0 && (
        <section className="my-4">
          <h2 className="text-lg font-semibold mb-2">Agent Logs</h2>
          <LiveGameLogsPanel logs={logs} />
        </section>
      )}
      <AgentTimeline nodes={nodes} startTime={startTime} />
      {flowStarted && <AgentStatusPanel statuses={statuses} sessionId={sessionId} />}
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
