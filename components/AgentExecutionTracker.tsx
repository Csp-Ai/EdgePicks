import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, AlertTriangle, Circle } from 'lucide-react';

export type AgentStatus = 'pending' | 'running' | 'completed' | 'error';

export interface AgentMeta {
  name: string;
  label?: string;
  icon?: React.ReactNode;
}

export interface LifecycleEvent {
  name: string;
  status: AgentStatus;
  timestamp?: number;
}

interface Props {
  agents: AgentMeta[];
  events?: LifecycleEvent[];
  mode?: 'live' | 'demo';
}

const statusRank: Record<AgentStatus, number> = {
  pending: 0,
  running: 1,
  completed: 2,
  error: 2,
};

const mergeStatus = (prev: AgentStatus, next: AgentStatus): AgentStatus => {
  return statusRank[next] >= statusRank[prev] ? next : prev;
};

const AgentExecutionTracker: React.FC<Props> = ({
  agents,
  events = [],
  mode = 'live',
}) => {
  const [runId, setRunId] = useState(0);
  const base = useMemo(
    () => Object.fromEntries(agents.map((a) => [a.name, 'pending' as AgentStatus])),
    [agents, runId],
  );

  const [statuses, setStatuses] = useState<Record<string, AgentStatus>>(base);
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const subscriptionsRef = useRef<Array<() => void>>([]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      subscriptionsRef.current.forEach((unsub) => unsub());
      subscriptionsRef.current = [];
    };
  }, []);

  // apply events
  useEffect(() => {
    setStatuses((prev) => {
      const next = { ...base };
      for (const e of events) {
        if (!(e.name in next)) continue;
        next[e.name] = mergeStatus(next[e.name], e.status);
      }
      return next;
    });
  }, [events, base]);

  // demo mode simulation
  useEffect(() => {
    if (mode !== 'demo') return;
    agents.forEach((agent, i) => {
      const start = setTimeout(() => {
        setStatuses((s) => ({ ...s, [agent.name]: 'running' }));
      }, i * 1000);
      const end = setTimeout(() => {
        setStatuses((s) => ({ ...s, [agent.name]: 'completed' }));
      }, i * 1000 + 800);
      timeoutsRef.current.push(start, end);
    });
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [mode, agents, runId]);

  const allDone = useMemo(
    () =>
      agents.every(
        (a) => statuses[a.name] === 'completed' || statuses[a.name] === 'error',
      ),
    [agents, statuses],
  );

  const replay = () => {
    setRunId((r) => r + 1);
    setStatuses(base);
  };

  return (
    <div className="w-full text-white" data-testid="agent-tracker">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Live Agent Execution</h3>
        <p className="text-xs text-slate-400">Powered by Modular AI Agents</p>
      </div>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {agents.map((agent, idx) => {
          const status = statuses[agent.name];
          const Icon =
            status === 'completed'
              ? CheckCircle2
              : status === 'error'
              ? AlertTriangle
              : Circle;
          return (
            <div key={agent.name} className="flex flex-col items-center">
              <div
                data-testid={`node-${agent.name}`}
                data-status={status}
                className={`relative w-12 h-12 flex items-center justify-center rounded-full border-2 transition-colors ${
                  status === 'running'
                    ? 'border-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.7)]'
                    : status === 'completed'
                    ? 'border-green-500'
                    : status === 'error'
                    ? 'border-red-500'
                    : 'border-slate-600'
                }`}
              >
                {agent.icon || <Icon className="w-6 h-6" />}
              </div>
              <span className="mt-2 text-xs text-center w-16 truncate">
                {agent.label || agent.name}
              </span>
              {idx < agents.length - 1 && (
                <span className="hidden sm:block absolute top-6 left-full w-8 h-px bg-slate-600" />
              )}
            </div>
          );
        })}
      </div>
      {allDone && (
        <div className="text-center mt-4" data-testid="flow-complete">
          <div className="inline-block px-3 py-1 bg-green-600/20 text-green-400 rounded">
            Flow Complete
          </div>
          {mode === 'demo' && (
            <div>
              <button
                className="mt-2 text-sm underline text-blue-400"
                onClick={replay}
              >
                Replay
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentExecutionTracker;

