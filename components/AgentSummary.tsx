import React from 'react';
import AgentCard from './AgentCard';
import { AgentOutputs } from '../lib/types';
import { agents as agentRegistry } from '../lib/agents/registry';

interface Props {
  agents: Partial<AgentOutputs>;
}

const AgentSummary: React.FC<Props> = ({ agents }) => {
  return (
    <ul className="mt-2 text-sm space-y-3">
      {agentRegistry.map(({ name, weight }) => {
        const result = agents[name];
        return (
          <li key={name}>
            {result ? (
              <AgentCard name={name} result={result} weight={weight} showWeight />
            ) : (
              <div className="p-3 bg-gray-50 rounded shadow-sm text-gray-500">Loading...</div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default AgentSummary;
