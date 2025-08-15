import React from 'react';
import AgentCard from './AgentCard';
import { AgentOutputs, AgentName } from '@/lib/types';
import { getAgent, AgentKey } from '@/lib/types/compat';

interface Props {
  agents: AgentOutputs;
}

const AgentComparePanel: React.FC<Props> = ({ agents }) => {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {(Object.keys(agents) as AgentKey[]).map((name) => (
        <AgentCard
          key={name}
          name={name as AgentName}
          result={getAgent(agents, name)}
          showTeam
        />
      ))}
    </div>
  );
};

export default AgentComparePanel;
