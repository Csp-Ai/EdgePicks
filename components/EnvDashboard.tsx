import React from 'react';
import { ENV } from '../lib/env';

export default function EnvDashboard() {
  if (process.env.NODE_ENV !== 'development') return null;
  return (
    <div className="p-4 text-sm bg-black text-white rounded">
      {Object.entries(ENV).map(([key, val]) => (
        <div key={key}>
          {key}: <span className="font-mono">{val ? '✅' : '❌ MISSING'}</span>
        </div>
      ))}
    </div>
  );
}
