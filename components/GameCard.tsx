import React, { useRef } from 'react';
import Image from 'next/image';
import type { Game } from '@/lib/types';
import { formatKickoff } from '@/lib/utils/formatKickoff';

interface Props {
  game: Game;
  onClick: (game: Game) => void;
  onHover?: () => void;
}

const GameCard: React.FC<Props> = ({ game, onClick, onHover }) => {
  const kickoffRelative = game.kickoffDisplay ?? formatKickoff(game.time);
  const kickoffAbsolute = new Date(game.time).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
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

  return (
    <button
      onClick={() => onClick(game)}
      onMouseEnter={handleEnter}
      onFocus={handleEnter}
      onMouseLeave={handleLeave}
      onBlur={handleLeave}
      className={`card group w-full text-left bg-slate-800 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ring-1 ring-slate-700 transition-colors`}
      aria-label={`Analyze ${game.homeTeam} vs ${game.awayTeam} kickoff ${kickoffAbsolute}`}
    >
      <div className="flex items-center justify-between mb-3 text-slate-100">
        <div className="flex items-center gap-2">
          {game.homeLogo && (
            <Image
              src={game.homeLogo}
              alt={`${game.homeTeam} logo`}
              width={24}
              height={24}
            />
          )}
          <span>{game.homeTeam}</span>
        </div>
        <span className="text-slate-300">vs</span>
        <div className="flex items-center gap-2">
          {game.awayLogo && (
            <Image
              src={game.awayLogo}
              alt={`${game.awayTeam} logo`}
              width={24}
              height={24}
            />
          )}
          <span>{game.awayTeam}</span>
        </div>
      </div>
      <div className="text-xs text-slate-300">{kickoffRelative} • {kickoffAbsolute}</div>
      {game.odds ? (
        <div className="flex flex-wrap gap-1 mt-2 text-[11px]">
          {game.odds.spread !== undefined && (
            <span className="px-2 py-0.5 rounded-full border border-emerald-700/40 bg-emerald-900/20 text-emerald-100" title="Spread">
              Spread {game.odds.spread}
            </span>
          )}
          {game.odds.overUnder !== undefined && (
            <span className="px-2 py-0.5 rounded-full border border-emerald-700/40 bg-emerald-900/20 text-emerald-100" title="Over/Under">
              O/U {game.odds.overUnder}
            </span>
          )}
          {game.odds.moneyline && (
            <span className="px-2 py-0.5 rounded-full border border-emerald-700/40 bg-emerald-900/20 text-emerald-100" title="Moneyline">
              ML {game.odds.moneyline.home ?? ''}
              {game.odds.moneyline.home && game.odds.moneyline.away ? ' / ' : ''}
              {game.odds.moneyline.away ?? ''}
            </span>
          )}
        </div>
      ) : (
        <div className="text-xs text-slate-400 mt-2">No odds yet</div>
      )}
      {game.odds?.bookmaker && (
        <div className="mt-1 text-[10px] text-slate-400">via {game.odds.bookmaker}</div>
      )}
    </button>
  );
};

export default GameCard;

