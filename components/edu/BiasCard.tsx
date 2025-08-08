'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const BiasCard: React.FC = () => {
  const [bias, setBias] = useState(0);
  const trueValue = 50;
  const data = [
    { name: 'True', value: trueValue },
    { name: 'Estimate', value: trueValue + bias },
  ];

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Bias</h3>
      <input
        type="range"
        min={-20}
        max={20}
        step={1}
        value={bias}
        onChange={(e) => setBias(parseInt(e.target.value))}
        className="w-full"
      />
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
              <Cell fill="#82ca9d" />
              <Cell fill="#8884d8" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-sm">Bias: {bias}</p>
    </div>
  );
};

export default BiasCard;
