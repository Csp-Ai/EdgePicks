import React from 'react';
import useSWR from 'swr';

interface AccuracyPoint {
  date: string;
  overall: number;
}

interface AccuracyHistory {
  history: AccuracyPoint[];
}

const FALLBACK: AccuracyHistory = {
  history: [
    { date: '2024-01-01', overall: 60 },
    { date: '2024-01-02', overall: 62 },
    { date: '2024-01-03', overall: 64 },
    { date: '2024-01-04', overall: 65 },
    { date: '2024-01-05', overall: 67 },
    { date: '2024-01-06', overall: 69 },
    { date: '2024-01-07', overall: 70 },
  ],
};

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Network error');
    return res.json();
  });

const TrustSummary: React.FC = () => {
  const { data, error } = useSWR<AccuracyHistory>(
    '/api/accuracy-history',
    fetcher,
    { fallbackData: FALLBACK }
  );

  const history = data?.history ?? FALLBACK.history;
  const week = history.slice(-7);
  const latest = week[week.length - 1]?.overall ?? 0;
  const change = latest - week[0]?.overall;
  const sample = Boolean(error);

  const points = week
    .map((p, i) => `${(i / (week.length - 1)) * 100},${100 - p.overall}`)
    .join(' ');

  return (
    <section aria-labelledby="accuracy-heading">
      <h2 id="accuracy-heading" className="text-lg font-semibold">
        Accuracy
      </h2>
      <svg
        width="200"
        height="50"
        viewBox="0 0 100 100"
        role="img"
        aria-label="Accuracy last 7 days"
        className="mt-2"
      >
        <polyline
          points={points}
          fill="none"
          stroke="#4f46e5"
          strokeWidth={2}
        />
      </svg>
      <p className="mt-2">
        Overall: {latest}% ({change >= 0 ? '+' : ''}
        {change}% last 7d)
      </p>
      {sample && (
        <p className="text-sm text-gray-500 italic">Using sample data</p>
      )}
    </section>
  );
};

export default TrustSummary;
