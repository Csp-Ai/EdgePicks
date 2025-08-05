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

  const barColor =
    confidence >= 80
      ? 'bg-green-500'
      : confidence >= 55
      ? 'bg-yellow-500'
      : 'bg-red-500';

  return (
    <div aria-label={`Confidence ${confidence}%`}>
      <div className="flex justify-between items-center mb-1">
        <span className="font-semibold">Confidence</span>
        <span className="font-bold">{display}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded">
        <div
          className={`h-full ${barColor} rounded transition-all duration-700 ease-in-out`}
          style={{ width: `${fill}%` }}
        />
      </div>
    </div>
  );
};

export default AnimatedConfidenceBar;
