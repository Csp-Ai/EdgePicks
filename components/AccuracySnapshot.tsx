"use client";

import { useEffect, useRef, useState } from 'react';
import nextDynamic from 'next/dynamic';
import { apiGet } from '@/lib/api';

interface AccuracyData {
  last30Days: number;
  last90Days: number;
  sparkline: number[];
}

const LineChart = nextDynamic(async () => (await import('recharts')).LineChart as any, { ssr: false }) as any;
const Line = nextDynamic(async () => (await import('recharts')).Line as any, { ssr: false }) as any;
const XAxis = nextDynamic(async () => (await import('recharts')).XAxis as any, { ssr: false }) as any;
const YAxis = nextDynamic(async () => (await import('recharts')).YAxis as any, { ssr: false }) as any;
const Tooltip = nextDynamic(async () => (await import('recharts')).Tooltip as any, { ssr: false }) as any;
const ResponsiveContainer = nextDynamic(async () => (await import('recharts')).ResponsiveContainer as any, { ssr: false }) as any;

export default function AccuracySnapshot() {
  const [accuracy, setAccuracy] = useState<AccuracyData | null>(null);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        io.disconnect();
      }
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    (async () => {
      try {
        const data = await apiGet<AccuracyData>('/api/accuracy');
        setAccuracy(data);
      } catch {
        setAccuracy(null);
      }
    })();
  }, [visible]);

  if (!visible) {
    return <div ref={ref} className="p-4 text-gray-500">Loading accuracy data...</div>;
  }

  if (!accuracy) {
    return <div ref={ref} className="p-4 text-gray-500">Loading accuracy data...</div>;
  }

  const chartData = accuracy.sparkline.map((value, index) => ({ index, value }));

  return (
    <div ref={ref} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">Accuracy Snapshot</h3>
      <div className="mt-4 h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="index" hide />
            <YAxis domain={[0, 1]} hide />
            <Tooltip formatter={(v: number) => `${Math.round(v * 100)}%`} />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Last 30 Days: {accuracy.last30Days.toFixed(2)}%
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Last 90 Days: {accuracy.last90Days.toFixed(2)}%
        </p>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={() => (window.location.href = '/leaderboard')}
      >
        See Leaderboard
      </button>
    </div>
  );
}
