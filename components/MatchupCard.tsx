import React, { useState } from 'react';
import AnimatedConfidenceBar from './AnimatedConfidenceBar';
import TeamBadge from './TeamBadge';
import AgentSummary from './AgentSummary';
import AgentComparePanel from './AgentComparePanel';
import ScoreBar from './ScoreBar';
import { AgentOutputs } from '../lib/types';
import { getContribution, formatAgentName } from '../lib/utils';
import { agents as agentRegistry } from '../lib/agents/registry';

interface BreakdownProps {
  agents: AgentOutputs;
  total: number;
}

const ConfidenceBreakdown: React.FC<BreakdownProps> = ({ agents, total }) => {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-1 mb-2">
        <h4 className="font-semibold text-sm">Confidence Breakdown</h4>
        <span
          className="text-gray-400 text-xs cursor-help"
          title="Final confidence is the sum of each agent score multiplied by its weight."
        >
          ?
        </span>
      </div>
      <ul className="space-y-2 text-sm">
        {agentRegistry.map(({ name, weight }) => {
          const score = agents[name].score;
          const contribution = getContribution(score, weight);
          const contributionPct = total > 0 ? (contribution / total) * 100 : 0;
          const display = formatAgentName(name);
          const tooltip = `${display} scored ${score.toFixed(2)} with weight ${weight.toFixed(2)}, contributing ${contribution.toFixed(2)} (${Math.round(contributionPct)}%) to the final pick`;

          return (
            <li key={name} className="flex items-center gap-2 cursor-help" title={tooltip}>
              <span className="w-28">{display}</span>
              <div className="flex items-center flex-1 gap-2">
                <ScoreBar percent={contributionPct} />
                <span className="w-16 text-right font-mono">{score.toFixed(2)}</span>
                <span className="w-24 text-right font-mono">
                  {contribution.toFixed(2)} ({Math.round(contributionPct)}%)
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export type MatchupProps = {
  teamA: string;
  teamB: string;
  result: {
    winner: string;
    confidence: number;
    topReasons: string[];
    agents: AgentOutputs;
  };
  onRerun?: () => void;
  loading?: boolean;
};

const MatchupCard: React.FC<MatchupProps> = ({
  teamA,
  teamB,
  result,
  onRerun,
  loading,
}) => {
  const [open, setOpen] = useState(false);
  const [compare, setCompare] = useState(false);
  const confidencePct = Math.round(result.confidence * 100);
  const winnerColor = result.winner === teamA ? 'text-blue-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h3 className="font-semibold flex items-center gap-3">
          <span className="flex items-center gap-2">
            <TeamBadge team={teamA} isWinner={result.winner === teamA} />
            {teamA}
          </span>
          <span className="text-gray-400">vs</span>
          <span className="flex items-center gap-2">
            <TeamBadge team={teamB} isWinner={result.winner === teamB} />
            {teamB}
          </span>
        </h3>
        <div className="flex gap-2 items-center">
          {onRerun && (
            <button
              className={`min-h-[44px] px-3 py-1 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50 disabled:opacity-50`}
              onClick={onRerun}
              disabled={loading}
            >
              {loading ? '...' : 'Re-run'}
            </button>
          )}
          <button
            className="min-h-[44px] px-3 py-1 text-sm text-blue-600 underline"
            onClick={() => setCompare((c) => !c)}
          >
            {compare ? 'Hide' : 'Compare Agents'}
          </button>
          <button
            className="min-h-[44px] px-3 py-1 text-sm text-blue-600 underline"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? 'Hide' : 'Why?'}
          </button>
        </div>
      </div>
      <div className="text-center mb-4">
        <span className={`text-xl font-bold ${winnerColor}`}>{result.winner}</span>
      </div>
      <div className="mb-4">
        <AnimatedConfidenceBar confidence={confidencePct} />
        {confidencePct > 80 && (
          <span className="mt-2 inline-block px-2 py-0.5 bg-positive/20 text-positive rounded text-xs">🟢 High Confidence</span>
        )}
        {confidencePct < 55 && (
          <span className="mt-2 inline-block px-2 py-0.5 bg-neutral/20 text-neutral rounded text-xs">🟡 Toss-Up</span>
        )}
      </div>
      {compare && <AgentComparePanel agents={result.agents} />}
      {open && (
        <>
          <AgentSummary agents={result.agents} />
          <ConfidenceBreakdown agents={result.agents} total={result.confidence} />
        </>
      )}
      <p className="mt-4 text-center text-xs text-gray-500">
        Powered by modular AI agents
      </p>
    </div>
  );
};

export default MatchupCard;

