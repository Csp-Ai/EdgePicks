"use client";
import { useEffect, useState } from "react";
import type React from "react";
import type { Edge as FlowEdge, Node as FlowNode } from "reactflow";

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

export default function AgentFlowVisualizer() {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [top, setTop] = useState<AgentStatus | null>(null);
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<FlowEdge[]>([]);
  const applyEdges = (u: React.SetStateAction<FlowEdge[]>) => setEdges(u);

  useEffect(() => {
    let es: EventSource | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;

    const updateTop = (list: AgentStatus[]) => {
      if (!list.length) {
        setTop(null);
        return;
      }
      const max = list.reduce((m, a) => (a.confidence > m.confidence ? a : m), list[0]);
      setTop(max);
    };

    const startSimulation = () => {
      let i = 0;
      timer = setInterval(() => {
        const name = fallbackAgents[i % fallbackAgents.length];
        const confidence = Math.floor(Math.random() * 101);
        setAgents(prev => {
          const next = [...prev.filter(a => a.name !== name), { name, confidence }];
          updateTop(next);
          return next;
        });
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
  }, []);

  return (
    <section aria-labelledby="agent-flow" className="rounded-xl border p-4">
      <h2 id="agent-flow" className="text-lg font-semibold">
        Agent Flow
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
