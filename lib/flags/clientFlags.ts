import { useCallback, useState } from 'react';

const STORAGE_PREFIX = 'cf.';

export const clientFlagDefaults = {
  demoFeature: false,
} as const;

export type ClientFlagKey = keyof typeof clientFlagDefaults;

export function getClientFlag(key: ClientFlagKey): boolean {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_PREFIX + key);
    if (stored != null) {
      return stored === 'on';
    }
  }
  return clientFlagDefaults[key];
}

export function setClientFlag(key: ClientFlagKey, value: boolean): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_PREFIX + key, value ? 'on' : 'off');
  }
}

export function useClientFlag(
  key: ClientFlagKey,
): [boolean, (value: boolean) => void] {
  const [flag, setFlag] = useState<boolean>(() => getClientFlag(key));
  const setter = useCallback(
    (value: boolean) => {
      setClientFlag(key, value);
      setFlag(value);
    },
    [key],
  );

  return [flag, setter];
}
