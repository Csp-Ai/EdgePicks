import React, { useState } from 'react';
import AgentSummary from './AgentSummary';
import type { Matchup } from '../lib/mock/agentOutput';

interface Props {
  matchup: Matchup;
}

const MatchupCard: React.FC<Props> = ({ matchup }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded p-4 shadow-sm w-full md:w-1/2">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">
          {matchup.awayTeam} @ {matchup.homeTeam}
        </h3>
        <button
          className="text-blue-500 text-sm"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Hide' : 'Details'}
        </button>
      </div>
      <p className="mt-2">
        Pick: <span className="font-bold">{matchup.pick}</span> ({Math.round(matchup.confidence * 100)}%)
      </p>
      {open && (
        <div className="mt-2">
          <AgentSummary reasons={matchup.reasons} />
        </div>
      )}
    </div>
  );
};

export default MatchupCard;
