import React, { useEffect, useState } from 'react';
import TeamBadge from './TeamBadge';
import AgentRationalePanel from './AgentRationalePanel';
import type { AgentExecution } from '@/lib/flow/runFlow';

interface BigGame {
  homeTeam: { name: string; logo?: string; score?: number };
  awayTeam: { name: string; logo?: string; score?: number };
  league: string;
  time: string;
  confidence: number;
  edgeDelta: number;
  winner: string;
  edgePick: AgentExecution[];
  score?: { home: number; away: number };
}

const leagueIcons: Record<string, string> = {
  NFL: '🏈',
  NBA: '🏀',
  MLB: '⚾',
  NHL: '🏒',
  MLS: '⚽',
};

const NextBigGame: React.FC = () => {
  const [game, setGame] = useState<BigGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRationale, setShowRationale] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/upcoming-games');
        if (res.ok) {
          const data: BigGame[] = await res.json();
          if (data.length) {
            // When multiple leagues are returned pick the matchup with the
            // highest confidence to feature as the "next big game".
            const top = data.slice().sort((a, b) => b.confidence - a.confidence)[0];
            setGame(top);
          }
        }
      } catch (err) {
        console.error('Failed to load next big game', err);
      } finally {
        setLoading(false);
        setTimeout(() => setVisible(true), 100);
      }
    };
    load();
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading next game...</p>;
  }

  if (!game) {
    return (
      <p className="text-sm text-gray-500">
        No live games found at this moment. Check back soon or enter a matchup manually.
      </p>
    );
  }

  const icon = leagueIcons[game.league] || '🏟️';

  return (
    <div
      className={`max-w-md mx-auto bg-white rounded-xl shadow p-6 transition-all duration-700 ease-in-out delay-200 transform ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>{icon}</span>
          <span className="text-sm font-medium">{game.league}</span>
        </div>
        <time className="text-sm text-gray-500">{game.time}</time>
      </div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <TeamBadge team={game.homeTeam.name} logoUrl={game.homeTeam.logo} />
          <span>{game.homeTeam.name}</span>
        </div>
        <span className="text-gray-400">vs</span>
        <div className="flex items-center gap-2">
          <TeamBadge team={game.awayTeam.name} logoUrl={game.awayTeam.logo} />
          <span>{game.awayTeam.name}</span>
        </div>
      </div>
      {game.score ? (
        <div className="text-center text-xl font-bold">
          {game.score.home} - {game.score.away}
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500">Upcoming</p>
      )}
      <div className="mt-4 text-sm text-left">
        Agent Edge: {game.confidence}% | Confidence Δ {Math.round(game.edgeDelta * 100)}%
      </div>
      <div className="mt-2 text-left">
        <button
          onClick={() => setShowRationale((s) => !s)}
          className="text-blue-600 text-sm underline focus:outline-none"
        >
          {showRationale ? 'Hide Rationale' : 'View Rationale'}
        </button>
        {showRationale && (
          <div className="mt-2">
            <AgentRationalePanel executions={game.edgePick} winner={game.winner} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NextBigGame;

