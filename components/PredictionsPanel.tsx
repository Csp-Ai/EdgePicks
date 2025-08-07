import React from 'react';
import type { AgentOutputs, AgentLifecycle, PickSummary, AgentName } from '../lib/types';

interface Props {
  agents: AgentOutputs;
  pick: PickSummary | null;
  statuses: Record<AgentName, { status: AgentLifecycle['status'] | 'idle'; durationMs?: number }>;
}

const PredictionsPanel: React.FC<Props> = ({ agents, pick, statuses }) => {
  const agentNames = Object.keys(agents) as AgentName[];
  return (
    <div className="space-y-4">
      {pick && (
        <div className="p-4 bg-white/10 rounded">
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
                <p className="text-sm text-gray-300">{result.reason}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PredictionsPanel;
