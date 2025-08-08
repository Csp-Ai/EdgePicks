import React, { useState } from 'react';
import AgentNodeGraph from './AgentNodeGraph';
import type { AgentOutputs, AgentLifecycle, PickSummary, AgentName } from '../lib/types';
import type { FlowNode, FlowEdge } from '../lib/dashboard/useFlowVisualizer';

interface Props {
  agents: AgentOutputs;
  pick: PickSummary | null;
  statuses: Record<AgentName, { status: AgentLifecycle['status'] | 'idle'; durationMs?: number }>;
  nodes: FlowNode[];
  edges: FlowEdge[];
  cached?: boolean;
}

const PredictionsPanel: React.FC<Props> = ({
  agents,
  pick,
  statuses,
  nodes,
  edges,
  cached,
}) => {
  const [advanced, setAdvanced] = useState(false);
  const agentNames = Object.keys(agents) as AgentName[];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Matchup Insights</h2>
        <button
          className="text-sm text-blue-500 underline"
          onClick={() => setAdvanced((v) => !v)}
        >
          {advanced ? 'Basic View' : 'Advanced View'}
        </button>
      </div>
      {advanced && <AgentNodeGraph nodes={nodes} edges={edges} />}
      {pick && (
        <div className="p-4 bg-white/10 rounded relative">
          {process.env.NODE_ENV === 'development' && cached && (
            <span className="absolute top-1 right-1 px-2 py-0.5 text-xs rounded bg-green-600 text-white">
              Cached
            </span>
          )}
          <h2 className="text-xl font-semibold">Prediction: {pick.winner}</h2>
          <p className="text-sm text-gray-300">
            Confidence: {(pick.confidence * 100).toFixed(0)}%
          </p>
          {pick.topReasons && pick.topReasons.length > 0 && (
            <ul className="mt-2 list-disc list-inside text-sm text-gray-300">
              {pick.topReasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      {agentNames.length > 0 && (
        <ul className="space-y-2">
          {agentNames.map((name) => {
            const result = agents[name];
            const status = statuses[name]?.status || 'idle';
            return (
              <li key={name} className="p-3 bg-white/5 rounded">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{name}</span>
                  <span className="text-xs text-gray-400">{status}</span>
                </div>
                {result.description && (
                  <p className="text-xs text-gray-400 mb-1">
                    {result.description}
                  </p>
                )}
                <p className="text-sm text-gray-300 mb-1">{result.reason}</p>
                <div className="text-xs text-gray-400 flex flex-wrap gap-2">
                  {typeof result.weight !== 'undefined' && (
                    <span>Weight: {result.weight}</span>
                  )}
                  {typeof result.scoreTotal !== 'undefined' && (
                    <span>Score: {result.scoreTotal.toFixed(2)}</span>
                  )}
                  {typeof result.confidenceEstimate !== 'undefined' && (
                    <span>
                      Confidence: {(result.confidenceEstimate * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PredictionsPanel;
