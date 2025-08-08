import React from 'react';

export interface RiskCommunicatorProps {
  /** Baseline risk as a fraction (0-1) */
  baseline: number;
  /** Relative risk from the model (0-1 where 1 = no effect) */
  relativeRisk: number;
  /** How to display the risk data */
  mode: 'absolute' | 'nnt' | 'icons';
}

const RiskCommunicator: React.FC<RiskCommunicatorProps> = ({
  baseline,
  relativeRisk,
  mode,
}) => {
  const absoluteRisk = baseline * relativeRisk;
  const difference = baseline - absoluteRisk; // positive = risk reduction
  const isHarm = difference < 0;
  const nnt = difference !== 0 ? Math.round(1 / Math.abs(difference)) : Infinity;

  if (mode === 'absolute') {
    return (
      <div className="text-center" aria-label="absolute-risk">
        <div>Baseline: {(baseline * 100).toFixed(1)}%</div>
        <div>Treatment: {(absoluteRisk * 100).toFixed(1)}%</div>
        <div>
          Difference: {isHarm ? '+' : '-'}{Math.abs(difference * 100).toFixed(1)}%
        </div>
      </div>
    );
  }

  if (mode === 'nnt') {
    const diffPercent = Math.min(100, Math.abs(difference * 100));
    return (
      <div className="text-center" aria-label="nnt-bar">
        <div className="w-full bg-gray-200 h-4 rounded">
          <div
            className={`h-full ${isHarm ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${diffPercent}%` }}
          />
        </div>
        <div className="mt-1">{isHarm ? `NNH ${nnt}` : `NNT ${nnt}`}</div>
      </div>
    );
  }

  // icon array representation (1,000-person chart)
  const total = 1000;
  const affected = Math.round(absoluteRisk * total);
  const icons = Array.from({ length: total });

  return (
    <div
      aria-label="icon-array"
      className="grid gap-[1px]"
      style={{ gridTemplateColumns: 'repeat(50, minmax(0, 1fr))' }}
    >
      {icons.map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 ${i < affected ? 'bg-red-500' : 'bg-gray-200'}`}
        />
      ))}
    </div>
  );
};

export default RiskCommunicator;

