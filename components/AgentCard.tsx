import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
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
import ReasoningDisclosure from './agents/ReasoningDisclosure';
import ConfidenceMeter from './ConfidenceMeter';
import GlossaryLink from './GlossaryLink';
import { agentCard, agentCardSkeleton } from '../styles/cardStyles';

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
  const { data: session } = useSession();
  useEffect(() => {
    setVisible(true);
  }, []);

  const weightPct = Math.round(weight * 100);
  const isLoading = loading || !result;

  if (isLoading || !result) {
    return (
      <div className={`${agentCardSkeleton} ${className}`}>
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
  const content = (
    <div
      className={`${agentCard} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      } ${className}`}
      style={{ boxShadow: `0 0 8px ${glowColor}` }}
    >
      <div className="flex items-start justify-between">
        <ReasoningDisclosure
          reason={result.reason}
          className="flex items-center gap-2 font-medium cursor-pointer"
          tabIndex={0}
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
          onFocus={() =>
            window.dispatchEvent(
              new CustomEvent('glossary-hover', { detail: name })
            )
          }
          onBlur={() =>
            window.dispatchEvent(
              new CustomEvent('glossary-hover', { detail: null })
            )
          }
        >
          <Icon className="w-4 h-4" />
          {formatAgentName(name)}
        </ReasoningDisclosure>
        {showWeight && (
          <span className="text-xs text-gray-500">{weightPct}% weight</span>
        )}
      </div>
      {showTeam && result && !result.warnings && (
        <span className="text-sm text-gray-700">Favored: {result.team}</span>
      )}
      <ConfidenceMeter
        teamA={{ name: '' }}
        teamB={{ name: '' }}
        confidence={scorePct}
      />
      {result.warnings && result.warnings.length > 0 && (
        <ul className="text-xs text-yellow-700 list-disc pl-4">
          {result.warnings.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      )}
      <GlossaryLink className="mt-2 block" />
    </div>
  );

  return session?.user ? (
    <Link href="/dashboard" aria-label="View agent dashboard">
      {content}
    </Link>
  ) : (
    content
  );
};

export default AgentCard;

