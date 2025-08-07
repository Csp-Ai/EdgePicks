import { useEffect, useRef, useState } from 'react';

interface Options {
  enabled?: boolean;
}

interface HookState<T = any> {
  status: 'idle' | 'connecting' | 'open' | 'error';
  events: T[];
  lastMessage: T | null;
  error: Event | null;
  reconnect: () => void;
}

export default function useEventSource(
  url: string | null,
  options: Options = {}
): HookState {
  const { enabled = true } = options;
  const [events, setEvents] = useState<any[]>([]);
  const [lastMessage, setLastMessage] = useState<any | null>(null);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'open' | 'error'>(
    'idle'
  );
  const [error, setError] = useState<Event | null>(null);
  const esRef = useRef<EventSource | null>(null);
  const retryRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const connect = () => {
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
            const data = JSON.parse(line);
            setEvents((prev) => [...prev, data]);
            setLastMessage(data);
            setStatus('open');
            retryRef.current = 0;
          });
      } catch (e) {
        // ignore parse errors (keep-alives)
      }
    };
    es.onerror = (e) => {
      setStatus('error');
      setError(e as any);
      es.close();
      if (retryRef.current < 5) {
        const delay = Math.min(2000, 250 * Math.pow(2, retryRef.current));
        retryRef.current += 1;
        timeoutRef.current = setTimeout(connect, delay);
      }
    };
    esRef.current = es;
  };

  const reconnect = () => {
    retryRef.current = 0;
    esRef.current?.close();
    connect();
  };

  useEffect(() => {
    if (url && enabled) {
      reconnect();
    }
    return () => {
      esRef.current?.close();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, enabled]);

  return { status, events, lastMessage, error, reconnect };
}
