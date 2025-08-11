import React, { useEffect, useState } from 'react';
import ConfidenceMeter from './ConfidenceMeter';
import DisagreementBadge from './DisagreementBadge';
import TeamBadge from './TeamBadge';
import { getAccuracyHistory } from '@/lib/accuracy';

type Props = {
  teamA: string;
  teamB: string;
  winner: string;
  confidence: number; // 0-1
};

const PickSummary: React.FC<Props> = ({ teamA, teamB, winner, confidence }) => {
  const pct = Math.round(confidence * 100);
  const winnerColor = winner === teamA ? 'text-blue-600' : 'text-red-600';
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    getAccuracyHistory()
      .then((h) => setHistory(h))
      .catch(() => setHistory([]));
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h3 className="font-semibold flex items-center gap-3">
          <span className="flex items-center gap-2">
            <TeamBadge team={teamA} isWinner={winner === teamA} />
            {teamA}
          </span>
          <span className="text-gray-400">vs</span>
          <span className="flex items-center gap-2">
            <TeamBadge team={teamB} isWinner={winner === teamB} />
            {teamB}
          </span>
        </h3>
        <div className="text-xl font-bold mt-2 sm:mt-0">
          <span className={winnerColor}>{winner}</span>
        </div>
      </div>
      <ConfidenceMeter
        teamA={{ name: teamA }}
        teamB={{ name: teamB }}
        confidence={pct}
        history={history}
      />
      <DisagreementBadge confidence={pct} />
      <p className="mt-4 text-center text-xs text-gray-500">
        Powered by modular AI agents
      </p>
    </div>
  );
};

export default PickSummary;

