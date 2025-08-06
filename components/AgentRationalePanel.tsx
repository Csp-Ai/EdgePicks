import React from 'react';
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
  const agents = executions.filter((e) => e.result && e.name !== 'guardianAgent') as Required<AgentExecution>[];
  const maxScore = Math.max(...agents.map((a) => a.result.score));
  return (
    <div className="flex flex-col gap-2">
      {agents.map(({ name, result }) => {
        const disagree = result.team !== winner;
        const delta = Math.round((maxScore - result.score) * 100);
        const Icon = (agentIcons[name] || Info) as LucideIcon;
        return (
          <div
            key={name}
            className={`p-2 border rounded text-sm ${
              disagree ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Icon className="w-4 h-4" /> {formatAgentName(name)}
              </span>
              <span>{Math.round(result.score * 100)}%</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">{result.reason}</p>
            {disagree && (
              <p className="text-xs text-red-600">Disagrees with pick</p>
            )}
            {delta > 0 && (
              <p className="text-xs text-gray-500">Edge Δ {delta}%</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AgentRationalePanel;
