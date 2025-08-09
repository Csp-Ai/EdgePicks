import React from 'react';

type AgentState = 'pending' | 'running' | 'done' | 'error';

const stateStyles: Record<AgentState, string> = {
  pending: 'bg-gray-100 text-gray-700',
  running: 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
  error: 'bg-red-100 text-red-700',
};

const stateLabels: Record<AgentState, string> = {
  pending: 'Pending',
  running: 'Running',
  done: 'Done',
  error: 'Error',
};

export const AgentBadge: React.FC<{ state: AgentState }> = ({ state }) => (
  <span className={`px-2 py-0.5 rounded text-xs font-medium ${stateStyles[state]}`}>
    {stateLabels[state]}
  </span>
);

export const DisagreementChip: React.FC<{ count: number; className?: string }> = ({ count, className = '' }) => {
  if (count <= 0) return null;
  return (
    <span
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-700 text-xs ${className}`}
    >
      {count}
    </span>
  );
};

export const BadgesPreview: React.FC = () => (
  <div className="space-y-4">
    <div className="flex gap-2">
      {(['pending', 'running', 'done', 'error'] as AgentState[]).map((state) => (
        <AgentBadge key={state} state={state} />
      ))}
    </div>
    <div className="flex gap-2">
      {[1, 2, 5].map((count) => (
        <DisagreementChip key={count} count={count} />
      ))}
    </div>
  </div>
);

export default BadgesPreview;
