import { useCallback, useRef, useState } from 'react';
import type { AgentLifecycle, AgentName } from '../types';

export type NodeStatus = 'pending' | 'running' | 'completed' | 'errored';

export interface FlowNode {
  id: AgentName;
  label: AgentName;
  status: NodeStatus;
  startedAt?: number;
  endedAt?: number;
  durationMs?: number;
}

export interface FlowEdge {
  id: string;
  source: AgentName;
  target: AgentName;
}

/**
 * Hook that translates agent lifecycle events from the SSE stream into
 * structures that are easier to visualize (nodes, edges, timestamps).
 */
export default function useFlowVisualizer() {
  const [nodes, setNodes] = useState<Record<AgentName, FlowNode>>({});
  const [edges, setEdges] = useState<FlowEdge[]>([]);
  const flowStartRef = useRef<number | null>(null);
  const lastNodeRef = useRef<AgentName | null>(null);

  const reset = useCallback(() => {
    setNodes({});
    setEdges([]);
    flowStartRef.current = null;
    lastNodeRef.current = null;
  }, []);

  const handleLifecycleEvent = useCallback(
    (event: { name: AgentName } & AgentLifecycle) => {
      setNodes((prev) => {
        const existing =
          prev[event.name] || ({
            id: event.name,
            label: event.name,
            status: 'pending' as NodeStatus,
          } as FlowNode);

        const updated: FlowNode = { ...existing };

        if (event.status === 'started') {
          updated.status = 'running';
          updated.startedAt = event.startedAt;
          if (flowStartRef.current === null || event.startedAt < flowStartRef.current) {
            flowStartRef.current = event.startedAt;
          }
          // Link to previous node to form a simple chain/DAG
          if (lastNodeRef.current) {
            setEdges((es) => [
              ...es,
              {
                id: `${lastNodeRef.current}-${event.name}`,
                source: lastNodeRef.current as AgentName,
                target: event.name,
              },
            ]);
          }
          lastNodeRef.current = event.name;
        } else if (event.status === 'completed') {
          updated.status = 'completed';
          updated.endedAt = event.endedAt;
          updated.durationMs = event.durationMs;
        } else if (event.status === 'errored') {
          updated.status = 'errored';
          updated.endedAt = event.endedAt;
          updated.durationMs = event.durationMs;
        }

        return { ...prev, [event.name]: updated };
      });
    },
    []
  );

  const nodeList = Object.values(nodes).sort(
    (a, b) => (a.startedAt ?? 0) - (b.startedAt ?? 0)
  );

  return {
    nodes: nodeList,
    edges,
    startTime: flowStartRef.current,
    handleLifecycleEvent,
    reset,
  };
}

