import React, { useEffect, useState } from 'react';
import {
  AgentOutputs,
  Matchup,
  PickSummary,
  AgentLifecycle,
} from '../lib/types';
import { matchupCard } from '../styles/cardStyles';
import type { AgentExecution } from '../lib/flow/runFlow';

interface SummaryPayload {
  matchup: Matchup;
  agents: AgentOutputs;
  pick: PickSummary;
  loggedAt?: string;
}

export type Props = {
  onStart: (info: { homeTeam: string; awayTeam: string; week: number }) => void;
  onAgent: (exec: AgentExecution) => void;
  onComplete: (data: SummaryPayload) => void;
  onLifecycle: (event: { name: string } & AgentLifecycle) => void;
  defaultHomeTeam?: string;
  defaultAwayTeam?: string;
  defaultWeek?: number;
  autostart?: boolean;
};

const MatchupInputForm: React.FC<Props> = ({
  onStart,
  onAgent,
  onComplete,
  onLifecycle,
  defaultHomeTeam,
  defaultAwayTeam,
  defaultWeek,
  autostart,
}) => {
  const [homeTeam, setHomeTeam] = useState(defaultHomeTeam || '');
  const [awayTeam, setAwayTeam] = useState(defaultAwayTeam || '');
  const [week, setWeek] = useState(
    defaultWeek !== undefined ? String(defaultWeek) : ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState('');

  const runPrediction = (home: string, away: string, wk: number) => {
    setError(null);
    setLoading(true);
    onStart({ homeTeam: home, awayTeam: away, week: wk });

    try {
      const es = new EventSource(
        `/api/run-agents?homeTeam=${encodeURIComponent(home)}&awayTeam=${encodeURIComponent(
          away
        )}&week=${wk}&sessionId=${sessionId}`
      );

      es.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('SSE message', data);
        if (data.type === 'agent') {
          onAgent({
            name: data.name,
            result: data.result,
            error: data.error,
            scoreTotal: data.scoreTotal,
            confidenceEstimate: data.confidenceEstimate,
            agentDurationMs: data.agentDurationMs,
            sessionId: data.sessionId,
          });
        } else if (data.type === 'lifecycle') {
          onLifecycle(data as { name: string } & AgentLifecycle);
        } else if (data.type === 'summary') {
          onComplete(data as SummaryPayload);
          setLoading(false);
          es.close();
        } else if (data.type === 'error') {
          setError(data.message || 'Failed to fetch result');
          setLoading(false);
          es.close();
        }
      };

      es.onerror = (e) => {
        console.error('SSE connection error', e);
        setError('Failed to fetch result');
        setLoading(false);
        es.close();
      };
    } catch (e) {
      console.error('SSE setup error', e);
      setError('Failed to fetch result');
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeTeam || !awayTeam || !week) {
      const messages: string[] = [];
      if (!homeTeam) messages.push('Home team is required');
      if (!awayTeam) messages.push('Away team is required');
      if (!week) messages.push('Week is required');
      setError(messages.join('. '));
      return;
    }
    const weekNum = parseInt(week, 10);
    if (isNaN(weekNum)) {
      setError('Week must be a number');
      return;
    }
    runPrediction(homeTeam, awayTeam, weekNum);
  };

  useEffect(() => {
    let sid = localStorage.getItem('sessionId');
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem('sessionId', sid);
    }
    setSessionId(sid);

    if (autostart && defaultHomeTeam && defaultAwayTeam) {
      const wk = defaultWeek ?? 1;
      runPrediction(defaultHomeTeam, defaultAwayTeam, wk);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autostart, defaultHomeTeam, defaultAwayTeam, defaultWeek]);

  return (
    <form
      onSubmit={handleSubmit}
      className={`${matchupCard} grid gap-4 sm:grid-cols-2 lg:grid-cols-4`}
    >
      <div className="flex flex-col">
        <label
          className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300"
          htmlFor="homeTeam"
        >
          Home Team
        </label>
        <input
          id="homeTeam"
          type="text"
          className="w-full rounded border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 px-3 py-2"
          value={homeTeam}
          onChange={(e) => setHomeTeam(e.target.value)}
          disabled={loading}
          placeholder="e.g., BOS or Federer"
        />
      </div>
      <div className="flex flex-col">
        <label
          className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300"
          htmlFor="awayTeam"
        >
          Away Team
        </label>
        <input
          id="awayTeam"
          type="text"
          className="w-full rounded border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 px-3 py-2"
          value={awayTeam}
          onChange={(e) => setAwayTeam(e.target.value)}
          disabled={loading}
          placeholder="e.g., LAL or Nadal"
        />
      </div>
      <div className="flex flex-col">
        <label
          className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300"
          htmlFor="week"
        >
          Week
        </label>
        <input
          id="week"
          type="number"
          className="w-full rounded border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 px-3 py-2"
          value={week}
          onChange={(e) => setWeek(e.target.value)}
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

