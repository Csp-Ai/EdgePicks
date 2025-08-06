import React, { useEffect, useState } from 'react';
import {
  Activity,
  LineChart,
  BarChart2,
  TrendingUp,
  ShieldAlert,
  Info,
  LucideIcon,
} from 'lucide-react';
import { AgentName, AgentResult } from '../lib/types';
import { formatAgentName } from '../lib/utils';
import Tooltip from './Tooltip';
import ConfidenceMeter from './ConfidenceMeter';
import AgentTooltip from './AgentTooltip';

interface Props {
  name: AgentName;
  result?: AgentResult;
  weight?: number;
  showWeight?: boolean;
  showTeam?: boolean;
  className?: string;
  loading?: boolean;
}

const agentIcons: Record<AgentName, LucideIcon> = {
  injuryScout: Activity,
  lineWatcher: LineChart,
  statCruncher: BarChart2,
  trendsAgent: TrendingUp,
  guardianAgent: ShieldAlert,
};

const AgentCard: React.FC<Props> = ({
  name,
  result,
  weight = 0,
  showWeight = false,
  showTeam = false,
  className = '',
  loading = false,
}) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
  }, []);

  const weightPct = Math.round(weight * 100);
  const isLoading = loading || !result;

  if (isLoading || !result) {
    return (
      <div className={`p-4 rounded-xl border bg-gray-100 animate-pulse ${className}`}>
        <div className="h-4 bg-gray-300 rounded w-1/3 mb-2" />
        <div className="h-3 bg-gray-300 rounded w-full mb-2" />
        <div className="h-3 bg-gray-300 rounded w-2/3" />
      </div>
    );
  }

  const scorePct = Math.round(result.score * 100);
  const glowColor =
    result.score > 0.66
      ? 'rgba(34,197,94,0.6)'
      : result.score > 0.33
      ? 'rgba(250,204,21,0.6)'
      : 'rgba(239,68,68,0.6)';
  const Icon = (agentIcons[name] || Info) as LucideIcon;

  return (
    <div
      className={`relative p-4 bg-gray-50 rounded-xl border flex flex-col gap-2 transition-all duration-500 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      } ${className}`}
      style={{ boxShadow: `0 0 8px ${glowColor}` }}
    >
      <div className="flex items-center justify-between">
        <AgentTooltip name={name}>
          <span
            className="flex items-center gap-2 font-medium"
            onMouseEnter={() =>
              window.dispatchEvent(
                new CustomEvent('glossary-hover', { detail: name })
              )
            }
            onMouseLeave={() =>
              window.dispatchEvent(
                new CustomEvent('glossary-hover', { detail: null })
              )
            }
          >
            <Icon className="w-4 h-4" />
            {formatAgentName(name)}
          </span>
        </AgentTooltip>
        {showWeight && (
          <span className="text-xs text-gray-500">{weightPct}% weight</span>
        )}
      </div>
      {showTeam && result && !result.warnings && (
        <span className="text-sm text-gray-700">Favored: {result.team}</span>
      )}
      <ConfidenceMeter
        confidence={scorePct}
        gradientClass="from-green-400 via-blue-500 to-purple-600"
      />
      <div className="text-xs text-gray-600 flex items-center">
        <Tooltip content={result.reason}>
          <Info className="w-4 h-4 cursor-help" />
        </Tooltip>
      </div>
      {result.warnings && result.warnings.length > 0 && (
        <ul className="text-xs text-yellow-700 list-disc pl-4">
          {result.warnings.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AgentCard;

