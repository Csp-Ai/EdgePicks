import React from 'react';

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
