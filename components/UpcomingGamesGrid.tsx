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
    return (
      <>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-xl bg-slate-800/40 animate-pulse"
            data-testid="game-skeleton"
          />
        ))}
      </>
    );
  }

  if (filtered.length === 0) {
    return (
      <div
        className="col-span-full text-center text-slate-400"
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

