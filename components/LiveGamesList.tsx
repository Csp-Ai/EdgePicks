import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getUpcomingGames } from '../lib/api';

interface Game {
  homeTeam: { name: string; logo?: string };
  awayTeam: { name: string; logo?: string };
  time: string;
  winner: string;
  confidence: number;
}

interface Props {
  league: string;
}

const LiveGamesList: React.FC<Props> = ({ league }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getUpcomingGames(league)
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load games');
        setLoading(false);
      });
  }, [league]);

  if (loading) {
    return (
      <ul className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
        ))}
      </ul>
    );
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!games.length) {
    return <p>No games found.</p>;
  }

  return (
    <ul className="space-y-4">
      {games.map((g, idx) => (
        <li key={idx} className="p-4 border rounded flex items-center gap-2">
          {g.homeTeam.logo && (
            <Image src={g.homeTeam.logo} alt={g.homeTeam.name} width={24} height={24} />
          )}
          <span className="font-semibold">{g.homeTeam.name}</span>
          <span className="text-gray-500">vs</span>
          {g.awayTeam.logo && (
            <Image src={g.awayTeam.logo} alt={g.awayTeam.name} width={24} height={24} />
          )}
          <span className="font-semibold">{g.awayTeam.name}</span>
          <span className="ml-auto text-sm text-gray-600">
            {g.winner} ({g.confidence}%)
          </span>
        </li>
      ))}
    </ul>
  );
};

export default LiveGamesList;
