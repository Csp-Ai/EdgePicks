import React from 'react';
import type { Game } from '../lib/types';

interface Props {
  game: Game;
  onClick: (game: Game) => void;
}

function formatRelative(time: string): string {
  const target = new Date(time).getTime();
  const diffMs = target - Date.now();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin <= 0) return 'started';
  if (diffMin < 60) return `in ${diffMin}m`;
  const hours = Math.floor(diffMin / 60);
  return `in ${hours}h`;
}

const GameCard: React.FC<Props> = ({ game, onClick }) => {
  const kickoff = formatRelative(game.time);
  return (
    <div
      onClick={() => onClick(game)}
      className="cursor-pointer p-4 bg-white rounded shadow hover:shadow-lg transition-transform hover:-translate-y-1"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {game.homeLogo && (
            <img src={game.homeLogo} alt="" className="w-6 h-6" />
          )}
          <span>{game.homeTeam}</span>
        </div>
        <span className="text-gray-500">vs</span>
        <div className="flex items-center gap-2">
          {game.awayLogo && (
            <img src={game.awayLogo} alt="" className="w-6 h-6" />
          )}
          <span>{game.awayTeam}</span>
        </div>
      </div>
      <div className="text-sm text-gray-600">{kickoff}</div>
      {game.odds && (
        <div className="text-xs text-gray-500 mt-1 flex gap-2">
          {game.odds.spread !== undefined && <span>Spr {game.odds.spread}</span>}
          {game.odds.overUnder !== undefined && <span>O/U {game.odds.overUnder}</span>}
        </div>
      )}
    </div>
  );
};

export default GameCard;
