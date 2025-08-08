'use client';

import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceArea,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ConfidenceIntervalCard: React.FC = () => {
  const [n, setN] = useState(30);
  const std = 1;
  const z = 1.96; // 95% confidence

  const data = useMemo(() => {
    const arr: { x: number; y: number }[] = [];
    for (let x = -4; x <= 4; x += 0.1) {
      const y = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-(x * x) / 2);
      arr.push({ x: parseFloat(x.toFixed(1)), y });
    }
    return arr;
  }, []);

  const margin = z * std / Math.sqrt(n);

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Confidence Interval</h3>
      <input
        type="range"
        min={10}
        max={400}
        step={10}
        value={n}
        onChange={(e) => setN(parseInt(e.target.value))}
        className="w-full"
      />
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis type="number" dataKey="x" domain={[-4, 4]} />
            <YAxis hide domain={[0, 0.5]} />
            <Tooltip />
            <Line type="monotone" dataKey="y" stroke="#82ca9d" dot={false} />
            <ReferenceArea x1={-margin} x2={margin} fill="#82ca9d" fillOpacity={0.3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-sm">n = {n}, margin ±{margin.toFixed(2)}</p>
    </div>
  );
};

export default ConfidenceIntervalCard;
