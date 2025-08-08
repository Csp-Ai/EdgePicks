import React from 'react';

import AgentExecutionTracker, { AgentMeta } from '../AgentExecutionTracker';

const agents: AgentMeta[] = [
  { name: 'injuryScout', label: 'Injury' },
  { name: 'lineWatcher', label: 'Lines' },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      if (typeof (el as HTMLElement).focus === 'function') {
        (el as HTMLElement).focus();
      }
    }, 300);
  }
}

interface Props {
  onTryDemo?: () => void;
  onSeeUpcoming?: () => void;
}

const PredictionMarquee: React.FC<Props> = ({ onTryDemo, onSeeUpcoming }) => {
  const prefersReduced =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleSeeUpcoming = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onSeeUpcoming) {
      onSeeUpcoming();
    } else {
      scrollToId('live-games');
    }
  };

  return (
    <section className="bg-slate-900 text-white text-center py-8 px-4 space-y-6" data-testid="prediction-marquee">
      <div className="max-w-md mx-auto" style={{ minHeight: 200 }}>
        <AgentExecutionTracker agents={agents} mode={prefersReduced ? 'live' : 'demo'} />
      </div>
      <p className="text-xl font-medium">Modular AI agents. Transparent picks.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={onTryDemo}
          className="px-6 py-3 rounded-full bg-blue-600 text-white hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Try the Demo
        </button>
        <button
          onClick={handleSeeUpcoming}
          className="px-6 py-3 rounded-full border border-white hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-white"
        >
          See Upcoming Games
        </button>
      </div>
    </section>
  );
};

export default PredictionMarquee;
=======

type DemoPrediction = {
  matchup: string;
  pick: string;
  confidence: number;
};

export interface PredictionMarqueeProps {
  predictions?: DemoPrediction[];
}

const demoPredictions: DemoPrediction[] = [
  { matchup: 'NYJ @ BUF', pick: 'Jets +3.5', confidence: 68 },
  { matchup: 'LAL @ BOS', pick: 'Over 218.5', confidence: 62 },
  { matchup: 'DAL @ PHI', pick: 'Cowboys -2.5', confidence: 71 },
];

export default function PredictionMarquee({ predictions = demoPredictions }: PredictionMarqueeProps) {
  const items = [...predictions, ...predictions];
  return (
    <div className="overflow-hidden bg-white dark:bg-gray-900 text-sm" data-testid="prediction-marquee">
      <div className="flex whitespace-nowrap animate-marquee">
        {items.map((p, idx) => (
          <div key={idx} className="px-4 py-2 flex items-center space-x-2">
            <span className="font-semibold">{p.pick}</span>
            <span className="text-gray-500">{p.matchup}</span>
            <span className="text-emerald-600">{p.confidence}%</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          width: fit-content;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

