import React, { useEffect, useState } from 'react';

type Props = {
  confidence: number; // value between 0–100
};

const AnimatedConfidenceBar: React.FC<Props> = ({ confidence }) => {
  const [fill, setFill] = useState(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    setFill(0);
    setDisplay(0);

    const duration = 700;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = confidence / steps;
    let current = 0;

    const counter = setInterval(() => {
      current += increment;
      if (current >= confidence) {
        current = confidence;
        clearInterval(counter);
      }
      setDisplay(Math.round(current));
    }, stepTime);

    const timer = setTimeout(() => setFill(confidence), 50);

    return () => {
      clearInterval(counter);
      clearTimeout(timer);
    };
  }, [confidence]);

  return (
    <div aria-label={`Confidence ${confidence}%`}>
      <div className="flex justify-between items-center mb-1">
        <span className="font-semibold">Confidence</span>
        <span className="font-bold">{display}%</span>
      </div>
      <div className="relative w-full h-3 bg-gray-200 rounded overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-positive to-negative opacity-20 blur-sm animate-pulse" />
        <div
          className="relative h-full bg-gradient-to-r from-positive to-negative transition-[width] duration-700 ease-out"
          style={{ width: `${fill}%` }}
        >
          <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-gray-800 text-white text-xs px-1 py-0.5 rounded shadow">
            {display}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnimatedConfidenceBar;
