import React from 'react';

interface Props {
  /** model confidence (0-1 or percentage 0-100) */
  confidence: number;
  /** model edge over market (0-1 or percentage 0-100) */
  edge: number;
  className?: string;
}

const normalize = (value: number) => (value > 1 ? value : value * 100);

const ConfidenceExplainer: React.FC<Props> = ({ confidence, edge, className = '' }) => {
  const conf = normalize(confidence);
  const edg = normalize(edge);

  let confText = '';
  if (conf >= 75) confText = 'highly confident';
  else if (conf >= 50) confText = 'somewhat confident';
  else confText = 'uncertain';

  let edgeText = '';
  if (edg >= 10) edgeText = `a solid ${Math.round(edg)}% edge`;
  else if (edg >= 5) edgeText = `a slight ${Math.round(edg)}% edge`;
  else edgeText = `only a ${Math.round(edg)}% edge`;

  return (
    <p className={`text-sm text-gray-700 ${className}`}>
      The model is {confText} ({Math.round(conf)}%) and projects {edgeText}. Always consider external factors and bet responsibly.
    </p>
  );
};

export default ConfidenceExplainer;

