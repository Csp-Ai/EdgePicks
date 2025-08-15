import React from 'react';
import ScoreBar from './ScoreBar';
import AgentTooltip from './AgentTooltip';
import { AgentOutputs } from '@/lib/types';
import { getAgent, AgentKey } from '@/lib/types/compat';
import { registry as agentRegistry } from '@/lib/agents/registry';
import { formatAgentName } from '@/lib/utils';

const typeBadge: Record<string, string> = {
  injury: '🏥 Injury',
  line: '📈 Line',
  stat: '🧠 Stat',
};

type Props = {
  agents: Partial<AgentOutputs>;
};

const AgentDebugPanel: React.FC<Props> = ({ agents }) => {
  return (
    <div>
      <div className="space-y-4 sm:hidden">
        {agentRegistry.map(({ name, weight, type }) => {
          const result = getAgent(agents, name as AgentKey);
          const display = formatAgentName(name);
          if (!result) {
            return (
              <div key={name} className="border rounded p-4 opacity-50">
                <div className="font-medium">{display}</div>
                <div className="mt-2 text-sm text-gray-500">Loading...</div>
              </div>
            );
          }
          const score = result?.score ?? 0;
          const scorePct = score * 100;
          const weighted = score * weight;
          const weightedPct = weighted * 100;
          const badge = typeBadge[type] || type;

          return (
            <div
              key={name}
              className="border rounded p-4 ring-1 ring-blue-500 transition hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between">
                <AgentTooltip name={name}>
                  <div className="font-medium">{display}</div>
                </AgentTooltip>
                <span className="text-xs px-2 py-0.5 bg-gray-200 rounded">{badge}</span>
              </div>
              <div className="mt-2">
                <ScoreBar percent={scorePct} className="w-full" />
                <div className="mt-1 font-mono text-sm">
                  {score.toFixed(2)} ({Math.round(scorePct)}%)
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
              <div className="mt-2 text-xs text-gray-600 truncate" title={result.reason}>
                {result.reason}
              </div>
              {result.warnings && result.warnings.length > 0 && (
                <ul className="mt-2 text-xs text-yellow-700 list-disc pl-4">
                  {result.warnings.map((w: string, i: number) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              )}
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
            {agentRegistry.map(({ name, weight, type }) => {
              const result = getAgent(agents, name as AgentKey);
              const display = formatAgentName(name);
              if (!result) {
                return (
                  <tr key={name} className="border-t opacity-50">
                    <td className="p-2 font-medium">{display}</td>
                    <td className="p-2" colSpan={3}>
                      <span className="text-gray-500">Loading...</span>
                    </td>
                  </tr>
                );
              }
              const score = result?.score ?? 0;
              const scorePct = score * 100;
              const weighted = score * weight;
              const weightedPct = weighted * 100;
              const badge = typeBadge[type] || type;

              return (
                <tr key={name} className="border-t ring-1 ring-blue-500">
                  <td className="p-2 font-medium flex items-center gap-2">
                    <AgentTooltip name={name}>{display}</AgentTooltip>
                    <span className="text-xs px-2 py-0.5 bg-gray-200 rounded">{badge}</span>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <ScoreBar percent={scorePct} />
                      <span className="w-20 text-right font-mono">
                        {score.toFixed(2)} ({Math.round(scorePct)}%)
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
                  <td className="p-2 text-xs text-gray-600 max-w-xs">
                    <div className="truncate" title={result.reason}>{result.reason}</div>
                    {result.warnings && result.warnings.length > 0 && (
                      <ul className="mt-1 list-disc pl-4 text-yellow-700">
                        {result.warnings.map((w: string, i: number) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    )}
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

