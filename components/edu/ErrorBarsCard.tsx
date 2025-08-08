'use client';

import React, { useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ErrorBar,
  ResponsiveContainer,
} from 'recharts';

const ErrorBarsCard: React.FC = () => {
  const [err, setErr] = useState(5);
  const data = [
    { x: 1, y: 5, err },
    { x: 2, y: 10, err },
    { x: 3, y: 7, err },
  ];

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Error Bars</h3>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={err}
        onChange={(e) => setErr(parseInt(e.target.value))}
        className="w-full"
      />
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" />
            <YAxis type="number" dataKey="y" />
            <Tooltip />
            <Scatter data={data} fill="#8884d8">
              <ErrorBar dataKey="err" width={4} strokeWidth={2} />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-sm">Error ±{err}</p>
    </div>
  );
};

export default ErrorBarsCard;
