import React from 'react';
import type { FlowNode } from './useFlowVisualizer';

interface Props {
  nodes: FlowNode[];
  startTime?: number | null;
}

const statusColors: Record<FlowNode['status'], string> = {
  pending: 'bg-gray-300',
  running: 'bg-blue-400 animate-pulse',
  completed: 'bg-green-400',
  errored: 'bg-red-400',
};

/**
 * Visual representation of agents over time. Each agent renders as a row with
 * a bar that spans its execution window relative to the flow's start time.
 */
const AgentTimeline: React.FC<Props> = ({ nodes, startTime }) => {
  const now = Date.now();
  if (!nodes.length) {
    return <p className="text-sm text-gray-500">Waiting for agents...</p>;
  }

  const start = startTime ?? Math.min(...nodes.map((n) => n.startedAt ?? now));
  const end = Math.max(...nodes.map((n) => n.endedAt ?? now));
  const total = end - start || 1;

  return (
    <div className="space-y-4 w-full">
      {nodes.map((n) => {
        const s = n.startedAt ?? start;
        const e = n.endedAt ?? now;
        const offset = ((s - start) / total) * 100;
        const width = ((e - s) / total) * 100;
        const color = statusColors[n.status];
        return (
          <div key={n.id}>
            <div className="flex justify-between text-sm mb-1">
              <span>{n.label}</span>
              {n.durationMs != null && <span>{(n.durationMs / 1000).toFixed(2)}s</span>}
            </div>
            <div className="relative h-2 bg-gray-200 rounded">
              <div
                className={`absolute h-2 rounded ${color}`}
                style={{ left: `${offset}%`, width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AgentTimeline;

