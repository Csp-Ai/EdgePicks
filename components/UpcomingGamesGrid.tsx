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
      <div className="p-4 text-center" data-testid="error-panel">
        <p className="mb-2">Failed to load games.</p>
        <button className="px-3 py-1 border rounded" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-gray-200 rounded animate-pulse"
            data-testid="game-skeleton"
          />
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500" data-testid="empty-state">
        No games found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map((game) => (
        <GameCard
          key={game.gameId}
          game={game}
          onClick={onSelect}
          onHover={preload}
        />
      ))}
    </div>
  );
};

export default UpcomingGamesGrid;
