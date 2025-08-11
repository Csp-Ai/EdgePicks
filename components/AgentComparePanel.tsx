import React from 'react';
import AgentCard from './AgentCard';
import { AgentOutputs, AgentName } from '@/lib/types';

interface Props {
  agents: AgentOutputs;
}

const AgentComparePanel: React.FC<Props> = ({ agents }) => {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {(Object.keys(agents) as AgentName[]).map((name) => (
        <AgentCard key={name} name={name} result={agents[name]} showTeam />
      ))}
    </div>
  );
};

export default AgentComparePanel;
