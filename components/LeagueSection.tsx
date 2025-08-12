'use client';

import { useCallback } from 'react';
import { useUpcomingGames } from '@/hooks/useUpcomingGames';
import { useAgentRun } from '@/hooks/useAgentRun';
import AgentPredictionStream from '@/components/AgentPredictionStream';
import GameCard from '@/components/GameCard';
import type { Game } from '@/types/game';

interface LeagueSectionProps {
  league: string;
  showPredictions?: boolean;
}

export default function LeagueSection({ league, showPredictions }: LeagueSectionProps) {
  const { data: games, error, isLoading } = useUpcomingGames(league);
  const { runId, startRun, isRunning } = useAgentRun();

  const handleAnalyze = useCallback(async (gameId: string) => {
    const game = games?.find(g => g.id === gameId);
    if (!game) return;

    await startRun({
      homeTeam: game.homeTeam,
      awayTeam: game.awayTeam,
      league
    });
  }, [games, league, startRun]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
        Failed to load games: {error.message}
      </div>
    );
  }

  if (!games?.length) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        <h3 className="text-lg font-medium mb-2">No Upcoming Games</h3>
        <p className="text-sm">Check back later for {league} games</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map(game => (
          <GameCard
            key={game.id}
            game={game}
            onAnalyze={showPredictions ? () => handleAnalyze(game.id) : undefined}
            loading={isRunning}
          />
        ))}
      </div>

      {runId && showPredictions && (
        <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <AgentPredictionStream
            runId={runId}
            onComplete={(data) => {
              // Handle prediction completion
              console.log('Prediction complete:', data);
            }}
          />
        </div>
      )}
    </div>
  );
}
