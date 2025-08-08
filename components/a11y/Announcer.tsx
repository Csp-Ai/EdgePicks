import { createContext, useCallback, useContext, useRef, ReactNode } from 'react';

type Mode = 'polite' | 'assertive';

interface AnnouncerContextValue {
  announce: (message: string, mode?: Mode) => void;
}

const AnnouncerContext = createContext<AnnouncerContextValue | null>(null);

export function useAnnouncer() {
  const ctx = useContext(AnnouncerContext);
  if (!ctx) throw new Error('useAnnouncer must be used within Announcer');
  return ctx.announce;
}

interface AnnouncerProps {
  children: ReactNode;
}

export default function Announcer({ children }: AnnouncerProps) {
  const politeRef = useRef<HTMLDivElement>(null);
  const assertiveRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((message: string, mode: Mode = 'polite') => {
    const el = mode === 'assertive' ? assertiveRef.current : politeRef.current;
    if (!el) return;
    el.textContent = '';
    // Force screen reader to notice changes
    void el.offsetHeight;
    el.textContent = message;
  }, []);

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {children}
      <div aria-live="polite" role="status" className="sr-only" ref={politeRef} />
      <div aria-live="assertive" role="alert" className="sr-only" ref={assertiveRef} />
    </AnnouncerContext.Provider>
  );
}
