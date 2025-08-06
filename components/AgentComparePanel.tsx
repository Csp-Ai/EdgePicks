import React from 'react';
import AgentCard from './AgentCard';
import { AgentOutputs, AgentName } from '../lib/types';

interface Props {
  agents: AgentOutputs;
}

const AgentComparePanel: React.FC<Props> = ({ agents }) => {
  return (
    <div className="mt-4 flex gap-4 overflow-x-auto snap-x snap-mandatory sm:grid sm:grid-cols-3">
      {(Object.keys(agents) as AgentName[]).map((name) => (
        <div key={name} className="flex-shrink-0 w-64 snap-center sm:w-auto">
          <AgentCard name={name} result={agents[name]} showTeam />
        </div>
      ))}
    </div>
  );
};

export default AgentComparePanel;
