import React from 'react';
import DevOnly from './DevOnly';
import {
  clientFlagDefaults,
  ClientFlagKey,
  useClientFlag,
} from '../../lib/flags/clientFlags';

export default function FlagSwitch() {
  const keys = Object.keys(clientFlagDefaults) as ClientFlagKey[];
  if (keys.length === 0) return null;

  return (
    <DevOnly>
      <div
        style={{
          position: 'fixed',
          bottom: '0.5rem',
          right: '0.5rem',
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: 4,
          padding: '0.5rem',
          fontSize: '0.8rem',
          zIndex: 1000,
        }}
      >
        {keys.map((key) => {
          const [value, set] = useClientFlag(key);
          return (
            <label key={key} style={{ display: 'block' }}>
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
    </DevOnly>
  );
}
