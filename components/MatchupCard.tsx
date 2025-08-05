import React, { useState } from 'react';
import AnimatedConfidenceBar from './AnimatedConfidenceBar';
import TeamBadge from './TeamBadge';

export type MatchupProps = {
  teamA: string;
  teamB: string;
  result: {
    winner: string;
    confidence: number;
    topReasons: string[];
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
  const confidencePct = Math.round(result.confidence * 100);
  const winnerColor = result.winner === teamA ? 'text-blue-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex justify-between items-center mb-4">
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
              className="min-h-[44px] px-3 py-1 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50 disabled:opacity-50"
              onClick={onRerun}
              disabled={loading}
            >
              {loading ? '...' : 'Re-run'}
            </button>
          )}
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
          <span className="mt-2 inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">🟢 High Confidence</span>
        )}
        {confidencePct < 55 && (
          <span className="mt-2 inline-block px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">🟡 Toss-Up</span>
        )}
      </div>
      {open && (
        <ul className="mt-2 list-disc list-inside text-sm space-y-1">
          {result.topReasons.slice(0, 3).map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MatchupCard;

