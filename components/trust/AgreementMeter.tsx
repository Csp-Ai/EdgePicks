import React from 'react';

interface AgentPick {
  agent: string;
  pick: string;
}

const SAMPLE_PICKS: AgentPick[] = [
  { agent: 'injuryScout', pick: 'Team A' },
  { agent: 'lineWatcher', pick: 'Team A' },
  { agent: 'statCruncher', pick: 'Team B' },
  { agent: 'trendsAgent', pick: 'Team A' },
];

const AgreementMeter: React.FC<{ picks?: AgentPick[] }> = ({
  picks = SAMPLE_PICKS,
}) => {
  const tally = picks.reduce<Record<string, number>>((acc, p) => {
    acc[p.pick] = (acc[p.pick] || 0) + 1;
    return acc;
  }, {});
  const top = Object.keys(tally).sort((a, b) => tally[b] - tally[a])[0];
  const agree = tally[top] || 0;
  const percent = Math.round((agree / picks.length) * 100);

  return (
    <section aria-labelledby="agreement-heading">
      <h2 id="agreement-heading" className="text-lg font-semibold">
        Agent Agreement
      </h2>
      <p className="mt-2">
        {percent}% of agents agree on {top}.
      </p>
      <ul className="list-disc ml-5 mt-2">
        {picks.map((p) => (
          <li key={p.agent}>
            {p.agent}: {p.pick}
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-500 italic">Using sample data</p>
    </section>
  );
};

export default AgreementMeter;
