import React, { useState } from 'react';
import { AgentExecution } from '../lib/flow/runFlow';
import { AgentName } from '../lib/types';
import { formatAgentName } from '../lib/utils';
import {
  Activity,
  LineChart,
  BarChart2,
  TrendingUp,
  ShieldAlert,
  Info,
  LucideIcon,
} from 'lucide-react';

interface Props {
  executions: AgentExecution[];
  winner: string;
}

const agentIcons: Record<AgentName, LucideIcon> = {
  injuryScout: Activity,
  lineWatcher: LineChart,
  statCruncher: BarChart2,
  trendsAgent: TrendingUp,
  guardianAgent: ShieldAlert,
};

const AgentRationalePanel: React.FC<Props> = ({ executions, winner }) => {
  const agents = executions.filter(
    (e) => e.result && e.name !== 'guardianAgent'
  ) as Required<AgentExecution>[];
  const maxScore = Math.max(...agents.map((a) => a.result.score));
  const [expanded, setExpanded] = useState<Record<AgentName, boolean>>({});

  const toggle = (name: AgentName) =>
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="flex flex-col gap-2">
      {agents.map(({ name, result }) => {
        const disagree = result.team !== winner;
        const delta = Math.round((maxScore - result.score) * 100);
        const Icon = (agentIcons[name] || Info) as LucideIcon;
        const reason = result.reason;
        const isLong = reason.length > 200;
        const showFull = expanded[name];
        const displayText = showFull ? reason : reason.slice(0, 200);
        return (
          <div
            key={name}
            className={`p-4 rounded-xl border text-sm transition hover:shadow ${
              disagree
                ? 'border-red-500 bg-red-900/20'
                : 'border-slate-700 bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Icon className="w-4 h-4" /> {formatAgentName(name)}
              </span>
              <span className="px-2 py-0.5 bg-slate-700 rounded-full text-xs">
                {Math.round(result.score * 100)}%
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              {displayText}
              {!showFull && isLong && '...'}
            </p>
            {isLong && (
              <button
                onClick={() => toggle(name)}
                className="text-xs text-blue-400 mt-1"
              >
                {showFull ? 'Show less' : 'Show more'}
              </button>
            )}
            {disagree && (
              <p className="text-xs text-red-400">Disagrees with pick</p>
            )}
            {delta > 0 && (
              <p className="text-xs text-gray-400">Edge Δ {delta}%</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AgentRationalePanel;
