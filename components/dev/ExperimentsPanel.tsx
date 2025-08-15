"use client";

import React from 'react';
import { flags, FlagKey } from '@/lib/flags/experiments';
import { useFlag } from '@/lib/flags/useFlag';

function ExperimentToggle({ flag }: { flag: FlagKey }) {
  const [value, set] = useFlag(flag);
  return (
    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => set(e.target.checked)}
      />{' '}
      {flag}
    </label>
  );
}

export default function ExperimentsPanel() {
  if (process.env.NODE_ENV === 'production') return null;
  const keys = Object.keys(flags) as FlagKey[];
  return (
    <div>
      {keys.map((key) => (
        <ExperimentToggle key={key} flag={key} />
      ))}
    </div>
  );
}
