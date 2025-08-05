import React from 'react';
import AgentCard from './AgentCard';
import { AgentOutputs } from '../lib/types';
import { agents as agentRegistry } from '../lib/agents/registry';

interface Props {
  agents: AgentOutputs;
}

const AgentSummary: React.FC<Props> = ({ agents }) => {
  return (
    <ul className="mt-2 text-sm space-y-3">
      {agentRegistry.map(({ name, weight }) => (
        <li key={name}>
          <AgentCard name={name} result={agents[name]} weight={weight} showWeight />
        </li>
      ))}
    </ul>
  );
};

export default AgentSummary;
