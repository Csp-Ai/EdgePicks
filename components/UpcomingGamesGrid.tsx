import React from 'react';
import type { Game } from '../lib/types';
import GameCard from './GameCard';

interface Props {
  games: Game[];
  search?: string;
  onSelect: (game: Game) => void;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  preload?: () => void;
}

const UpcomingGamesGrid: React.FC<Props> = ({
  games,
  search = '',
  onSelect,
  isLoading,
  isError,
  onRetry,
  preload,
}) => {
  const filtered = games.filter((g) => {
    const q = search.toLowerCase();
    return (
      g.homeTeam.toLowerCase().includes(q) ||
      g.awayTeam.toLowerCase().includes(q)
    );
  });

  if (isError) {
    return (
      <div className="col-span-full text-center" data-testid="error-panel">
        <p className="mb-2">Failed to load games.</p>
        <button className="px-3 py-1 border rounded" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    const SkeletonCard = () => (
      <div
        className="p-4 sm:p-6 rounded-xl bg-slate-800/40 animate-pulse h-28 flex flex-col gap-3 shadow-md"
        data-testid="game-skeleton"
      >
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-700/40" />
            <div className="w-20 h-3 rounded bg-slate-700/40" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-700/40" />
            <div className="w-20 h-3 rounded bg-slate-700/40" />
          </div>
        </div>
        <div className="w-24 h-3 rounded bg-slate-700/40" />
        <div className="flex gap-2">
          <div className="w-12 h-4 rounded-full bg-slate-700/40" />
          <div className="w-12 h-4 rounded-full bg-slate-700/40" />
          <div className="w-12 h-4 rounded-full bg-slate-700/40" />
        </div>
      </div>
    );
    return (
      <>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </>
    );
  }

  if (filtered.length === 0) {
    return (
      <div
        className="col-span-full text-center text-slate-500"
        data-testid="empty-state"
      >
        No games match your search
      </div>
    );
  }

  return (
    <>
      {filtered.map((game) => (
        <GameCard
          key={game.gameId}
          game={game}
          onClick={onSelect}
          onHover={preload}
        />
      ))}
    </>
  );
};

export default UpcomingGamesGrid;

