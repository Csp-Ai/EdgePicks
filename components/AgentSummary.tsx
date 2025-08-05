import React from 'react';
import AgentCard from './AgentCard';
import { AgentOutputs, AgentName } from '../lib/types';

interface Props {
  agents: AgentOutputs;
}

const weights: Record<AgentName, number> = {
  injuryScout: 0.5,
  lineWatcher: 0.3,
  statCruncher: 0.2,
};

const AgentSummary: React.FC<Props> = ({ agents }) => {
  return (
    <ul className="mt-2 text-sm space-y-3">
      {(Object.keys(agents) as AgentName[]).map((name) => (
        <li key={name}>
          <AgentCard
            name={name}
            result={agents[name]}
            weight={weights[name]}
            showWeight
          />
        </li>
      ))}
    </ul>
  );
};

export default AgentSummary;
