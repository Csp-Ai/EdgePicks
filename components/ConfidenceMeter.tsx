import React, { useEffect, useState } from 'react';

interface Props {
  /** confidence value in percent (0-100) */
  value: number;
  /** optional label to show above bar */
  label?: string;
  /** whether to show numeric percentage label */
  showLabel?: boolean;
  /** gradient classes for the bar */
  gradientClass?: string;
  className?: string;
}

const ConfidenceMeter: React.FC<Props> = ({
  value,
  label = 'Confidence',
  showLabel = true,
  gradientClass = 'from-green-400 to-red-500',
  className = '',
}) => {
  const [fill, setFill] = useState(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    setFill(0);
    setDisplay(0);
    const duration = 700;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = value / steps;
    let current = 0;
    const counter = setInterval(() => {
      current += increment;
      if (current >= value) {
        current = value;
        clearInterval(counter);
      }
      setDisplay(Math.round(current));
    }, stepTime);
    const timer = setTimeout(() => setFill(value), 50);
    return () => {
      clearInterval(counter);
      clearTimeout(timer);
    };
  }, [value]);

  return (
    <div aria-label={`Confidence ${value}%`} className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="font-semibold">{label}</span>
          <span className="font-bold">{display}%</span>
        </div>
      )}
      <div className="relative w-full h-3 bg-gray-200 rounded overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${gradientClass} opacity-20 blur-sm animate-pulse`}
        />
        <div
          className={`relative h-full bg-gradient-to-r ${gradientClass} transition-[width] duration-700 ease-out`}
          style={{ width: `${fill}%` }}
        >
          {showLabel && (
            <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-gray-800 text-white text-xs px-1 py-0.5 rounded shadow">
              {display}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfidenceMeter;

