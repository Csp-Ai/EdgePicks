'use client';

import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ZScoreCard: React.FC = () => {
  const [z, setZ] = useState(0);

  const data = useMemo(() => {
    const arr: { x: number; y: number }[] = [];
    for (let x = -4; x <= 4; x += 0.1) {
      const y = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-(x * x) / 2);
      arr.push({ x: parseFloat(x.toFixed(1)), y });
    }
    return arr;
  }, []);

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Z-Score</h3>
      <input
        type="range"
        min={-3}
        max={3}
        step={0.1}
        value={z}
        onChange={(e) => setZ(parseFloat(e.target.value))}
        className="w-full"
      />
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis type="number" dataKey="x" domain={[-4, 4]} />
            <YAxis hide domain={[0, 0.5]} />
            <Tooltip />
            <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} />
            <ReferenceLine x={z} stroke="red" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-sm">Current z-score: {z.toFixed(1)}</p>
    </div>
  );
};

export default ZScoreCard;
