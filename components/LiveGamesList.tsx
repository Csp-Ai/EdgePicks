import React from 'react';
import Image from 'next/image';

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
    return (
      <ul className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
        ))}
      </ul>
    );
  }

  if (!games.length) {
    return <p>No games found for {league}. Try again later.</p>;
  }

  return (
    <ul className="space-y-4">
      {games.map((g, idx) => (
        <li key={idx} className="p-4 border rounded flex flex-col gap-2">
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
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
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
