import React from 'react';
import { LineChart, Line } from 'recharts';
import { formatAgentName } from '../../lib/utils';
import type { AgentName } from '../../lib/agents/registry';
import type { AccuracyPoint } from '../../components/AccuracyTrend';

interface Props {
  name: AgentName;
  purpose: string;
  sampleReasoning: string;
  history: AccuracyPoint[];
}

const AgentTile: React.FC<Props> = ({
  name,
  purpose,
  sampleReasoning,
  history,
}) => {
  const data = history
    .map((p) => ({ date: p.date, value: p[name] as number }))
    .filter((d) => typeof d.value === 'number');

  return (
    <div className="border rounded p-4" data-testid="agent-tile">
      <h3 className="font-semibold mb-1">{formatAgentName(name)}</h3>
      <p className="text-sm text-gray-700 mb-2">{purpose}</p>
      <p className="text-xs text-gray-500 mb-2">{sampleReasoning}</p>
      <LineChart
        width={120}
        height={40}
        data={data}
        aria-label={`Accuracy sparkline for ${name}`}
        data-testid="accuracy-sparkline"
      >
        <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
      </LineChart>
    </div>
  );
};

export default AgentTile;
