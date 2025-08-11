import React from 'react';
import AgentCard from './AgentCard';
import { AgentOutputs } from '@/lib/types';
import { registry as agentRegistry } from '@/lib/agents/registry';

interface Props {
  agents: Partial<AgentOutputs>;
}

const AgentSummary: React.FC<Props> = ({ agents }) => {
  return (
    <ul className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {agentRegistry.map(({ name, weight }) => {
        const result = agents[name];
        return (
          <li key={name} className="list-none">
            <AgentCard name={name} result={result} weight={weight} showWeight />
          </li>
        );
      })}
    </ul>
  );
};

export default AgentSummary;
