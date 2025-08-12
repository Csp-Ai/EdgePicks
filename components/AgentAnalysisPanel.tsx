'use client';

import React from 'react';
import { useAgentRun } from '@/hooks/useAgentRun';
import { useAgentEvents } from '@/hooks/useAgentEvents';
import LoadingShimmer from './LoadingShimmer';
import AgentFlowAnimation from '@/components/AgentFlowAnimation';
import HistoricalAccuracyBar from '@/components/HistoricalAccuracyBar';

interface AgentAnalysisPanelProps {
  compact?: boolean;
}

export default function AgentAnalysisPanel({ compact = false }: AgentAnalysisPanelProps) {
  const { runId, isRunning, error } = useAgentRun();
  const [confidence, setConfidence] = React.useState<number | null>(null);

  const handleComplete = (finalConfidence: number) => {
    setConfidence(finalConfidence);
  };

  if (!runId && !isRunning) {
    return (
      <div className={`p-4 ${compact ? 'text-sm' : ''} bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md`}>  
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Select a game to see agent analysis
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-800 rounded-lg shadow-md">
        {error.message}
      </div>
    );
  }

  return (
    <div className={`space-y-6 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg ${compact ? 'text-sm' : ''}`}>
      {runId && (
        <div className="border-b pb-4">
          <AgentFlowAnimation runId={runId} onComplete={handleComplete} />
        </div>
      )}
      {confidence !== null && (
        <p className="mt-4 text-lg font-semibold text-center text-green-600 dark:text-green-400">
          EdgePicks recommends with {confidence.toFixed(2)}% confidence.
        </p>
      )}
      <div className="mt-6">
        <HistoricalAccuracyBar />
      </div>
    </div>
  );
}
