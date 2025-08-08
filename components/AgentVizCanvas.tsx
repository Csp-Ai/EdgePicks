import React, { useMemo } from 'react';
import AgentNodeGraph from './AgentNodeGraph';
import { AgentEvent } from '../lib/events/agentEvents';
import type { AgentName, AgentLifecycle } from '../lib/types';
import type { FlowNode, FlowEdge } from '../lib/dashboard/useFlowVisualizer';

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
            data-testid={`node-${id}`}
            data-agent-id={id}
            data-state={state}
            tabIndex={0}
            className={`px-2 py-1 rounded border text-xs ${
              skipAnimations ? 'no-anim' : 'anim transition-colors'
            } ${state === 'error' ? 'bg-red-200' : state === 'result' ? 'bg-green-200' : 'bg-blue-200'}`}
          >
            {id}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentVizCanvas;
