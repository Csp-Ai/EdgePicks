import React, { useEffect, useState } from 'react';
import type { Session } from 'next-auth';
import LiveGamesList from './LiveGamesList';
import { getUpcomingGames, runPredictions } from '../lib/api';

interface Props {
  session: Session;
}

const leagues = ['NFL', 'NBA', 'MLB', 'NHL'];

const PredictionsPanel: React.FC<Props> = ({ session }) => {
  const [league, setLeague] = useState('NFL');
  const [games, setGames] = useState<any[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loadingPred, setLoadingPred] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setLoadingGames(true);
    getUpcomingGames(league)
      .then((data) => {
        setGames(data);
        setLoadingGames(false);
        setPredictions([]);
      })
      .catch(() => {
        setGames([]);
        setLoadingGames(false);
      });
  }, [league]);

  const handleRun = async () => {
    setLoadingPred(true);
    try {
      const res = await runPredictions(league, games);
      setPredictions(res.predictions || []);
      setToast('Predictions complete');
    } catch (err) {
      console.error(err);
      setToast('Prediction flow failed');
    } finally {
      setLoadingPred(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Welcome, {session.user?.name || 'Anonymous'}</h1>
      <div className="flex items-center gap-2">
        <label htmlFor="league">League:</label>
        <select
          id="league"
          value={league}
          onChange={(e) => setLeague(e.target.value)}
          className="border p-1 rounded"
        >
          {leagues.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        {session ? (
          <button
            onClick={handleRun}
            className="ml-auto px-3 py-1 bg-blue-600 text-white rounded"
            disabled={loadingPred || loadingGames}
          >
            Run Predictions
          </button>
        ) : (
          <span className="ml-auto text-sm text-gray-600">Sign in to run personalized predictions</span>
        )}
      </div>
      <LiveGamesList
        league={league}
        games={games}
        predictions={predictions}
        loadingGames={loadingGames}
        loadingPredictions={loadingPred}
      />
      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </div>
  );
};

export default PredictionsPanel;
