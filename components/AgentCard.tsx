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
import { agents as agentRegistry } from '../lib/agents/registry';
import { formatAgentName } from '../lib/utils';
import Tooltip from './Tooltip';

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
  const [open, setOpen] = useState(false);
  const meta = agentRegistry.find((a) => a.name === name);

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
      ? 'rgba(var(--color-positive),0.6)'
      : result.score > 0.33
      ? 'rgba(var(--color-neutral),0.6)'
      : 'rgba(var(--color-negative),0.6)';
  const Icon = (agentIcons[name] || Info) as LucideIcon;

  return (
    <>
      <button
        type="button"
        aria-label={`View details for ${formatAgentName(name)}`}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={`relative p-4 bg-gray-50 rounded-xl border flex flex-col text-left gap-2 transition-all duration-500 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        } ${className}`}
        style={{ boxShadow: `0 0 8px ${glowColor}` }}
      >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-medium" title={meta?.description}>
          <Icon className="w-4 h-4" />
          {formatAgentName(name)}
        </span>
        {showWeight && (
          <span className="text-xs text-gray-500">{weightPct}% weight</span>
        )}
      </div>
      {showTeam && result && !result.warnings && (
        <span className="text-sm text-gray-700">Favored: {result.team}</span>
      )}
      <div className="relative w-full h-3 bg-gray-200 rounded overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-positive via-blue-500 to-purple-600 transition-[width] duration-700"
          style={{ width: `${scorePct}%` }}
        />
        <div className="absolute inset-0 bg-white/20" />
      </div>
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
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              {formatAgentName(name)} Details
            </h2>
            <p className="mb-2"><strong>Favored:</strong> {result.team}</p>
            <p className="mb-4 text-sm" aria-label="Agent rationale">{result.reason}</p>
            {result.warnings && result.warnings.length > 0 && (
              <ul className="mb-4 text-sm list-disc pl-4 text-yellow-700">
                {result.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close agent details"
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AgentCard;
