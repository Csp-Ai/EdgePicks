import React from 'react';
import DevOnly from './DevOnly';
import {
  clientFlagDefaults,
  ClientFlagKey,
  useClientFlag,
} from '@/lib/flags/clientFlags';

function FlagToggle({ flag }: { flag: ClientFlagKey }) {
  const [value, set] = useClientFlag(flag);
  return (
    <label style={{ display: 'block' }}>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => set(e.target.checked)}
      />{' '}
      {flag}
    </label>
  );
}

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
        {keys.map((key) => (
          <FlagToggle key={key} flag={key} />
        ))}
      </div>
    </DevOnly>
  );
}
