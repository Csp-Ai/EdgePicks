import React, { useEffect, useState } from 'react';
import { AgentOutputs, AgentName, AgentResult } from '../lib/types';

interface Props {
  agents: AgentOutputs;
}

const displayNames: Record<AgentName, string> = {
  injuryScout: 'InjuryScout',
  lineWatcher: 'LineWatcher',
  statCruncher: 'StatCruncher',
};

const weights: Record<AgentName, number> = {
  injuryScout: 0.5,
  lineWatcher: 0.3,
  statCruncher: 0.2,
};

const AgentSummary: React.FC<Props> = ({ agents }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const renderAgent = (name: AgentName, result: AgentResult) => {
    const weight = weights[name];
    const percent = Math.round(weight * 100);
    const scorePct = Math.round(result.score * 100);

    return (
      <li
        key={name}
        className={`p-3 bg-gray-50 rounded shadow-sm flex flex-col sm:flex-row sm:items-center gap-2 transition-all duration-500 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-medium">{displayNames[name]}</span>
            <span className="text-xs text-gray-500">{percent}% weight</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">{result.reason}</p>
        </div>
        <div className="w-full sm:w-40 flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded">
            <div
              className="h-full bg-blue-500 rounded"
              style={{ width: `${scorePct}%` }}
            />
          </div>
          <span className="w-10 text-right font-mono text-sm">{result.score.toFixed(2)}</span>
        </div>
      </li>
    );
  };

  return (
    <ul className="mt-2 text-sm space-y-3">
      {(Object.keys(agents) as AgentName[]).map((name) =>
        renderAgent(name, agents[name])
      )}
    </ul>
  );
};

export default AgentSummary;

