import { useState, useCallback } from 'react';

interface AgentRunOptions {
  homeTeam: string;
  awayTeam: string;
  league?: string;
}

interface UseAgentRunResult {
  runId: string | null;
  isRunning: boolean;
  error: Error | null;
  startRun: (options: AgentRunOptions) => Promise<void>;
}

export function useAgentRun(): UseAgentRunResult {
  const [runId, setRunId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const startRun = useCallback(async (options: AgentRunOptions) => {
    setIsRunning(true);
    setError(null);

    try {
      const response = await fetch('/api/run-agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: {
            homeTeam: options.homeTeam,
            awayTeam: options.awayTeam,
            league: options.league,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start agent run');
      }

      const data = await response.json();
      setRunId(data.runId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsRunning(false);
    }
  }, []);

  return {
    runId,
    isRunning,
    error,
    startRun,
  };
}

export function useAgentStatus(runId: string | null) {
  const [status, setStatus] = useState('pending');
  const [result, setResult] = useState<any | null>(null);

  const checkStatus = useCallback(async () => {
    if (!runId) return;

    try {
      const response = await fetch(`/api/run-agents?runId=${runId}`);
      if (!response.ok) {
        throw new Error('Failed to check agent status');
      }

      const data = await response.json();
      setStatus(data.status);
      if (data.output) {
        setResult(data.output);
      }
    } catch (error) {
      console.error('Error checking agent status:', error);
    }
  }, [runId]);

  return {
    status,
    result,
    checkStatus,
  };
}
