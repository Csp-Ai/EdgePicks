import React from 'react';

interface Props {
  /** confidence value in percent (0-100) */
  confidence: number;
  className?: string;
}

const DisagreementBadge: React.FC<Props> = ({ confidence, className = '' }) => {
  if (confidence > 80) {
    return (
      <span className={`mt-2 inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs ${className}`}>
        🟢 High Confidence
      </span>
    );
  }
  if (confidence < 55) {
    return (
      <span className={`mt-2 inline-block px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs ${className}`}>
        🟡 Toss-Up
      </span>
    );
  }
  return null;
};

export default DisagreementBadge;
