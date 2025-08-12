'use client';
import { createContext, useContext, useMemo } from 'react';

const DemoModeCtx = createContext<boolean>(false);

export function DemoModeProvider({
  enabled = false,
  children,
}: {
  enabled?: boolean;
  children: React.ReactNode;
}) {
  // IMPORTANT: We no longer intercept fetch or import fixtures here.
  const value = useMemo(() => !!enabled, [enabled]);
  return <DemoModeCtx.Provider value={value}>{children}</DemoModeCtx.Provider>;
}

export function useDemoMode() {
  return useContext(DemoModeCtx);
}
