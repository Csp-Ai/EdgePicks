import React from 'react';
import Tooltip from '../Tooltip';
import { AgentOutputs } from '@/lib/types';
import { formatAgentName } from '@/lib/utils';

export const computeDisagreement = (
  agents: Partial<AgentOutputs>
): number => {
  const picks = Object.values(agents)
    .map((r) => r?.team ?? '')
    .filter((t): t is string => t !== '');
  if (picks.length === 0) return 0;
  const counts = picks.reduce<Record<string, number>>((acc, team) => {
    acc[team] = (acc[team] || 0) + 1;
    return acc;
  }, {});
  const max = Math.max(...Object.values(counts));
  return (picks.length - max) / picks.length;
};

interface Props {
  agents: Partial<AgentOutputs>;
  className?: string;
}

const DisagreementBadge: React.FC<Props> = ({ agents, className }) => {
  const disagreement = computeDisagreement(agents);
  if (disagreement <= 0) return null;
  const percent = Math.round(disagreement * 100);

  const content = (
    <div>
      <div className="font-semibold mb-1">{percent}% disagree</div>
      <ul className="text-xs space-y-0.5">
        {Object.entries(agents).map(([name, res]) => (
          <li key={name}>{`${formatAgentName(name)}: ${res?.team ?? '—'}`}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <Tooltip content={content} className={className}>
      <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
        {percent}% disagree
      </span>
    </Tooltip>
  );
};

export default DisagreementBadge;
