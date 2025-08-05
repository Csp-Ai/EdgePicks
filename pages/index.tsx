import React, { useCallback, useEffect, useState } from 'react';
import MatchupCard from '../components/MatchupCard';
import ExplanationGlossary from '../components/ExplanationGlossary';
import { AgentOutputs } from '../lib/types';

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

type PickSummary = {
  winner: string;
  confidence: number;
  topReasons: string[];
};

type PickResult = PickSummary & {
  agents: AgentOutputs;
};

const MatchupFetcher: React.FC<Matchup> = ({ teamA, teamB, week }) => {
  const [result, setResult] = useState<PickResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPick = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/run-agents?teamA=${encodeURIComponent(teamA)}&teamB=${encodeURIComponent(teamB)}&week=${week}`
      );
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      const pick: PickSummary = data.pick ?? data;
      const agents: AgentOutputs = data.agents ?? {};
      if (!pick || !pick.winner) {
        setError('Insufficient data');
      } else {
        setResult({ ...pick, agents });
      }
    } catch (e) {
      setError('Error loading pick');
    } finally {
      setLoading(false);
    }
  }, [teamA, teamB, week]);

  useEffect(() => {
    fetchPick();
  }, [fetchPick]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 flex justify-center">
        <div className="w-6 h-6 border-4 border-gray-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-red-600">
        {error || 'Insufficient data'}
        <button
          className="mt-2 min-h-[44px] px-3 py-1 text-sm text-blue-600 underline"
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

const HomePage: React.FC = () => {
  const [showGlossary, setShowGlossary] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-mono font-bold">EdgePicks – AI NFL Matchup Insights</h1>
        <p className="text-gray-600">Updated weekly. Powered by modular agents.</p>
        <button
          onClick={() => setShowGlossary(true)}
          className="mt-2 mx-auto flex items-center text-blue-600 hover:text-blue-800"
        >
          <span className="w-5 h-5 flex items-center justify-center border border-blue-600 rounded-full text-xs font-bold mr-2">
            ?
          </span>
          <span className="underline">What powers these picks?</span>
        </button>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {matchups.map((m, idx) => (
          <MatchupFetcher key={idx} {...m} />
        ))}
      </div>
      {showGlossary && (
        <ExplanationGlossary onClose={() => setShowGlossary(false)} />
      )}
    </main>
  );
};

export default HomePage;

