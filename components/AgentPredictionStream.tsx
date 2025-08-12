'use client';

import React, { useState, useCallback } from 'react';
import { useAgentEvents } from '@/hooks/useAgentEvents';
import LoadingShimmer from './LoadingShimmer';
import type { AgentEvent, AgentEventUpdate } from '@/types/agent';

interface AgentPredictionStreamProps {
  runId: string;
  onComplete?: (data: AgentEventUpdate) => void;
}

export default function AgentPredictionStream({ runId, onComplete }: AgentPredictionStreamProps) {
  const [status, setStatus] = useState<AgentEventUpdate['status']>('running');
  const [events, setEvents] = useState<AgentEvent[]>([]);

  const handleUpdate = useCallback((data: AgentEventUpdate) => {
    setStatus(data.status);
    if (data.output && data.status !== 'error') {
      setEvents(prev => [...prev, data.output as AgentEvent]);
    }
    if (['completed', 'error'].includes(data.status) && onComplete) {
      onComplete(data);
    }
  }, [onComplete]);

  useAgentEvents(runId, handleUpdate);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Agent Analysis
        </h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            status === 'running' ? 'bg-blue-500 animate-pulse' :
            status === 'completed' ? 'bg-green-500' :
            'bg-red-500'
          }`} />
          <span className="text-sm text-gray-600 capitalize">
            {status}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {events.length > 0 ? (
          events.map((event, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-100"
            >
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(event, null, 2)}
              </pre>
            </div>
          ))
        ) : (
          <div className="py-8">
            <LoadingShimmer />
          </div>
        )}
      </div>
    </div>
  );
}
