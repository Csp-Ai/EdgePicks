import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  ReactNode,
} from 'react';

export interface TelemetryEvent {
  type: string;
  [key: string]: any;
}

type TelemetryHandler = (event: TelemetryEvent) => void;

const queue: TelemetryEvent[] = [];

const TelemetryContext = createContext<TelemetryHandler>((event) => {
  queue.push(event);
});

interface Props {
  children: ReactNode;
  onEvent?: TelemetryHandler;
}

export const TelemetryProvider = ({ children, onEvent }: Props) => {
  const handler = useCallback<TelemetryHandler>(
    (event) => {
      if (onEvent) {
        onEvent(event);
      } else {
        queue.push(event);
      }
    },
    [onEvent]
  );

  useEffect(() => {
    if (onEvent && queue.length > 0) {
      const pending = queue.splice(0);
      pending.forEach((e) => onEvent(e));
    }
  }, [onEvent]);

  return (
    <TelemetryContext.Provider value={handler}>
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => useContext(TelemetryContext);

export function flushTelemetryQueue(): TelemetryEvent[] {
  const pending = queue.splice(0);
  return pending;
}

export function getTelemetryQueue(): TelemetryEvent[] {
  return queue;
}

export type { TelemetryHandler };
