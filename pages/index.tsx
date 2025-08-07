import { useEffect, useState } from 'react';
import useSWR from 'swr';
import MatchupInputForm from '../components/MatchupInputForm';
import PredictionsPanel from '../components/PredictionsPanel';
import AgentNodeGraph from '../components/AgentNodeGraph';
import AgentLeaderboardPanel, { type AgentAccuracyEntry } from '../components/AgentLeaderboardPanel';
import LiveGameLogsPanel from '../components/LiveGameLogsPanel';
import AgentStatusPanel from '../components/AgentStatusPanel';
import useFlowVisualizer from '../lib/dashboard/useFlowVisualizer';
import type { AgentOutputs, PickSummary } from '../lib/types';
import type { AgentExecution as BaseAgentExecution } from '../lib/flow/runFlow';

interface AgentExecution extends BaseAgentExecution {
  weight?: number;
  description?: string;
}

export default function Home() {
  const [agents, setAgents] = useState<AgentOutputs>({});
  const [pick, setPick] = useState<PickSummary | null>(null);
  const [logs, setLogs] = useState<AgentExecution[][]>([]);
  const [flowStarted, setFlowStarted] = useState(false);
  const [currentParams, setCurrentParams] = useState<{
    homeTeam: string;
    awayTeam: string;
    week: number;
  } | null>(null);
  const { statuses, handleLifecycleEvent, reset } = useFlowVisualizer();
  const [sessionId, setSessionId] = useState('');

  interface AccuracyResponse {
    agents: AgentAccuracyEntry[];
  }

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: accuracy, error: accuracyError } = useSWR<AccuracyResponse>(
    '/api/accuracy',
    fetcher
  );

  useEffect(() => {
    const sid =
      typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null;
    if (sid) {
      setSessionId(sid);
    }
  }, []);

  const handleStart = (info: {
    homeTeam: string;
    awayTeam: string;
    week: number;
  }) => {
    setFlowStarted(true);
    setAgents({});
    setPick(null);
    reset();
    setLogs((prev) => [...prev, []]);
    setCurrentParams(info);
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
      setAgents((prev) => ({
        ...prev,
        [exec.name]: {
          ...exec.result,
          weight: exec.weight,
          scoreTotal: exec.scoreTotal,
          confidenceEstimate: exec.confidenceEstimate,
          description: exec.description,
        },
      }));
    }
  };

  const handleComplete = (data: { pick: PickSummary }) => {
    setPick(data.pick);
  };

  const handleRetryAgent = (agentName: string) => {
    if (!currentParams) return;
    const sid =
      typeof window !== 'undefined' ? localStorage.getItem('sessionId') || '' : '';
    const { homeTeam, awayTeam, week } = currentParams;
    try {
      const es = new EventSource(
        `/api/run-agents?homeTeam=${encodeURIComponent(
          homeTeam
        )}&awayTeam=${encodeURIComponent(awayTeam)}&week=${week}&agent=${agentName}&sessionId=${sid}`
      );
      es.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'agent') {
          handleAgent({
            name: data.name,
            result: data.result,
            error: data.error,
            weight: data.weight,
            scoreTotal: data.scoreTotal,
            confidenceEstimate: data.confidenceEstimate,
            agentDurationMs: data.agentDurationMs,
            sessionId: data.sessionId,
            description: data.description,
          });
        } else if (data.type === 'lifecycle') {
          handleLifecycleEvent(data);
        } else if (data.type === 'summary' || data.type === 'error') {
          es.close();
        }
      };
      es.onerror = () => es.close();
    } catch (e) {
      console.error('retry agent error', e);
    }
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
        <AgentLeaderboardPanel
          agents={accuracy?.agents}
          isLoading={!accuracy && !accuracyError}
          error={accuracyError}
        />
      </section>
      {flowStarted && (
        <AgentStatusPanel
          statuses={statuses}
          onRetry={handleRetryAgent}
          sessionId={sessionId}
        />
      )}
    </main>
  );
}
