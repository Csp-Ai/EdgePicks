import React, { useCallback, useMemo, useRef, useState } from 'react';
import MatchupInputForm from './MatchupInputForm';
import PredictionsPanel from './PredictionsPanel';
import AgentExecutionTracker, {
  LifecycleEvent,
  AgentStatus,
} from './AgentExecutionTracker';
import useFlowVisualizer from '../lib/dashboard/useFlowVisualizer';
import type { AgentOutputs, PickSummary, AgentResult } from '../lib/types';
import type { AgentExecution } from '../lib/flow/runFlow';
import agentsMeta from '../lib/agents/agents.json';

export type AgentEvent = {
  id: string;
  agent: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  ts: string;
  detail?: any;
};

export type TrackerProps = {
  events?: AgentEvent[];
  demo?: boolean;
};

const MatchupInsights: React.FC<TrackerProps> = ({ events: propEvents, demo }) => {
  const [agents, setAgents] = useState<AgentOutputs>({});
  const [pick, setPick] = useState<PickSummary | null>(null);
  const { statuses, handleLifecycleEvent, reset, nodes, edges } =
    useFlowVisualizer();
  const [liveEvents, setLiveEvents] = useState<LifecycleEvent[]>([]);
  const [revealed, setRevealed] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const allAgents = useMemo(
    () => agentsMeta.map((a) => ({ name: a.name, label: a.name })),
    [],
  );

  const eventList: LifecycleEvent[] = propEvents
    ? propEvents.map((e) => ({ name: e.agent, status: e.status as AgentStatus }))
    : liveEvents;

  const flowComplete = useMemo(() => {
    return allAgents.every((a) => {
      const last = eventList
        .filter((e) => e.name === a.name)
        .map((e) => e.status)
        .pop();
      return last === 'completed' || last === 'error';
    });
  }, [eventList, allAgents]);

  const onLifecycle = useCallback(
    (e: { name: string; status: string }) => {
      handleLifecycleEvent(e as any);
      const mapped: AgentStatus =
        e.status === 'started'
          ? 'running'
          : e.status === 'errored'
          ? 'error'
          : 'completed';
      setLiveEvents((prev) => [...prev, { name: e.name, status: mapped }]);
    },
    [handleLifecycleEvent],
  );

  const onReveal = () => {
    setRevealed(true);
    anchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen p-6 space-y-6 bg-neutral-100 dark:bg-neutral-900">
      {!propEvents && !demo && (
        <MatchupInputForm
          onStart={(
            _info: { homeTeam: string; awayTeam: string; week: number },
          ) => {
            setAgents({});
            setPick(null);
            reset();
            setLiveEvents([]);
            setRevealed(false);
          }}
          onAgent={(exec: AgentExecution) => {
            if (exec.result) {
              setAgents((prev) => ({ ...prev, [exec.name]: exec.result as AgentResult }));
            }
          }}
          onComplete={(data: { pick: PickSummary }) => setPick(data.pick)}
          onLifecycle={onLifecycle}
        />
      )}
      <AgentExecutionTracker
        agents={allAgents}
        events={eventList}
        mode={demo ? 'demo' : 'live'}
      />
      {flowComplete && !revealed && (
        <button
          onClick={onReveal}
          className="px-4 py-2 bg-blue-600 text-white rounded"
          data-testid="reveal-cta"
        >
          Reveal Predictions
        </button>
      )}
      <div ref={anchorRef} data-testid="predictions-anchor" />
      {revealed && !propEvents && !demo && (
        <PredictionsPanel
          agents={agents}
          pick={pick}
          statuses={statuses}
          nodes={nodes}
          edges={edges}
        />
      )}
      {revealed && (propEvents || demo) && (
        <div data-testid="predictions-list">Demo Predictions</div>
      )}
    </main>
  );
};

export default MatchupInsights;
