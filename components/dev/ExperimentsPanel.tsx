"use client";

import React from 'react';
import { flags, FlagKey } from '@/lib/flags/experiments';
import { useFlag } from '@/lib/flags/useFlag';

export default function ExperimentsPanel() {
  if (process.env.NODE_ENV === 'production') return null;
  const keys = Object.keys(flags) as FlagKey[];
  return (
    <div>
      {keys.map((key) => {
        const [value, set] = useFlag(key);
        return (
          <label key={key} style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => set(e.target.checked)}
            />{' '}
            {key}
          </label>
        );
      })}
    </div>
  );
}
