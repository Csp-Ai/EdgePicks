import React, { useMemo } from 'react';
import AgentNodeGraph from './AgentNodeGraph';
import { AgentEvent } from '../lib/events/agentEvents';
import type { AgentName, AgentLifecycle } from '../lib/types';

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

  const statuses = useMemo(() => {
    const map: Record<AgentName, { status: AgentLifecycle['status'] | 'idle' }> = {};
    Object.entries(stateMap).forEach(([id, state]) => {
      let status: AgentLifecycle['status'] | 'idle' = 'idle';
      if (state === 'start') status = 'started';
      if (state === 'result' || state === 'end') status = 'completed';
      if (state === 'error') status = 'errored';
      map[id as AgentName] = { status };
    });
    return map;
  }, [stateMap]);

  return (
    <div>
      <AgentNodeGraph statuses={statuses} />
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
