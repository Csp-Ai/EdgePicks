import React, { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

interface WeeklyAccuracy {
  week: string;
  accuracy: number;
}

const HistoricalAccuracyBar: React.FC = () => {
  const [accuracyHistory, setAccuracyHistory] = useState<WeeklyAccuracy[]>([]);

  useEffect(() => {
    const fetchAccuracyHistory = async () => {
      try {
        const data = await apiGet<{ data: WeeklyAccuracy[] }>('/api/accuracy-history');
        setAccuracyHistory(data.data);
      } catch (error) {
        console.error('Failed to fetch accuracy history:', error);
      }
    };

    fetchAccuracyHistory();
  }, []);

  return (
    <div className="historical-accuracy-bar">
      <h3 className="text-lg font-semibold">Historical Accuracy</h3>
      <div className="flex space-x-2 mt-2">
        {accuracyHistory.map((entry) => (
          <div key={entry.week} className="flex-1">
            <div
              className="h-8 bg-blue-500"
              style={{ height: `${entry.accuracy * 100}%` }}
              title={`Week: ${entry.week}, Accuracy: ${(entry.accuracy * 100).toFixed(2)}%`}
            ></div>
            <p className="text-xs text-center mt-1">{entry.week}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoricalAccuracyBar;
