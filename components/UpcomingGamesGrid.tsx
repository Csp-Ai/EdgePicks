import React from 'react';
import type { Game } from '../lib/types';
import GameCard from './GameCard';

interface Props {
  games: Game[];
  search?: string;
  onSelect: (game: Game) => void;
}

const UpcomingGamesGrid: React.FC<Props> = ({ games, search = '', onSelect }) => {
  const filtered = games.filter((g) => {
    const q = search.toLowerCase();
    return (
      g.homeTeam.toLowerCase().includes(q) ||
      g.awayTeam.toLowerCase().includes(q)
    );
  });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map((game) => (
        <GameCard key={game.gameId} game={game} onClick={onSelect} />
      ))}
    </div>
  );
};

export default UpcomingGamesGrid;
