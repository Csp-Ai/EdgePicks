import React from 'react';
import { formatAgentName } from '@/lib/utils';
import type { AgentName } from '@/lib/agents/registry';

interface AgentComparison {
  name: AgentName;
  weight: number;
  reasoning: string;
}

interface Props {
  left: AgentComparison;
  right: AgentComparison;
}

const Comparator: React.FC<Props> = ({ left, right }) => {
  const agents = [left, right];
  return (
    <div className="grid grid-cols-2 gap-4" data-testid="agent-comparator">
      {agents.map((agent, idx) => (
        <div key={idx} className="border rounded p-4">
          <h3 className="font-semibold mb-1">{formatAgentName(agent.name)}</h3>
          <p className="text-sm text-gray-700 mb-1">Weight: {agent.weight}</p>
          <p className="text-xs text-gray-500">{agent.reasoning}</p>
        </div>
      ))}
    </div>
  );
};

export default Comparator;
