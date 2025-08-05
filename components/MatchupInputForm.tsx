import React, { useState } from 'react';

export type Props = {
  onResult: (data: any) => void;
};

const MatchupInputForm: React.FC<Props> = ({ onResult }) => {
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [week, setWeek] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamA || !teamB || !week) {
      setError('All fields are required');
      return;
    }
    const weekNum = parseInt(week, 10);
    if (isNaN(weekNum)) {
      setError('Week must be a number');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/run-agents?teamA=${encodeURIComponent(teamA)}&teamB=${encodeURIComponent(teamB)}&week=${weekNum}`
      );
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      onResult(data);
    } catch (e) {
      setError('Failed to fetch result');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-end gap-4"
    >
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="teamA">
          Team A
        </label>
        <input
          id="teamA"
          type="text"
          className="w-full border rounded px-3 py-2"
          value={teamA}
          onChange={(e) => setTeamA(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="teamB">
          Team B
        </label>
        <input
          id="teamB"
          type="text"
          className="w-full border rounded px-3 py-2"
          value={teamB}
          onChange={(e) => setTeamB(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="w-full sm:w-24">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="week">
          Week
        </label>
        <input
          id="week"
          type="number"
          className="w-full border rounded px-3 py-2"
          value={week}
          onChange={(e) => setWeek(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="sm:self-end">
        <button
          type="submit"
          className="min-h-[44px] px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Run'}
        </button>
      </div>
      {error && (
        <p className="text-red-600 text-sm sm:ml-4 sm:self-center">{error}</p>
      )}
    </form>
  );
};

export default MatchupInputForm;

