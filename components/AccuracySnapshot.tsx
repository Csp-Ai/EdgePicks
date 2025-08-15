"use client";

import React, { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

interface AccuracyData {
  last30Days: number;
  last90Days: number;
  sparkline: number[];
}

const AccuracySnapshot: React.FC = () => {
  const [accuracy, setAccuracy] = useState<AccuracyData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccuracyData = async () => {
      try {
        const data = await apiGet<AccuracyData>('/api/accuracy');
        setAccuracy(data);
      } catch (err) {
        console.error('Failed to fetch accuracy data:', err);
        setError('Failed to load accuracy data.');
      }
    };

    fetchAccuracyData();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!accuracy) {
    return <div className="p-4 text-gray-500">Loading accuracy data...</div>;
  }

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">Accuracy Snapshot</h3>
      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Last 30 Days: {accuracy.last30Days.toFixed(2)}%
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Last 90 Days: {accuracy.last90Days.toFixed(2)}%
        </p>
        <div className="flex items-center space-x-1">
          {accuracy.sparkline.map((value, index) => (
            <div
              key={index}
              className="h-2 bg-blue-500 rounded"
              style={{ width: '10px', height: `${value * 100}%` }}
            ></div>
          ))}
        </div>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={() => window.location.href = '/leaderboard'}
      >
        See Leaderboard
      </button>
    </div>
  );
};

export default AccuracySnapshot;
