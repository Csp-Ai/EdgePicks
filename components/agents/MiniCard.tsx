import React from 'react';
import { AgentName } from '@/lib/agents/registry';
import { formatAgentName } from '@/lib/utils';

interface Props {
  name: AgentName;
  score: number;
  uncertainty: number;
}

const MiniCard: React.FC<Props> = ({ name, score, uncertainty }) => {
  const scorePct = Math.round(score * 100);
  const uncertaintyPct = Math.round(uncertainty * 100);

  return (
    <div
      className="border rounded p-2 text-center text-sm"
      data-testid={`mini-card-${name}`}
    >
      <div className="font-medium">{formatAgentName(name)}</div>
      <div className="text-gray-700">Score {scorePct}%</div>
      <div className="text-gray-500 text-xs">Uncertainty {uncertaintyPct}%</div>
    </div>
  );
};

export default MiniCard;
