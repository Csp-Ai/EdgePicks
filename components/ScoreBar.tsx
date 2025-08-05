import React, { useEffect, useState } from 'react';

interface Props {
  percent: number; // 0-100
  color?: string;
  className?: string;
}

const ScoreBar: React.FC<Props> = ({ percent, color = 'bg-blue-500', className }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(percent));
    return () => cancelAnimationFrame(id);
  }, [percent]);

  return (
    <div
      className={`flex-1 min-w-0 h-2 bg-gray-200 rounded overflow-hidden ${
        className || ''
      }`}
    >
      <div
        className={`h-full ${color} transition-all duration-500 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

export default ScoreBar;
