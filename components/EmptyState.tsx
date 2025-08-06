import React from 'react';

interface Props {
  message: string;
  className?: string;
}

const EmptyState: React.FC<Props> = ({ message, className = '' }) => (
  <p
    role="status"
    aria-live="polite"
    className={`text-center text-gray-600 ${className}`}
  >
    {message}
  </p>
);

export default EmptyState;
