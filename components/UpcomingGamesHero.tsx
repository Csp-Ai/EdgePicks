"use client";

import React from 'react';
import useSWR from 'swr';
=======
import Image from 'next/image';
=======
// @ts-expect-error -- swr's types may not expose the named export yet
import { useSWR } from 'swr';
import { apiGet } from '@/lib/api';
import { logEvent } from '@/lib/telemetry/logger';

interface Game {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  kickoff: string;
  moneyline: { home: number; away: number } | null;
}

const UpcomingGamesHero: React.FC = () => {
  const { data, error } = useSWR<Game[]>('/api/upcoming-games', apiGet);

  if (error) {
    return <div className="p-4 text-red-500">Failed to load upcoming games.</div>;
  }

  if (!data) {
    return <div className="p-4 text-gray-500">Loading upcoming games...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {data.slice(0, 8).map((game: Game) => (
        <div
          key={game.gameId}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center space-y-2 hover:shadow-lg transition-shadow cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() =>
            void logEvent({
              level: 'info',
              name: 'open-prediction-drawer',
              meta: { gameId: game.gameId },
            })
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              void logEvent({
                level: 'info',
                name: 'open-prediction-drawer',
                meta: { gameId: game.gameId },
              });
            }
          }}
        >
          <div className="flex items-center space-x-4">
            <Image
              src={game.homeLogo}
              alt={game.homeTeam}
              className="h-12 w-12"
              width={48}
              height={48}
            />
            <span className="text-gray-500 dark:text-gray-400">vs</span>
            <Image
              src={game.awayLogo}
              alt={game.awayTeam}
              className="h-12 w-12"
              width={48}
              height={48}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Kickoff: {new Date(game.kickoff).toLocaleString()}
          </p>
          {game.moneyline ? (
            <p className="text-sm text-green-600 dark:text-green-400">
              Moneyline: Home {game.moneyline.home}, Away {game.moneyline.away}
            </p>
          ) : (
            <p className="text-sm text-gray-500">No odds available</p>
          )}
          <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Predict
          </button>
        </div>
      ))}
    </div>
  );
};

export default UpcomingGamesHero;
