import React, { useState } from 'react';
import { agents as agentRegistry } from '../lib/agents/registry';
import { formatAgentName } from '../lib/utils';
import type { AgentLifecycle, AgentName } from '../lib/types';
import AgentLogsModal from './AgentLogsModal';

export type AgentStatusMap = Record<
  AgentName,
  { status: AgentLifecycle['status'] | 'idle'; durationMs?: number }
>;

interface Props {
  statuses: Partial<AgentStatusMap>;
  onRetry?: (agent: AgentName) => void;
  sessionId: string;
}

const AgentStatusPanel: React.FC<Props> = ({ statuses, onRetry, sessionId }) => {
  const [open, setOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentName | null>(null);

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
              const errored = info?.status === 'errored';
              return (
                <li
                  key={name}
                  className="flex items-center justify-between px-4 py-2 text-sm"
                >
                  <span
                    className="flex-1 cursor-pointer"
                    onClick={() => setSelectedAgent(name)}
                  >
                    {formatAgentName(name)}
                  </span>
                  {errored ? (
                    <span className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedAgent(name)}
                        className="px-2 py-0.5 text-xs rounded bg-red-100 text-red-700"
                      >
                        Error
                      </button>
                      {onRetry && (
                        <button
                          type="button"
                          onClick={() => onRetry(name)}
                          className="text-xs text-blue-600 underline"
                        >
                          Re-run Agent
                        </button>
                      )}
                    </span>
                  ) : (
                    <span>{label}</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {selectedAgent && (
        <AgentLogsModal
          isOpen={true}
          agentId={selectedAgent}
          sessionId={sessionId}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
};

export default AgentStatusPanel;
