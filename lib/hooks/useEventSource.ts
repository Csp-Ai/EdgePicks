import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

interface Options {
  enabled?: boolean;
}

interface HookState<T = unknown> {
  status: 'idle' | 'connecting' | 'open' | 'error';
  events: T[];
  lastMessage: T | null;
  error: Event | null;
  reconnect: () => void;
}

export default function useEventSource<T = unknown>(
  url: string | null,
  options: Options = {}
): HookState<T> {
  const { enabled = true } = options;
  const [events, setEvents] = useState<T[]>([]);
  const [lastMessage, setLastMessage] = useState<T | null>(null);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'open' | 'error'>(
    'idle'
  );
  const [error, setError] = useState<Event | null>(null);
  const esRef = useRef<EventSource | null>(null);
  const retryRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const router = useRouter();

  const connect = useCallback(() => {
    if (!url || !enabled) return;
    setStatus('connecting');
    const es = new EventSource(url);
    es.onmessage = (ev) => {
      try {
        ev.data
          .split('\n')
          .map((l: string) => l.trim())
          .filter(Boolean)
          .forEach((line: string) => {
            const data = JSON.parse(line) as T;
            setEvents((prev) => [...prev, data]);
            setLastMessage(data);
            setStatus('open');
            retryRef.current = 0;
            lastActivityRef.current = Date.now();
          });
      } catch (e) {
        // ignore parse errors (keep-alives)
      }
    };
    es.onerror = (e) => {
      setStatus('error');
      setError(e as Event);
      es.close();
      if (retryRef.current < 5) {
        const base = Math.min(2000, 250 * Math.pow(2, retryRef.current));
        const jitter = retryRef.current === 0 ? 0 : Math.random() * 100;
        retryRef.current += 1;
        timeoutRef.current = setTimeout(connect, base + jitter);
      }
    };
    esRef.current = es;
    lastActivityRef.current = Date.now();
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    heartbeatRef.current = setInterval(() => {
      if (Date.now() - lastActivityRef.current > 30000) {
        esRef.current?.close();
        connect();
      }
    }, 30000);
  }, [url, enabled]);

  const reconnect = useCallback(() => {
    retryRef.current = 0;
    esRef.current?.close();
    connect();
  }, [connect]);

  useEffect(() => {
    if (url && enabled) {
      reconnect();
    }
    return () => {
      esRef.current?.close();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    };
  }, [url, enabled, reconnect]);

  useEffect(() => {
    if (!router?.events) return;
    const handleRoute = () => {
      esRef.current?.close();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
    router.events.on('routeChangeStart', handleRoute);
    return () => {
      router.events.off('routeChangeStart', handleRoute);
    };
  }, [router]);

  return { status, events, lastMessage, error, reconnect };
}
