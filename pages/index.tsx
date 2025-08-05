import React, { useEffect, useState } from 'react';
import MatchupCard from '../components/MatchupCard';

type Matchup = {
  teamA: string;
  teamB: string;
  week: number;
};

const matchups: Matchup[] = [
  { teamA: '49ers', teamB: 'Cowboys', week: 1 },
  { teamA: 'Jets', teamB: 'Patriots', week: 1 },
  { teamA: 'Chiefs', teamB: 'Bills', week: 1 },
];

type PickResult = {
  winner: string;
  confidence: number;
  topReasons: string[];
};

const MatchupFetcher: React.FC<Matchup> = ({ teamA, teamB, week }) => {
  const [result, setResult] = useState<PickResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPick = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/run-agents?teamA=${encodeURIComponent(teamA)}&teamB=${encodeURIComponent(teamB)}&week=${week}`
      );
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      const pick = data.pick ?? data;
      if (!pick || !pick.winner) {
        setError('Insufficient data');
      } else {
        setResult(pick as PickResult);
      }
    } catch (e) {
      setError('Error loading pick');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamA, teamB, week]);

  if (loading) {
    return (
      <div className="border rounded p-4 shadow-sm w-full md:w-1/2 flex justify-center">
        <div className="w-6 h-6 border-4 border-gray-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="border rounded p-4 shadow-sm w-full md:w-1/2 text-center text-red-600">
        {error || 'Insufficient data'}
        <button
          className="block mt-2 text-blue-500 text-sm mx-auto"
          onClick={fetchPick}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <MatchupCard
      teamA={teamA}
      teamB={teamB}
      result={result}
      onRerun={fetchPick}
      loading={loading}
    />
  );
};

const HomePage: React.FC = () => (
  <main className="p-4 flex flex-col gap-4 items-center">
    {matchups.map((m, idx) => (
      <MatchupFetcher key={idx} {...m} />
    ))}
  </main>
);

export default HomePage;

