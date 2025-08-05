import React, { useState } from 'react';
import {
  AgentOutputs,
  AgentResult,
  Matchup,
  PickSummary,
} from '../lib/types';

interface SummaryPayload {
  matchup: Matchup;
  agents: AgentOutputs;
  pick: PickSummary;
  loggedAt?: string;
}

export type Props = {
  onStart: (info: { teamA: string; teamB: string; matchDay: number }) => void;
  onAgent: (name: string, result: AgentResult) => void;
  onComplete: (data: SummaryPayload) => void;
};

const MatchupInputForm: React.FC<Props> = ({ onStart, onAgent, onComplete }) => {
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [matchDay, setMatchDay] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamA || !teamB || !matchDay) {
      setError('All fields are required');
      return;
    }
    const matchDayNum = parseInt(matchDay, 10);
    if (isNaN(matchDayNum)) {
      setError('Match day must be a number');
      return;
    }

    setError(null);
    setLoading(true);
    onStart({ teamA, teamB, matchDay: matchDayNum });

    try {
      const es = new EventSource(
        `/api/run-agents?teamA=${encodeURIComponent(teamA)}&teamB=${encodeURIComponent(
          teamB
        )}&matchDay=${matchDayNum}`
      );

      es.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'agent') {
          onAgent(data.name, data.result as AgentResult);
        } else if (data.type === 'summary') {
          onComplete(data as SummaryPayload);
          setLoading(false);
          es.close();
        }
      };

      es.onerror = () => {
        setError('Failed to fetch result');
        setLoading(false);
        es.close();
      };
    } catch (e) {
      setError('Failed to fetch result');
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-4 sm:p-6 flex flex-col sm:flex-row sm:items-end gap-4"
    >
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="teamA">
          Team/Player A
        </label>
        <input
          id="teamA"
          type="text"
          className="w-full border rounded px-3 py-2"
          value={teamA}
          onChange={(e) => setTeamA(e.target.value)}
          disabled={loading}
          placeholder="e.g., BOS or Federer"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="teamB">
          Team/Player B
        </label>
        <input
          id="teamB"
          type="text"
          className="w-full border rounded px-3 py-2"
          value={teamB}
          onChange={(e) => setTeamB(e.target.value)}
          disabled={loading}
          placeholder="e.g., LAL or Nadal"
        />
      </div>
      <div className="w-full sm:w-24">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="matchDay">
          Match Day
        </label>
        <input
          id="matchDay"
          type="number"
          className="w-full border rounded px-3 py-2"
          value={matchDay}
          onChange={(e) => setMatchDay(e.target.value)}
          disabled={loading}
          placeholder="e.g., 1"
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

