import React from 'react';
import { REQUIRED_ENV_KEYS } from '../lib/envKeys';

export default function EnvDashboard() {
  if (process.env.NODE_ENV !== 'development') return null;
  return (
    <div className="p-4 text-sm bg-black text-white rounded">
      {REQUIRED_ENV_KEYS.map((key) => (
        <div key={key}>
          {key}: <span className="font-mono">{process.env[key] ? '✅' : '❌ MISSING'}</span>
        </div>
      ))}
    </div>
  );
}
