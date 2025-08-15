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
  const [state, setState] = useState<T>(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.getState());
    });
    return unsubscribe;
  }, [store]);

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <details>
      <summary>{label}</summary>
      <pre className="text-xs overflow-auto">
        {JSON.stringify(state, null, 2)}
      </pre>
    </details>
  );
}
