'use client';

import { useState, useCallback } from 'react';
import type { AgentEvent } from '@/types/agent';

export interface AgentRunOptions {
  homeTeam: string;
  awayTeam: string;
  league?: string;
  modelId?: string;
  confidence?: number;
}

interface AgentRunResponse {
  runId: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  error?: string;
}

export interface UseAgentRunResult {
  runId: string | null;
  isRunning: boolean;
  error: Error | null;
  startRun: (options: AgentRunOptions) => Promise<void>;
}

export function useAgentRun(): UseAgentRunResult {
  const [runId, setRunId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [events, setEvents] = useState<AgentEvent[]>([]);

  const startRun = useCallback(async (options: AgentRunOptions) => {
    setIsRunning(true);
    setError(null);
    setEvents([]);

    try {
      const response = await fetch('/api/run-agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: options
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AgentRunResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setRunId(data.runId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to start agent run'));
      setRunId(null);
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
