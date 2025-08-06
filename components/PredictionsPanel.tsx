import React, { useState } from 'react';
import type { Session } from 'next-auth';
import LiveGamesList from './LiveGamesList';
import { runPredictionFlow } from '../lib/api';

interface Props {
  session: Session;
}

const leagues = ['NFL', 'NBA', 'MLB', 'NHL'];

const PredictionsPanel: React.FC<Props> = ({ session }) => {
  const [league, setLeague] = useState('NFL');
  const [result, setResult] = useState<string>('');

  const handleRun = async () => {
    try {
      const res = await runPredictionFlow();
      setResult(JSON.stringify(res));
    } catch (err) {
      setResult('Prediction flow failed');
      console.error(err);
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
        <button
          onClick={handleRun}
          className="ml-auto px-3 py-1 bg-blue-600 text-white rounded"
        >
          Run Predictions
        </button>
      </div>
      <LiveGamesList league={league} />
      {result && (
        <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">{result}</pre>
      )}
    </div>
  );
};

export default PredictionsPanel;
