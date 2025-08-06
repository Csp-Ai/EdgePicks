import React, { useEffect, useState } from 'react';
import DisagreementBadge from './DisagreementBadge';
import { AgentOutputs } from '../lib/types';
import { agents as agentRegistry } from '../lib/agents/registry';
import { formatAgentName } from '../lib/utils';

type Props = {
  confidence: number; // value between 0–100
  agents?: AgentOutputs;
  winner?: string;
};

const AnimatedConfidenceBar: React.FC<Props> = ({ confidence, agents, winner }) => {
  const [fill, setFill] = useState(0);
  const [display, setDisplay] = useState(0);
  const [showAgents, setShowAgents] = useState(false);

  const agentPicks = agents ? Object.values(agents).map((a) => a.team) : [];
  const disagreement =
    !!winner && agentPicks.length > 0 && agentPicks.some((team) => team !== winner);

  useEffect(() => {
    setFill(0);
    setDisplay(0);

    const duration = 700;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = confidence / steps;
    let current = 0;

    const counter = setInterval(() => {
      current += increment;
      if (current >= confidence) {
        current = confidence;
        clearInterval(counter);
      }
      setDisplay(Math.round(current));
    }, stepTime);

    const timer = setTimeout(() => setFill(confidence), 50);

    return () => {
      clearInterval(counter);
      clearTimeout(timer);
    };
  }, [confidence]);

  return (
    <div aria-label={`Confidence ${confidence}%`}>
      <div className="flex justify-between items-center mb-1">
        <span className="font-semibold">Confidence</span>
        <span className="font-bold">{display}%</span>
      </div>
      <div className="relative w-full h-3 bg-gray-200 rounded overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-red-500 opacity-20 blur-sm animate-pulse" />
        <div
          className="relative h-full bg-gradient-to-r from-green-400 to-red-500 transition-[width] duration-700 ease-out"
          style={{ width: `${fill}%` }}
        >
          <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-gray-800 text-white text-xs px-1 py-0.5 rounded shadow">
            {display}%
          </span>
        </div>
      </div>
      {disagreement && (
        <div className="mt-2">
          <DisagreementBadge />
        </div>
      )}
      {agents && (
        <button
          type="button"
          onClick={() => setShowAgents((s) => !s)}
          className="mt-2 text-xs text-blue-600 underline"
        >
          {showAgents ? 'Hide agent picks' : 'Show agent picks'}
        </button>
      )}
      {showAgents && agents && (
        <ul className="mt-2 space-y-1 text-sm">
          {agentRegistry.map(({ name }) => {
            const result = agents[name];
            if (!result) return null;
            const pct = Math.round(result.score * 100);
            return (
              <li key={name} className="flex justify-between">
                <span>
                  {formatAgentName(name)}: {result.team}
                </span>
                <span className="font-mono">{pct}%</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AnimatedConfidenceBar;
