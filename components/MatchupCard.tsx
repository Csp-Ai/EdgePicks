import React, { useState } from 'react';

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

  return (
    <div
      className={`border rounded p-4 shadow-sm w-full md:w-1/2 ${
        result.confidence > 0.8 ? 'border-green-500' : ''
      }`}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">
          {teamA} vs {teamB}
        </h3>
        <div className="flex gap-2 items-center">
          {onRerun && (
            <button
              className="text-blue-500 text-sm disabled:opacity-50"
              onClick={onRerun}
              disabled={loading}
            >
              {loading ? '...' : 'Re-run'}
            </button>
          )}
          <button
            className="text-blue-500 text-sm"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? 'Hide' : 'Details'}
          </button>
        </div>
      </div>
      <p className="mt-2">
        Pick: <span className="font-bold">{result.winner}</span> ({confidencePct}%)
        {result.confidence > 0.8 && (
          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
            High Confidence
          </span>
        )}
      </p>
      {open && (
        <ul className="mt-2 list-disc list-inside text-sm">
          {result.topReasons.map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MatchupCard;

