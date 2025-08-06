import React, { useEffect, useRef, useState } from 'react';
import TeamBadge from './TeamBadge';

interface TeamInfo {
  name: string;
}

interface Props {
  teamA: TeamInfo;
  teamB: TeamInfo;
  confidence: number; // 0-100
  history: number[]; // past accuracy percentages
}

const Sparkline: React.FC<{ data: number[] }> = ({ data }) => {
  if (data.length === 0) return <svg width="60" height="20" />;
  const w = 60;
  const h = 20;
  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * w;
      const y = h - (val / 100) * h;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="text-blue-500">
      <polyline fill="none" stroke="currentColor" strokeWidth="2" points={points} />
    </svg>
  );
};

const ConfidenceMeter: React.FC<Props> = ({ teamA, teamB, confidence, history }) => {
  const [fill, setFill] = useState(0);
  const [simConfidence, setSimConfidence] = useState(confidence);
  const barRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<'A' | 'B' | null>(null);

  useEffect(() => {
    setSimConfidence(confidence);
    const timer = setTimeout(() => setFill(confidence), 50);
    return () => clearTimeout(timer);
  }, [confidence]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current || !barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const pct =
        100 - Math.min(Math.max(((e.clientY - rect.top) / rect.height) * 100, 0), 100);
      setSimConfidence(pct);
      setFill(pct);
    };
    const onUp = () => {
      dragging.current = null;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const startDrag = (team: 'A' | 'B') => (e: React.MouseEvent) => {
    dragging.current = team;
    e.preventDefault();
  };

  return (
    <div className="flex items-center gap-4" aria-label={`Confidence ${simConfidence}%`}>
      <div ref={barRef} className="relative h-48 w-8">
        <div className="absolute inset-0 bg-gray-200 rounded-full" />
        <div
          className="absolute bottom-0 w-full bg-gradient-to-t from-green-400 to-red-500 rounded-full transition-[height] duration-700 ease-out"
          style={{ height: `${fill}%` }}
        />
        <div
          className="absolute -left-10 cursor-grab" 
          style={{ bottom: `${simConfidence}%` }}
          onMouseDown={startDrag('A')}
        >
          <TeamBadge team={teamA.name} isWinner={simConfidence >= 50} />
        </div>
        <div
          className="absolute -right-10 cursor-grab"
          style={{ bottom: `${100 - simConfidence}%` }}
          onMouseDown={startDrag('B')}
        >
          <TeamBadge team={teamB.name} isWinner={simConfidence < 50} />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <span className="font-bold text-lg">{Math.round(simConfidence)}%</span>
        <Sparkline data={history} />
      </div>
    </div>
  );
};

export default ConfidenceMeter;
