import React from 'react';
import ScoreBar from './ScoreBar';
import { AgentOutputs, AgentName, displayNames } from '../lib/types';

type Props = {
  agents: AgentOutputs;
  weights: Record<AgentName, number>;
};

const AgentDebugPanel: React.FC<Props> = ({ agents, weights }) => {
  const entries = Object.keys(agents) as AgentName[];

  return (
    <div>
      <div className="space-y-4 sm:hidden">
        {entries.map((name) => {
          const result = agents[name];
          const weight = weights[name] ?? 0;
          const scorePct = result.score * 100;
          const weighted = result.score * weight;
          const weightedPct = weighted * 100;

          return (
            <div key={name} className="border rounded p-4">
              <div className="font-medium">{displayNames[name]}</div>
              <div className="mt-2">
                <ScoreBar percent={scorePct} className="w-full" />
                <div className="mt-1 font-mono text-sm">
                  {result.score.toFixed(2)} ({Math.round(scorePct)}%)
                </div>
              </div>
              <div className="mt-2">
                <ScoreBar
                  percent={weightedPct}
                  color="bg-green-500"
                  className="w-full"
                />
                <div className="mt-1 font-mono text-sm">
                  {weighted.toFixed(2)} ({Math.round(weightedPct)}%)
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600 break-words">
                {result.reason}
              </div>
            </div>
          );
        })}
      </div>

      <div className="overflow-x-auto hidden sm:block">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Agent</th>
              <th className="p-2">Score</th>
              <th className="p-2">Weighted</th>
              <th className="p-2">Reason</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((name) => {
              const result = agents[name];
              const weight = weights[name] ?? 0;
              const scorePct = result.score * 100;
              const weighted = result.score * weight;
              const weightedPct = weighted * 100;

              return (
                <tr key={name} className="border-t">
                  <td className="p-2 font-medium">{displayNames[name]}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <ScoreBar percent={scorePct} />
                      <span className="w-20 text-right font-mono">
                        {result.score.toFixed(2)} ({Math.round(scorePct)}%)
                      </span>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <ScoreBar percent={weightedPct} color="bg-green-500" />
                      <span className="w-20 text-right font-mono">
                        {weighted.toFixed(2)} ({Math.round(weightedPct)}%)
                      </span>
                    </div>
                  </td>
                  <td className="p-2 text-xs text-gray-600 break-words">
                    {result.reason}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentDebugPanel;

