import React, { useEffect, useState } from 'react';
import type { Session } from 'next-auth';
import LiveGamesList from './LiveGamesList';
import EmptyState from './EmptyState';
import LiveGameLogsPanel from './LiveGameLogsPanel';
import AgentStatusPanel from './AgentStatusPanel';
import { getUpcomingGames, runPredictions } from '../lib/api';
import useFlowVisualizer from '../lib/dashboard/useFlowVisualizer';

interface Props {
  session: Session | null;
}

const leagues = ['NFL', 'NBA', 'MLB', 'NHL'];

const PredictionsPanel: React.FC<Props> = ({ session }) => {
  const [league, setLeague] = useState('NFL');
  const [games, setGames] = useState<any[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loadingPred, setLoadingPred] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [agentLogs, setAgentLogs] = useState<any[]>([]);
  const { statuses, handleLifecycleEvent, reset } = useFlowVisualizer();

  useEffect(() => {
    setLoadingGames(true);
    getUpcomingGames(league)
      .then((data) => {
        setGames(data);
        setLoadingGames(false);
        setPredictions([]);
        setAgentLogs([]);
      })
      .catch((err) => {
        console.error('Error fetching upcoming games', err);
        setGames([]);
        setLoadingGames(false);
        setToast({ message: 'Failed to load upcoming games.', type: 'error' });
        setTimeout(() => setToast(null), 3000);
      });
  }, [league]);

  const handleRun = async () => {
    if (!session) {
      setToast({ message: 'Please sign in to run predictions.', type: 'error' });
      return;
    }
    if (!games.length) {
      setToast({ message: `No games found for ${league}.`, type: 'error' });
      return;
    }

    setLoadingPred(true);
    reset();
    let es: EventSource | null = null;

    try {
      const g = games[0];
      es = new EventSource(
        `/api/run-agents?teamA=${encodeURIComponent(g.homeTeam.name)}&teamB=${encodeURIComponent(
          g.awayTeam.name
        )}&matchDay=1`
      );

      es.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'lifecycle') {
          handleLifecycleEvent(data);
        }
      };

      const res = await runPredictions(league, games);
      if (res.error) {
        throw new Error(res.error);
      }

      const fetched = res.predictions || [];
      setPredictions(fetched);
      setAgentLogs(fetched.flatMap((p: any) => p.executions || []));
      setLastRun(res.timestamp);
      setToast({
        message: `Predictions generated successfully for ${league}.`,
        type: 'success',
      });
    } catch (err) {
      console.error(err);
      setPredictions([]);
      setAgentLogs([]);
      setToast({
        message: 'Prediction flow failed. Please try again.',
        type: 'error',
      });
    } finally {
      setLoadingPred(false);
      es?.close();
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Welcome, {session?.user?.name || 'Anonymous'}</h1>
      <div className="flex flex-wrap items-center gap-4">
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
            className="px-3 py-1 bg-blue-600 text-white rounded"
            disabled={loadingPred || loadingGames}
          >
            Run Predictions
          </button>
        ) : (
          <span className="text-sm text-gray-600">Sign in to run personalized predictions</span>
        )}
      </div>

      {lastRun && (
        <p className="text-sm text-gray-600" aria-live="polite">
          {league} predictions generated at{' '}
          {new Date(lastRun).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        </p>
      )}

      <LiveGamesList
        league={league}
        games={games}
        predictions={predictions}
        loadingGames={loadingGames}
        loadingPredictions={loadingPred}
      />

      {!loadingPred && !predictions.length && (
        <EmptyState message="Pick a league and hit Run Predictions to get started!" />
      )}

      {agentLogs.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Agent Logs</h2>
          <LiveGameLogsPanel logs={agentLogs} />
        </section>
      )}

      {statuses && Object.keys(statuses).length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Agent Status</h2>
          <AgentStatusPanel statuses={statuses} />
        </section>
      )}

      {toast && (
        <div
          role="alert"
          className={`fixed bottom-4 right-4 px-3 py-2 rounded shadow text-white ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default PredictionsPanel;

