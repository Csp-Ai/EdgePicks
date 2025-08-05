import React, { useEffect, useState } from 'react';

interface Props {
  percent: number; // 0-100
  color?: string;
}

const ScoreBar: React.FC<Props> = ({ percent, color = 'bg-blue-500' }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex-1 h-2 bg-gray-200 rounded">
      <div
        className={`h-full ${color} rounded transition-all duration-500`}
        style={{ width: mounted ? `${percent}%` : 0 }}
      />
    </div>
  );
};

export default ScoreBar;
