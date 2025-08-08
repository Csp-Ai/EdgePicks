import React from 'react';

interface Props {
  /** Timestamp of when the data was last updated */
  lastUpdated: Date | string | number;
  /** Minutes after which to show stale warning */
  warnAfterMinutes?: number;
  className?: string;
}

/**
 * Displays how long ago data was updated and warns when stale.
 */
const DataFreshness: React.FC<Props> = ({
  lastUpdated,
  warnAfterMinutes = 15,
  className = '',
}) => {
  const updated =
    typeof lastUpdated === 'number' || typeof lastUpdated === 'string'
      ? new Date(lastUpdated)
      : lastUpdated;
  const minutesAgo = Math.floor((Date.now() - updated.getTime()) / 60000);
  const stale = minutesAgo >= warnAfterMinutes;

  return (
    <p
      role="status"
      aria-live="polite"
      className={`text-sm ${stale ? 'text-amber-600' : 'text-gray-500'} ${className}`}
    >
      {stale && '⚠️ '}
      Last updated {minutesAgo} min ago
    </p>
  );
};

export default DataFreshness;

