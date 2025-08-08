import React from 'react';
import useSWR from 'swr';

interface ReflectionCounts {
  [agent: string]: Record<string, number>;
}

const FALLBACK: ReflectionCounts = {
  injuryScout: { completed: 5, pending: 1 },
  lineWatcher: { completed: 3, pending: 2 },
};

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Network error');
    return res.json();
  });

const AgentExplainers: React.FC = () => {
  const { data, error } = useSWR<ReflectionCounts>(
    '/api/reflections',
    fetcher,
    { fallbackData: FALLBACK }
  );

  const counts = data ?? FALLBACK;
  const sample = Boolean(error);

  return (
    <section aria-labelledby="agents-heading">
      <h2 id="agents-heading" className="text-lg font-semibold">
        Agent Explainers
      </h2>
      <div className="mt-2 space-y-4">
        {Object.entries(counts).map(([agent, states]) => (
          <div key={agent}>
            <h3 className="font-medium">{agent}</h3>
            <ul className="ml-5 list-disc">
              {Object.entries(states).map(([state, count]) => (
                <li key={state}>
                  {state}: {count}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {sample && (
        <p className="text-sm text-gray-500 italic">Using sample data</p>
      )}
    </section>
  );
};

export default AgentExplainers;
