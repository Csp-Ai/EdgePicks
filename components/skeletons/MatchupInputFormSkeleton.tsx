import React from 'react';
import { matchupCard } from '../../styles/cardStyles';

interface Props {
  className?: string;
}

const MatchupInputFormSkeleton: React.FC<Props> = ({ className = '' }) => (
  <div
    className={`${matchupCard} grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-pulse ${className}`}
    aria-busy="true"
    data-testid="matchup-form-skeleton"
  >
    {[1, 2, 3].map((key) => (
      <div key={key} className="flex flex-col gap-1" data-testid="field-skeleton">
        <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-700 rounded" />
        <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
      </div>
    ))}
    <div className="sm:self-end" data-testid="button-skeleton">
      <div className="h-11 w-24 bg-neutral-200 dark:bg-neutral-700 rounded" />
    </div>
  </div>
);

export default MatchupInputFormSkeleton;

