import { useCallback } from 'react';
import { useFlags } from './FlagsProvider';
import { FlagKey } from './experiments';

export function useFlag(key: FlagKey): [boolean, (value: boolean) => void] {
  const { flags, setFlag } = useFlags();
  const setter = useCallback((value: boolean) => setFlag(key, value), [setFlag, key]);
  return [flags[key], setter];
}
