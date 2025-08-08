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
  if (diffMs <= 0) return 'started';
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `in ${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `in ${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay <= 7) return `in ${diffDay}d`;
  const d = new Date(time);
  const date = d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
  const t = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return `${date}, ${t}`;
}

const GameCard: React.FC<Props> = ({ game, onClick, onHover }) => {
  const kickoff = formatRelative(game.time);
  const hoverRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    hoverRef.current = setTimeout(() => onHover?.(), 200);
  };

  const handleLeave = () => {
    if (hoverRef.current) {
      clearTimeout(hoverRef.current);
      hoverRef.current = null;
    }
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
      className="w-full text-left p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 ring-1 ring-transparent hover:ring-slate-700 shadow-sm hover:shadow transition-all"
      aria-label={`Analyze ${game.homeTeam} vs ${game.awayTeam} kickoff ${kickoffLabel}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {game.homeLogo && (
            <Image src={game.homeLogo} alt="" width={24} height={24} />
          )}
          <span>{game.homeTeam}</span>
        </div>
        <span className="text-slate-400">vs</span>
        <div className="flex items-center gap-2">
          {game.awayLogo && (
            <Image src={game.awayLogo} alt="" width={24} height={24} />
          )}
          <span>{game.awayTeam}</span>
        </div>
      </div>
      <div className="text-xs text-slate-400">{kickoff}</div>
      {game.odds ? (
        <div className="flex flex-wrap gap-2 mt-2 text-xs">
          {game.odds.spread !== undefined && (
            <span className="px-2 py-0.5 rounded-full bg-slate-700" title="Spread">
              {game.homeTeam.slice(0, 3).toUpperCase()} {game.odds.spread}
            </span>
          )}
          {game.odds.overUnder !== undefined && (
            <span className="px-2 py-0.5 rounded-full bg-slate-700" title="Over/Under">
              O/U {game.odds.overUnder}
            </span>
          )}
          {game.odds.moneyline && (
            <span className="px-2 py-0.5 rounded-full bg-slate-700" title="Moneyline">
              ML {game.odds.moneyline.home ?? ''}
              {game.odds.moneyline.home && game.odds.moneyline.away ? ' / ' : ''}
              {game.odds.moneyline.away ?? ''}
            </span>
          )}
        </div>
      ) : (
        <div className="text-xs text-slate-500 mt-2">No odds yet</div>
      )}
    </button>
  );
};

export default GameCard;

