"use client";

import React, { useMemo, useState, useEffect } from 'react';
import useSWR from 'swr';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export interface AccuracyPoint {
  date: string;
  overall: number;
  [agent: string]: number | string;
}

export interface AccuracyHistory {
  history: AccuracyPoint[];
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = () => setPrefers(media.matches);
    listener();
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);
  return prefers;
}

const colors = ['#8884d8', '#82ca9d', '#ff7300', '#ff0000', '#00bcd4'];

const AccuracyTrend: React.FC<{ fallbackData: AccuracyHistory }> = ({ fallbackData }) => {
  const { data } = useSWR<AccuracyHistory>(
    '/api/accuracy-history',
    fetcher,
    { fallbackData }
  );
  const [range, setRange] = useState<'1W' | '1M' | 'All'>('1M');
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const prefersReducedMotion = usePrefersReducedMotion();

  const history = data?.history ?? [];

  const agents = useMemo(() => {
    if (!history[0]) return [];
    return Object.keys(history[0]).filter(
      (k) => k !== 'date' && k !== 'overall'
    );
  }, [history]);

  const filtered = useMemo(() => {
    if (history.length === 0) return [];
    if (range === 'All') return history;
    const latest = new Date(history[history.length - 1].date);
    const cutoff = new Date(latest);
    cutoff.setDate(cutoff.getDate() - (range === '1W' ? 7 : 30));
    return history.filter((p) => new Date(p.date) >= cutoff);
  }, [history, range]);

  const toggleSeries = (key: string) =>
    setHidden((h) => ({ ...h, [key]: !h[key] }));

  return (
    <div>
      <div role="group" aria-label="Time range" className="mb-4 flex gap-2">
        {(['1W', '1M', 'All'] as const).map((label) => (
          <button
            key={label}
            onClick={() => setRange(label)}
            className={`px-2 py-1 border rounded ${
              range === label ? 'bg-gray-200' : ''
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <LineChart
        width={600}
        height={300}
        data={filtered}
        role="img"
        aria-label="Accuracy over time"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 100]} />
        <Tooltip wrapperStyle={{ outline: 'none' }} />
        <Legend
          content={({ payload }) => (
            <div className="flex gap-2 flex-wrap">
              {payload?.map((entry) => (
                <button
                  key={String(entry.dataKey)}
                  onClick={() => toggleSeries(entry.dataKey as string)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter')
                      toggleSeries(entry.dataKey as string);
                  }}
                  className="flex items-center gap-1 border px-2 py-1 rounded"
                >
                  <span
                    aria-hidden="true"
                    className="w-3 h-3 inline-block"
                    style={{ background: entry.color }}
                  />
                  {entry.value}
                </button>
              ))}
            </div>
          )}
        />
        <Line
          type="monotone"
          dataKey="overall"
          name="Overall"
          stroke="#000"
          isAnimationActive={!prefersReducedMotion}
          hide={hidden['overall']}
          data-testid="line-overall"
        />
        {agents.map((agent, i) => (
          <Line
            key={agent}
            type="monotone"
            dataKey={agent}
            name={agent}
            stroke={colors[i % colors.length]}
            isAnimationActive={!prefersReducedMotion}
            hide={hidden[agent]}
            data-testid={`line-${agent}`}
          />
        ))}
      </LineChart>
      <span data-testid="point-count" className="sr-only">{filtered.length}</span>
    </div>
  );
};

export default AccuracyTrend;
