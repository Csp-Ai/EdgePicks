"use client";

import React from 'react';
import useSWR from 'swr';

interface AgentEvent {
  type: 'start' | 'result' | 'end';
  agentId: string;
  ts: number;
  payload?: {
    team: string;
    score: number;
    reason: string;
  };
}

interface ApiResponse {
  events: AgentEvent[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const AgentReplay: React.FC<{ runId: string }> = ({ runId }) => {
  const { data, error } = useSWR<ApiResponse>(
    `/api/agent-events?runId=${runId}`,
    fetcher
  );

  if (error) {
    return <p className="text-center">Failed to load replay.</p>;
  }

  if (!data) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <ol className="space-y-2" data-testid="agent-replay">
      {data.events.map((e, idx) => (
        <li key={idx} className="border rounded p-2">
          <div className="text-xs text-slate-500">
            {e.ts} · {e.agentId} · {e.type}
          </div>
          {e.type === 'result' && e.payload && (
            <div className="text-sm mt-1">
              {e.payload.team} ({e.payload.score}): {e.payload.reason}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
};

export default AgentReplay;
