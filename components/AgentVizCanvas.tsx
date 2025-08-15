import React, { useMemo, useRef, useState } from 'react';
import AgentNodeGraph from './AgentNodeGraph';
import { AgentEvent } from '@/lib/events/agentEvents';
import type { AgentName, AgentLifecycle } from '@/lib/types';
import type { FlowNode, FlowEdge } from '@/lib/dashboard/useFlowVisualizer';
import AgentNodePopover from './agents/AgentNodePopover';
import { logEvent } from '@/lib/telemetry/logger';

interface Props {
  events: AgentEvent[];
  skipAnimations?: boolean;
}

const AgentVizCanvas: React.FC<Props> = ({ events, skipAnimations }) => {
  const stateMap = useMemo(() => {
    const map: Record<string, AgentEvent['type']> = {};
    events.forEach((e) => {
      map[e.agentId] = e.type;
    });
    return map;
  }, [events]);

  const metricsMap = useMemo(() => {
    const map: Record<
      string,
      { score?: number; start?: number; end?: number }
    > = {};
    events.forEach((e) => {
      const id = e.agentId;
      if (!map[id]) map[id] = {};
      if (e.type === 'start') map[id].start = e.ts;
      if (e.type === 'end') map[id].end = e.ts;
      if (e.type === 'result' && e.payload?.score !== undefined)
        map[id].score = e.payload.score;
    });
    const res: Record<
      string,
      { score?: number; durationMs?: number; status: string }
    > = {};
    Object.entries(map).forEach(([id, m]) => {
      res[id] = {
        score: m.score,
        durationMs:
          m.start !== undefined && m.end !== undefined
            ? m.end - m.start
            : undefined,
        status: stateMap[id] || 'pending',
      };
    });
    return res;
  }, [events, stateMap]);

  const [popover, setPopover] = useState<{
    id: string;
    top: number;
    left: number;
  } | null>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleNodeClick = (
    e: React.MouseEvent<HTMLDivElement>,
    id: string,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPopover({
      id,
      top: rect.bottom + window.scrollY,
      left: rect.left + rect.width / 2 + window.scrollX,
    });
  };

  const handleRunSolo = (id: string) => {
    // Placeholder for solo run action
    void logEvent({ level: 'debug', name: 'agent-run-solo', meta: { id } });
  };

  const { nodes, edges } = useMemo(() => {
    const order: AgentName[] = [];
    const statusMap: Record<AgentName, 'pending' | 'running' | 'completed' | 'errored'> = {};
    events.forEach((e) => {
      const id = e.agentId as AgentName;
      if (e.type === 'start') {
        order.push(id);
        statusMap[id] = 'running';
      } else if (e.type === 'result' || e.type === 'end') {
        statusMap[id] = 'completed';
      } else if (e.type === 'error') {
        statusMap[id] = 'errored';
      }
    });
    const nodes: FlowNode[] = order.map((id) => ({
      id,
      label: id,
      status: statusMap[id] || 'pending',
    }));
    const edges: FlowEdge[] = [];
    for (let i = 1; i < order.length; i++) {
      edges.push({
        id: `${order[i - 1]}-${order[i]}`,
        source: order[i - 1],
        target: order[i],
      });
    }
    return { nodes, edges };
  }, [events]);

  return (
    <div>
      <AgentNodeGraph nodes={nodes} edges={edges} />
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(stateMap).map(([id, state]) => (
          <div
            key={id}
            ref={(el) => {
              nodeRefs.current[id] = el;
            }}
            onClick={(e) => handleNodeClick(e, id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNodeClick(e as any, id);
              }
            }}
            role="button"
            data-testid={`node-${id}`}
            data-agent-id={id}
            data-state={state}
            tabIndex={0}
            className={`px-2 py-1 rounded border text-xs cursor-pointer ${
              skipAnimations ? 'no-anim' : 'anim transition-colors'
            } ${state === 'error' ? 'bg-red-200' : state === 'result' ? 'bg-green-200' : 'bg-blue-200'}`}
          >
            {id}
          </div>
        ))}
      </div>
      {popover && (
        <AgentNodePopover
          agentId={popover.id}
          metrics={metricsMap[popover.id] || { status: stateMap[popover.id] }}
          onRunSolo={handleRunSolo}
          onClose={() => setPopover(null)}
          style={{
            top: popover.top,
            left: popover.left,
            transform: 'translate(-50%, 0)',
          }}
        />
      )}
    </div>
  );
};

export default AgentVizCanvas;
