import React from 'react';
import Image from 'next/image';
import LoadingShimmer from './LoadingShimmer';
import EmptyState from './EmptyState';

interface Game {
  homeTeam: { name: string; logo?: string };
  awayTeam: { name: string; logo?: string };
  time: string;
}

interface Props {
  league: string;
  games: Game[];
  predictions: any[];
  loadingGames: boolean;
  loadingPredictions: boolean;
}

const LiveGamesList: React.FC<Props> = ({
  league,
  games,
  predictions,
  loadingGames,
  loadingPredictions,
}) => {
  if (loadingGames) {
    return <LoadingShimmer lines={3} lineClassName="h-16" />;
  }

  if (!games.length) {
    return <EmptyState message={`No games found for ${league}. Try again later.`} />;
  }

  return (
    <ul
      className={`space-y-4 ${predictions.length ? 'divide-y divide-gray-200' : ''}`}
      aria-live="polite"
    >
      {games.map((g, idx) => (
        <li key={idx} className="p-4 flex flex-col gap-2" aria-busy={loadingPredictions}>
          <div className="flex items-center gap-2">
            {g.homeTeam.logo && (
              <Image src={g.homeTeam.logo} alt={g.homeTeam.name} width={24} height={24} />
            )}
            <span className="font-semibold">{g.homeTeam.name}</span>
            <span className="text-gray-500">vs</span>
            {g.awayTeam.logo && (
              <Image src={g.awayTeam.logo} alt={g.awayTeam.name} width={24} height={24} />
            )}
            <span className="font-semibold">{g.awayTeam.name}</span>
            <span className="ml-auto text-sm text-gray-600">{g.time}</span>
          </div>
          {loadingPredictions ? (
            <LoadingShimmer lines={1} />
          ) : (
            predictions[idx] && (
              <div className="text-sm text-gray-600">
                Predicted winner: {predictions[idx].winner}
              </div>
            )
          )}
        </li>
      ))}
    </ul>
  );
};

export default LiveGamesList;
