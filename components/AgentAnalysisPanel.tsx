'use client';

import React from 'react';
import { useAgentRun } from '@/hooks/useAgentRun';
import { useAgentEvents } from '@/hooks/useAgentEvents';
import LoadingShimmer from './LoadingShimmer';
import AgentFlowAnimation from '@/components/AgentFlowAnimation';

interface AgentAnalysisPanelProps {
  compact?: boolean;
}

export default function AgentAnalysisPanel({ compact = false }: AgentAnalysisPanelProps) {
  const { runId, isRunning, error } = useAgentRun();
  const [events, setEvents] = React.useState<any[]>([]);
  const [confidence, setConfidence] = React.useState<number | null>(null);

  useAgentEvents(runId, (data) => {
    setEvents(prev => [...prev, data]);
  });

  const handleComplete = (finalConfidence: number) => {
    setConfidence(finalConfidence);
  };

  if (!runId && !isRunning) {
    return (
      <div className={`p-4 ${compact ? 'text-sm' : ''}`}>
        <p className="text-gray-500 dark:text-gray-400">
          Select a game to see agent analysis
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 dark:text-red-400">
        {error.message}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${compact ? 'text-sm' : ''}`}>
      <div className="flex items-center justify-between">
        <h3 className={`font-semibold ${compact ? 'text-base' : 'text-lg'}`}>
          Agent Analysis
        </h3>
        {isRunning && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-500">Processing...</span>
          </div>
        )}
      </div>

      {runId && (
        <AgentFlowAnimation runId={runId} onComplete={handleComplete} />
      )}

      {confidence !== null && (
        <p className="mt-4 text-lg font-semibold">
          EdgePicks recommends with {confidence.toFixed(2)}% confidence.
        </p>
      )}

      {events.length > 0 ? (
        <div className="space-y-3">
          {events.map((event, index) => (
            <div
              key={index}
              className={`
                p-3 bg-white dark:bg-gray-800 rounded-lg border 
                border-gray-200 dark:border-gray-700 shadow-sm
                ${compact ? 'text-xs' : 'text-sm'}
              `}
            >
              {typeof event === 'string' ? (
                event
              ) : (
                <pre className="whitespace-pre-wrap overflow-auto">
                  {JSON.stringify(event, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      ) : (
        <LoadingShimmer />
      )}
    </div>
  );
}
