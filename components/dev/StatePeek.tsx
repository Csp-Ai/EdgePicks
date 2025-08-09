import React, { useEffect, useState } from 'react';

interface Store<T> {
  getState: () => T;
  subscribe: (listener: () => void) => () => void;
}

interface StatePeekProps<T> {
  store: Store<T>;
  label?: string;
}

export default function StatePeek<T>({ store, label = 'State' }: StatePeekProps<T>) {
  if (process.env.NODE_ENV === 'production') return null;

  const [state, setState] = useState<T>(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.getState());
    });
    return unsubscribe;
  }, [store]);

  return (
    <details>
      <summary>{label}</summary>
      <pre className="text-xs overflow-auto">
        {JSON.stringify(state, null, 2)}
      </pre>
    </details>
  );
}
