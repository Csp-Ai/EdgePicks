import React from 'react';
import { useUpcomingGames } from '@/hooks/useUpcomingGames';

export default function UpcomingGamesHero() {
  const { data: games, isLoading, error } = useUpcomingGames();

  if (isLoading) {
    return <div>Loading games...</div>;
  }

  if (error) {
    return <div>Error loading games: {error.message}</div>;
  }

  return (
    <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Upcoming Games</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games?.map((game) => (
          <div key={game.id} className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span>{game.homeTeam}</span>
              </div>
              <span className="text-gray-500">vs</span>
              <div className="flex items-center gap-2">
                <span>{game.awayTeam}</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">Kickoff: {game.kickoff}</div>
            <div className="text-sm text-gray-500">Odds: {game.odds?.homeSpread} / {game.odds?.awaySpread}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
