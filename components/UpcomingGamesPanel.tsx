import React, { useEffect, useState } from 'react';
import TeamBadge from './TeamBadge';
import ConfidenceMeter, { ConfidenceMeterProps } from './ConfidenceMeter';
import { AgentExecution } from '../lib/flow/runFlow';
import AgentRationalePanel from './AgentRationalePanel';

interface UpcomingGame {
  homeTeam: ConfidenceMeterProps['teamA'];
  awayTeam: ConfidenceMeterProps['teamB'];
  confidence: number;
  history?: number[];
  league: string;
  time: string;
  edgePick: AgentExecution[];
  odds?: {
    spread?: number;
    overUnder?: number;
    moneyline?: { home?: number; away?: number };
    bookmaker?: string;
    lastUpdate?: string;
  };
  source?: string;
  winner: string;
  edgeDelta: number;
  confidenceDrop: number;
  publicLean?: number;
  agentDelta?: number;
  disagreements: string[];
}

const leagueIcons: Record<string, string> = {
  NFL: '🏈',
  NBA: '🏀',
  MLB: '⚾',
  NHL: '🏒',
  MLS: '⚽',
};

interface UpcomingGamesPanelProps {
  /** Maximum number of matchups to display. If set, the "Show More" button is hidden. */
  maxVisible?: number;
  hideValues?: boolean;
  /** Optional wrapper for each game card, allowing custom reveal logic */
  cardWrapper?: (args: {
    game: UpcomingGame;
    index: number;
    children: React.ReactNode;
  }) => React.ReactElement;
}

const UpcomingGamesPanel: React.FC<UpcomingGamesPanelProps> = ({
  maxVisible,
  hideValues = false,
  cardWrapper,
}) => {
  const [games, setGames] = useState<UpcomingGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(maxVisible ?? 3);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/upcoming-games');
        if (!res.ok) throw new Error('Failed to fetch');
        const data: UpcomingGame[] = await res.json();
        if (!cancelled) {
          setGames(data);
          setLoading(false);
          if (res.headers.get('x-missing-api-key')) {
            const msg =
              'Sports API key missing. Add it to `.env.local` to enable live games.';
            console.warn(msg);
            setWarning(msg);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load upcoming games');
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-center">Loading upcoming games...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  if (!games.length) {
    return (
      <>
        {warning && (
          <p className="text-center text-yellow-600 mb-2">{warning}</p>
        )}
        <p className="text-center">No upcoming games found.</p>
      </>
    );
  }

  return (
    <>
      {warning && (
        <p className="text-center text-yellow-600 mb-2">{warning}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {games.slice(0, visibleCount).map((game, idx) => {
        const guardian = game.edgePick.find((a) => a.name === 'guardianAgent');
        const card = (
          <div className="bg-white rounded shadow p-4 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="flex items-center gap-2">
                  <TeamBadge team={game.homeTeam.name} logoUrl={game.homeTeam.logo} />
                  {game.homeTeam.name}
                </span>
                <span className="text-gray-400">vs</span>
                <span className="flex items-center gap-2">
                  <TeamBadge team={game.awayTeam.name} logoUrl={game.awayTeam.logo} />
                  {game.awayTeam.name}
                </span>
              </h3>
              <div className="text-sm text-gray-500 flex flex-col items-end">
                <time>{game.time}</time>
                <span className="flex items-center gap-1">
                  <span aria-hidden>{leagueIcons[game.league] || '🏟️'}</span>
                  {game.league}
                </span>
                {game.source && <span className="text-xs">{game.source}</span>}
              </div>
            </div>
            <ConfidenceMeter
              teamA={game.homeTeam}
              teamB={game.awayTeam}
              confidence={game.confidence}
              history={game.history}
              spread={game.odds?.spread}
              publicLean={game.publicLean}
              agentDelta={game.agentDelta}
              hideValues={hideValues}
            />
            <div className="text-xs text-gray-500">
              Edge Δ: {Math.round(game.edgeDelta * 100)}% | Confidence Drop{' '}
              {Math.round(game.confidenceDrop * 100)}%
            </div>
            <AgentRationalePanel executions={game.edgePick} winner={game.winner} />
            {guardian?.result?.warnings && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                <h4 className="text-sm font-semibold text-yellow-800 mb-1">
                  Warnings
                </h4>
                <ul className="list-disc pl-4 text-xs text-yellow-800">
                  {guardian.result.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
        const element = cardWrapper
          ? cardWrapper({ game, index: idx, children: card })
          : card;
        return React.cloneElement(element as React.ReactElement, { key: idx });
      })}
      {!maxVisible && visibleCount < games.length && (
        <div className="sm:col-span-2 text-center">
          <button
            onClick={() => setVisibleCount((c) => c + 3)}
            className="px-4 py-2 bg-blue-600 text-white rounded mt-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Show More Matchups
          </button>
        </div>
      )}
    </div>
    </>
  );
};

export default UpcomingGamesPanel;

