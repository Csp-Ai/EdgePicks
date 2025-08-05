import React, { useEffect, useState } from 'react';
import AgentCard from './AgentCard';
import TeamBadge from './TeamBadge';
import { AgentExecution } from '../lib/flow/runFlow';

interface UpcomingGame {
  homeTeam: string;
  awayTeam: string;
  league?: string;
  time?: string;
  edgePick: {
    winner: string;
    confidence: number;
    topReasons: string[];
    agents: AgentExecution[];
  };
}

const UpcomingGamesPanel: React.FC = () => {
  const [games, setGames] = useState<UpcomingGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return <p className="text-center">No upcoming games found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {games.map((game, idx) => {
        const agentResults = game.edgePick.agents
          .filter((a) => a.result && a.name !== 'guardianAgent')
          .sort((a, b) => (b.result!.score - a.result!.score));
        const guardian = game.edgePick.agents.find(
          (a) => a.name === 'guardianAgent'
        );
        return (
          <div
            key={idx}
            className="bg-white rounded shadow p-4 flex flex-col gap-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="flex items-center gap-2">
                  <TeamBadge team={game.homeTeam} />
                  {game.homeTeam}
                </span>
                <span className="text-gray-400">vs</span>
                <span className="flex items-center gap-2">
                  <TeamBadge team={game.awayTeam} />
                  {game.awayTeam}
                </span>
              </h3>
              <time className="text-sm text-gray-500">
                {game.time ? new Date(game.time).toLocaleString() : 'TBD'}
              </time>
            </div>
            <div className="flex flex-col gap-2">
              {agentResults.map((exec) => (
                <AgentCard
                  key={exec.name}
                  name={exec.name as any}
                  result={exec.result!}
                  showTeam
                />
              ))}
            </div>
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
      })}
    </div>
  );
};

export default UpcomingGamesPanel;

