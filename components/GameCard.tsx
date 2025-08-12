'use client';

import React, { useRef } from 'react';
import type { Game } from '@/types/game';
import { formatKickoff } from '@/lib/utils/formatKickoff';
import { safeLocalDate } from '@/lib/normalize';

interface Props {
  game: Game;
  onClick: (game: Game) => void;
  onHover?: () => void;
}

const GameCard: React.FC<Props> = ({ game, onClick, onHover }) => {
  const kickoffTime = game.kickoff ? safeLocalDate(game.kickoff) : 'TBD';
  const kickoffRelative = formatKickoff(game.kickoff || '');
  const kickoffAbsolute = game.kickoff
    ? new Date(game.kickoff).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'TBD';

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
          <span>{game.homeTeam}</span>
        </div>
        <span className="text-slate-300">vs</span>
        <div className="flex items-center gap-2">
          <span>{game.awayTeam}</span>
        </div>
      </div>
      <div className="text-xs text-slate-300">{kickoffRelative} • {kickoffAbsolute}</div>
      {game.odds ? (
        <div className="flex flex-wrap gap-1 mt-2 text-[11px]">
          {game.odds.homeSpread !== undefined && (
            <span className="px-2 py-0.5 rounded-full border border-emerald-700/40 bg-emerald-900/20 text-emerald-100" title="Home Spread">
              Home {game.odds.homeSpread > 0 ? '+' : ''}{game.odds.homeSpread}
            </span>
          )}
          {game.odds.awaySpread !== undefined && (
            <span className="px-2 py-0.5 rounded-full border border-emerald-700/40 bg-emerald-900/20 text-emerald-100" title="Away Spread">
              Away {game.odds.awaySpread > 0 ? '+' : ''}{game.odds.awaySpread}
            </span>
          )}
          {game.odds.total !== undefined && (
            <span className="px-2 py-0.5 rounded-full border border-emerald-700/40 bg-emerald-900/20 text-emerald-100" title="Total">
              O/U {game.odds.total}
            </span>
          )}
        </div>
      ) : (
        <div className="text-xs text-slate-400 mt-2">No odds yet</div>
      )}
    </button>
  );
};

export default GameCard;
