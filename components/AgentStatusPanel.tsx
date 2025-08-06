import React, { useState } from 'react';
import { agents as agentRegistry } from '../lib/agents/registry';
import { formatAgentName } from '../lib/utils';
import type { AgentLifecycle, AgentName } from '../lib/types';

export type AgentStatusMap = Record<
  AgentName,
  { status: AgentLifecycle['status'] | 'idle'; durationMs?: number }
>;

interface Props {
  statuses: Partial<AgentStatusMap>;
}

const AgentStatusPanel: React.FC<Props> = ({ statuses }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed left-0 right-0 bottom-16 mx-auto max-w-md">
      <div className="bg-white border rounded-t shadow-lg">
        <button
          className="w-full px-4 py-2 text-left font-medium bg-gray-100"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Hide Agent Status' : 'Show Agent Status'}
        </button>
        {open && (
          <ul className="divide-y">
            {agentRegistry.map(({ name }) => {
              const info = statuses[name];
              let label = 'Waiting';
              if (info?.status === 'started') label = 'Running…';
              else if (info?.status === 'completed')
                label = `Completed in ${info.durationMs ?? 0}ms`;
              else if (info?.status === 'errored') label = 'Error';
              return (
                <li
                  key={name}
                  className="flex items-center justify-between px-4 py-2 text-sm"
                >
                  <span>{formatAgentName(name)}</span>
                  <span>{label}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AgentStatusPanel;
