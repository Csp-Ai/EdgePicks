import React from 'react';
import { AgentOutputs } from '../../lib/types';

export const computeVariance = (agents: Partial<AgentOutputs>): number => {
  const scores = Object.values(agents)
    .map((r) => r?.score)
    .filter((s): s is number => typeof s === 'number');
  if (scores.length === 0) return 0;
  const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  return scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
};

interface Props {
  agents: Partial<AgentOutputs>;
}

const AgentTrustScore: React.FC<Props> = ({ agents }) => {
  const variance = computeVariance(agents);
  const agreement = Math.max(0, 1 - variance);
  return (
    <div className="text-sm" aria-label="agent-trust-score">
      <div>Agreement {Math.round(agreement * 100)}%</div>
      <div className="text-xs text-gray-500">Variance {variance.toFixed(3)}</div>
    </div>
  );
};

export default AgentTrustScore;
