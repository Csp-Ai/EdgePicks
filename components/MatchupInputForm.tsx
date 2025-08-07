import React, { useEffect, useState } from 'react';
import {
  AgentOutputs,
  AgentResult,
  Matchup,
  PickSummary,
  AgentLifecycle,
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
  onLifecycle: (event: { name: string } & AgentLifecycle) => void;
  defaultTeamA?: string;
  defaultTeamB?: string;
  defaultMatchDay?: number;
  autostart?: boolean;
};

const MatchupInputForm: React.FC<Props> = ({
  onStart,
  onAgent,
  onComplete,
  onLifecycle,
  defaultTeamA,
  defaultTeamB,
  defaultMatchDay,
  autostart,
}) => {
  const [teamA, setTeamA] = useState(defaultTeamA || '');
  const [teamB, setTeamB] = useState(defaultTeamB || '');
  const [matchDay, setMatchDay] = useState(
    defaultMatchDay !== undefined ? String(defaultMatchDay) : ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runPrediction = (teamAVal: string, teamBVal: string, md: number) => {
    setError(null);
    setLoading(true);
    onStart({ teamA: teamAVal, teamB: teamBVal, matchDay: md });

    try {
      const es = new EventSource(
        `/api/run-agents?teamA=${encodeURIComponent(teamAVal)}&teamB=${encodeURIComponent(
          teamBVal
        )}&matchDay=${md}`
      );

      es.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'agent') {
          if (!data.error) {
            onAgent(data.name, data.result as AgentResult);
          }
        } else if (data.type === 'lifecycle') {
          onLifecycle(data as { name: string } & AgentLifecycle);
        } else if (data.type === 'summary') {
          onComplete(data as SummaryPayload);
          setLoading(false);
          es.close();
        } else if (data.type === 'error') {
          setError('Failed to fetch result');
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
    runPrediction(teamA, teamB, matchDayNum);
  };

  useEffect(() => {
    if (autostart && defaultTeamA && defaultTeamB) {
      const md = defaultMatchDay ?? 1;
      runPrediction(defaultTeamA, defaultTeamB, md);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autostart, defaultTeamA, defaultTeamB, defaultMatchDay]);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-4 sm:p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <div className="flex flex-col">
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
      <div className="flex flex-col">
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
      <div className="flex flex-col">
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
          className="min-h-[44px] px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 transition-transform hover:scale-105"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Run'}
        </button>
      </div>
      {error && (
        <p className="text-red-600 text-sm sm:col-span-2 lg:col-span-4">{error}</p>
      )}
    </form>
  );
};

export default MatchupInputForm;

