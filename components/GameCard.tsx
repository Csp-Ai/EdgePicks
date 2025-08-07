import React, { useRef } from 'react';
import Image from 'next/image';
import type { Game } from '../lib/types';

interface Props {
  game: Game;
  onClick: (game: Game) => void;
  onHover?: () => void;
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

const GameCard: React.FC<Props> = ({ game, onClick, onHover }) => {
  const kickoff = formatRelative(game.time);
  const hoverRef = useRef<NodeJS.Timeout>();

  const handleEnter = () => {
    hoverRef.current = setTimeout(() => onHover?.(), 200);
  };

  const handleLeave = () => {
    if (hoverRef.current) clearTimeout(hoverRef.current);
  };

  const kickoffLabel = new Date(game.time).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <button
      onClick={() => onClick(game)}
      onMouseEnter={handleEnter}
      onFocus={handleEnter}
      onMouseLeave={handleLeave}
      onBlur={handleLeave}
      className="text-left w-full p-4 bg-white rounded shadow transition-transform hover:-translate-y-1 hover:shadow-lg focus:outline focus:outline-2 focus:outline-blue-500"
      aria-label={`Analyze ${game.homeTeam} vs ${game.awayTeam} kickoff ${kickoffLabel}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {game.homeLogo && (
            <Image src={game.homeLogo} alt="" width={24} height={24} />
          )}
          <span>{game.homeTeam}</span>
        </div>
        <span className="text-gray-500">vs</span>
        <div className="flex items-center gap-2">
          {game.awayLogo && (
            <Image src={game.awayLogo} alt="" width={24} height={24} />
          )}
          <span>{game.awayTeam}</span>
        </div>
      </div>
      <div className="text-sm text-gray-600">{kickoff}</div>
      {game.odds ? (
        <div className="text-xs text-gray-600 mt-1 flex gap-2">
          {game.odds.spread !== undefined && (
            <span className="px-1 bg-gray-100 rounded" title="Spread">
              {game.homeTeam.slice(0, 3).toUpperCase()} {game.odds.spread}
            </span>
          )}
          {game.odds.overUnder !== undefined && (
            <span className="px-1 bg-gray-100 rounded" title="Over/Under">
              O/U {game.odds.overUnder}
            </span>
          )}
          {game.odds.moneyline && (
            <span className="px-1 bg-gray-100 rounded" title="Moneyline">
              ML {game.odds.moneyline.home ?? ''}
              {game.odds.moneyline.home && game.odds.moneyline.away ? ' / ' : ''}
              {game.odds.moneyline.away ?? ''}
            </span>
          )}
        </div>
      ) : (
        <div className="text-xs text-gray-400 mt-1">No odds yet</div>
      )}
    </button>
  );
};

export default GameCard;
