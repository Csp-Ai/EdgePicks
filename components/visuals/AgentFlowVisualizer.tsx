"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Edge as FlowEdge, Node as FlowNode } from "reactflow";
import { NEXT_PUBLIC_AGENT_FLOW_MODE } from "@/lib/env";

export type AgentEvent =
  | { type: "start"; agentId: string; ts: number }
  | { type: "result"; agentId: string; ts: number; confidence?: number }
  | { type: "end"; agentId: string; ts: number };

export type SSE_STATUS = "connecting" | "open" | "closed" | "error" | "simulated";

type Props = {
  nodes?: FlowNode[];
  edges?: FlowEdge[];
  /**
   * Typed edge dispatcher – accepts either a full array or a functional updater.
   */
  setEdges?: (next: FlowEdge[] | ((prev: FlowEdge[]) => FlowEdge[])) => void;
  streamUrl?: string;
};

export default function AgentFlowVisualizer({
  nodes: initialNodes = [],
  edges: initialEdges = [],
  setEdges,
  streamUrl = "/api/run-agents",
}: Props) {
  const [nodes, setNodes] = useState<FlowNode[]>(initialNodes);
  const [edges, setLocalEdges] = useState<FlowEdge[]>(initialEdges);
  const [status, setStatus] = useState<SSE_STATUS>("connecting");
  const esRef = useRef<EventSource | null>(null);

  const applyEdges = useCallback((update: FlowEdge[] | ((prev: FlowEdge[]) => FlowEdge[])) => {
    if (setEdges) {
      setEdges(update);
    } else {
      setLocalEdges((prev) => (typeof update === "function" ? (update as any)(prev) : update));
    }
  }, [setEdges]);

  const appendEdge = useCallback(
    (edge: FlowEdge) => {
      applyEdges((prev) => [...prev, edge]);
    },
    [applyEdges]
  );

  const startSimulation = useCallback(() => {
    setStatus("simulated");
    // Simple pulse through a few default agents
    const agentIds = ["injuryScout", "weatherWatch", "lineMove", "publicFade", "modelBlend"];
    let idx = 0;
    const interval = setInterval(() => {
      const id = agentIds[idx % agentIds.length];
      const ts = Date.now();
      appendEdge({
        id: `sim-${id}-${ts}`,
        source: id,
        target: "consensus",
        data: { confidence: Math.round((0.55 + Math.random() * 0.4) * 100) / 100 },
      } as FlowEdge);
      idx += 1;
    }, 600);
    return () => clearInterval(interval);
  }, [appendEdge]);

  useEffect(() => {
    // If browser doesn't support SSE or env says simulate, run simulation.
    if (typeof window === "undefined" || !("EventSource" in window) || NEXT_PUBLIC_AGENT_FLOW_MODE === "sim") {
      return startSimulation();
    }
    try {
      setStatus("connecting");
      const es = new EventSource(streamUrl);
      esRef.current = es;
      es.onopen = () => setStatus("open");
      es.onerror = () => {
        setStatus("error");
        es.close();
        // fallback to simulation
        startSimulation();
      };
      es.onmessage = (e) => {
        try {
          const ev: AgentEvent = JSON.parse(e.data);
          if (ev.type === "result") {
            appendEdge({
              id: `sse-${ev.agentId}-${ev.ts}`,
              source: ev.agentId,
              target: "consensus",
              data: { confidence: ev.confidence ?? 0.6 },
            } as FlowEdge);
          }
        } catch {
          // ignore bad payloads
        }
      };
      return () => {
        setStatus("closed");
        es.close();
      };
    } catch {
      setStatus("error");
      return startSimulation();
    }
  }, [appendEdge, startSimulation, streamUrl]);

  const banner = useMemo(() => {
    if (status === "error" || status === "simulated") {
      return (
        <div className="mb-2 rounded-md border border-amber-400 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Live stream unavailable, running simulation.
        </div>
      );
    }
    return null;
  }, [status]);

  return (
    <div>
      {banner}
      <div className="text-xs text-muted-foreground mb-2">Agent Flow (status: {status})</div>
      <div className="rounded-md border p-3">
        {/* Replace with your ReactFlow canvas when ready; keeping minimal div to avoid extra deps */}
        <ul className="text-sm space-y-1 max-h-48 overflow-auto" data-testid="flow-edges">
          { (setEdges ? initialEdges : edges).length === 0 && edges.length === 0 ? (
            <li className="animate-pulse text-muted-foreground">Initializing…</li>
          ) : null }
          { (setEdges ? [] as FlowEdge[] : edges).map((e) => (
            <li key={e.id}>{e.id}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

