import React from 'react';

interface Props {
  lines?: number;
  lineClassName?: string;
  containerClassName?: string;
}

const LoadingShimmer: React.FC<Props> = ({
  lines = 3,
  lineClassName = 'h-4',
  containerClassName = 'space-y-2',
}) => (
  <div
    role="status"
    aria-live="polite"
    className={`animate-pulse ${containerClassName}`}
  >
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className={`bg-gray-200 rounded ${lineClassName}`} />
    ))}
    <span className="sr-only">Loading...</span>
  </div>
);

export default LoadingShimmer;
