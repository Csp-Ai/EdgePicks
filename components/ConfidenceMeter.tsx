import React, { useEffect, useState } from 'react';

export interface ConfidenceMeterProps {
  teamA: { name: string; logo?: string };
  teamB: { name: string; logo?: string };
  confidence: number;
  history?: number[];
}

const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  teamA,
  teamB,
  confidence,
  history = [],
}) => {
  const [fill, setFill] = useState(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const value = Math.max(0, Math.min(100, confidence));
    setFill(0);
    setDisplay(0);
    const duration = 700;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = value / steps;
    let current = 0;
    const counter = setInterval(() => {
      current += increment;
      if (current >= value) {
        current = value;
        clearInterval(counter);
      }
      setDisplay(Math.round(current));
    }, stepTime);
    const timer = setTimeout(() => setFill(value), 50);
    return () => {
      clearInterval(counter);
      clearTimeout(timer);
    };
  }, [confidence]);

  const teamALabel = teamA.name;
  const teamBLabel = teamB.name;
  const showTeams = Boolean(teamALabel || teamBLabel);

  return (
    <div aria-label={`Confidence ${confidence}%`}>
      <div
        className={`flex items-center mb-1 ${showTeams ? 'justify-between' : 'justify-end'}`}
      >
        {showTeams && <span className="font-semibold">{teamALabel}</span>}
        <span className="font-bold">{display}%</span>
        {showTeams && <span className="font-semibold">{teamBLabel}</span>}
      </div>
      <div className="relative w-full h-3 bg-gray-200 rounded overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-r from-green-400 to-red-500 opacity-20 blur-sm animate-pulse`}
        />
        <div
          className={`relative h-full bg-gradient-to-r from-green-400 to-red-500 transition-[width] duration-700 ease-out`}
          style={{ width: `${fill}%` }}
        />
      </div>
      {history.length > 0 && (
        <div className="mt-1 text-xs text-gray-500">
          {history.join(', ')}
        </div>
      )}
    </div>
  );
};

export default ConfidenceMeter;

