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
