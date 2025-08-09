import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { flags as defaults, FlagKey } from './experiments';
import { getFlag as baseGetFlag, setFlag as baseSetFlag } from './flags';

type FlagsState = Record<FlagKey, boolean>;
interface FlagsContextValue {
  flags: FlagsState;
  setFlag: (key: FlagKey, value: boolean) => void;
}

const FlagsContext = createContext<FlagsContextValue | undefined>(undefined);

export const FlagsProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [flags, setFlags] = useState<FlagsState>(() => {
    const initial = {} as FlagsState;
    (Object.keys(defaults) as FlagKey[]).forEach((key) => {
      initial[key] = baseGetFlag(key);
    });
    return initial;
  });

  const setFlag = useCallback((key: FlagKey, value: boolean) => {
    baseSetFlag(key, value);
    setFlags((prev) => ({ ...prev, [key]: value }));
  }, []);

  const value = useMemo(() => ({ flags, setFlag }), [flags, setFlag]);

  return <FlagsContext.Provider value={value}>{children}</FlagsContext.Provider>;
};

export function useFlags() {
  const ctx = useContext(FlagsContext);
  if (!ctx) throw new Error('FlagsProvider missing');
  return ctx;
}
