"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import upcoming from '../fixtures/demo/upcoming.json';
import agentEvents from '../fixtures/demo/agent-events.json';
import predictions from '../fixtures/demo/predictions.json';
import { registerSW, unregisterSW } from './sw/registerSW';

type DemoModeContext = { enabled: boolean; setEnabled(v: boolean): void };

const DemoModeCtx = createContext<DemoModeContext | undefined>(undefined);

export const DemoModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [enabled, setEnabled] = useState(false);

  const useIsoLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsoLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const original = window.fetch;
    if (!enabled) {
      void unregisterSW();
      window.fetch = original;
      return;
    }
    void registerSW();
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === 'string'
          ? input
          : input instanceof URL
          ? input.toString()
          : 'url' in input
          ? (input as Request).url
          : String(input);
      const path = url.replace(window.location.origin, '');
      const respond = (data: unknown) =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => data,
          text: async () => JSON.stringify(data),
          headers: { get: () => 'application/json' },
        } as any);
      if (path.startsWith('/api/upcoming-games')) {
        return respond(upcoming);
      }
      if (path.startsWith('/api/agent-events')) {
        return respond(agentEvents);
      }
      if (path.startsWith('/api/run-predictions')) {
        return respond(predictions);
      }
      return original(input as any, init);
    };
    return () => {
      window.fetch = original;
    };
  }, [enabled]);

  return (
    <DemoModeCtx.Provider value={{ enabled, setEnabled }}>
      {children}
    </DemoModeCtx.Provider>
  );
};

export const useDemoMode = (): DemoModeContext => {
  const ctx = useContext(DemoModeCtx);
  if (!ctx) throw new Error('useDemoMode must be used within DemoModeProvider');
  return ctx;
};

export type { DemoModeContext };
