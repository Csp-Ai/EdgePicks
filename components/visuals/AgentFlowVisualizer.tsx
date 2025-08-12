"use client";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useState } from "react";

type FlowEdge = { id: string; source: string; target: string };

interface AgentStatus {
  name: string;
  confidence: number;
}

const fallbackAgents = [
  "injuryScout",
  "lineWatcher",
  "statCruncher",
  "trendsAgent",
  "guardianAgent",
];

export enum SSE_STATUS {
  LIVE = "Live",
  SIMULATED = "Simulated",
}

export default function AgentFlowVisualizer({
  setEdges,
}: {
  setEdges: Dispatch<SetStateAction<FlowEdge[]>>;
}) {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [top, setTop] = useState<AgentStatus | null>(null);
  const [status, setStatus] = useState<SSE_STATUS>(SSE_STATUS.LIVE);

  const applyEdges = (update: SetStateAction<FlowEdge[]>) => {
    setEdges(prev => (typeof update === "function" ? update(prev) : update));
  };
  const appendEdge = useCallback(
    (edge: FlowEdge) => {
      applyEdges(prev => [...prev, edge]);
    },
    [applyEdges],
  );

  useEffect(() => {
    let es: EventSource | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;
    let edgeCount = 0;

    const updateTop = (list: AgentStatus[]) => {
      if (!list.length) {
        setTop(null);
        return;
      }
      const max = list.reduce((m, a) => (a.confidence > m.confidence ? a : m), list[0]);
      setTop(max);
    };

    const startSimulation = () => {
      setStatus(SSE_STATUS.SIMULATED);
      let i = 0;
      timer = setInterval(() => {
        const name = fallbackAgents[i % fallbackAgents.length];
        const confidence = Math.floor(Math.random() * 101);
        setAgents(prev => {
          const next = [...prev.filter(a => a.name !== name), { name, confidence }];
          updateTop(next);
          return next;
        });
        appendEdge({ id: `sim-${edgeCount++}`, source: name, target: 'top' });
        i++;
      }, 1000);
    };

    if (typeof EventSource !== "undefined") {
      try {
        es = new EventSource("/api/run-agents");
        es.onmessage = ev => {
          try {
            const data = JSON.parse(ev.data);
            if (data.agent && typeof data.confidence === "number") {
              setAgents(prev => {
                const next = [...prev.filter(a => a.name !== data.agent), { name: data.agent, confidence: data.confidence }];
                updateTop(next);
                return next;
              });
              appendEdge({ id: `evt-${edgeCount++}`, source: data.agent, target: 'top' });
            }
          } catch {
            // ignore parse errors
          }
        };
        es.onerror = () => {
          es?.close();
          startSimulation();
        };
      } catch {
        startSimulation();
      }
    } else {
      startSimulation();
    }

    return () => {
      es?.close();
      if (timer) clearInterval(timer);
    };
  }, [setEdges, appendEdge]);

  return (
    <section aria-labelledby="agent-flow" className="rounded-xl border p-4">
      <h2 id="agent-flow" className="text-lg font-semibold">
        Agent Flow <span className="text-xs text-muted-foreground">({status})</span>
      </h2>
      <ul className="mt-2 space-y-1">
        {agents.map(a => (
          <li key={a.name} className="flex justify-between text-sm">
            <span>{a.name}</span>
            <span className="font-mono">{a.confidence}%</span>
          </li>
        ))}
      </ul>
      {top && (
        <div className="mt-4 text-sm">
          Top agent: <span className="font-medium">{top.name}</span> ({top.confidence}% confidence)
        </div>
      )}
    </section>
  );
}
