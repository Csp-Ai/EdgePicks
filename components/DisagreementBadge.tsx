import React from 'react';

interface Props {
  animated?: boolean;
}

const DisagreementBadge: React.FC<Props> = ({ animated = true }) => {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-800 font-medium ${
        animated ? 'animate-pulse' : ''
      }`}
    >
      Split Verdict
    </span>
  );
};

export default DisagreementBadge;
