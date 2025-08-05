import React, { useEffect, useState } from 'react';
import ScoreBar from './ScoreBar';
import { AgentName, AgentResult } from '../lib/types';
import { agents as agentRegistry } from '../lib/agents/registry';
import { formatAgentName } from '../lib/utils';

interface Props {
  name: AgentName;
  result: AgentResult;
  weight?: number;
  showWeight?: boolean;
  showTeam?: boolean;
  className?: string;
}

const AgentCard: React.FC<Props> = ({
  name,
  result,
  weight = 0,
  showWeight = false,
  showTeam = false,
  className = '',
}) => {
  const [visible, setVisible] = useState(false);
  const meta = agentRegistry.find((a) => a.name === name);

  useEffect(() => {
    setVisible(true);
  }, []);

  const scorePct = Math.round(result.score * 100);
  const weightPct = Math.round(weight * 100);

  return (
    <div
      className={`p-3 bg-gray-50 rounded shadow-sm flex flex-col gap-2 transition-all duration-500 ease-out hover:scale-[1.02] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium" title={meta?.description}>
          {formatAgentName(name)}
        </span>
        {showWeight && (
          <span className="text-xs text-gray-500">{weightPct}% weight</span>
        )}
      </div>
      {showTeam && !result.warnings && (
        <span className="text-sm text-gray-700">Favored: {result.team}</span>
      )}
      <div className="flex items-center gap-2">
        <ScoreBar percent={scorePct} />
        <span className="w-10 text-right font-mono text-sm">{result.score.toFixed(2)}</span>
      </div>
      <p className="text-xs text-gray-600 truncate" title={result.reason}>
        {result.reason}
      </p>
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
