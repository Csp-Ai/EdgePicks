'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import PredictionTracker from './PredictionTracker';
import matchups from '../mock/demo-matchups.json';

export const DEMO_CAROUSEL_INTERVAL = 6000; // 6s autoplay

const DemoMatchupCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = matchups.length;

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  const start = useCallback(() => {
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, DEMO_CAROUSEL_INTERVAL);
  }, [total]);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    start();
  }, [start]);

  useEffect(() => {
    start();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [start]);

  const handleNext = () => {
    next();
    reset();
  };

  const handlePrev = () => {
    prev();
    reset();
  };

  return (
    <div className="relative" role="region" aria-label="Demo matchups">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {matchups.map((m, i) => (
            <div
              key={i}
              id={`demo-slide-${i}`}
              className="w-full flex-shrink-0 p-4 flex flex-col items-center gap-2"
              aria-hidden={index !== i}
            >
              {index === i && <PredictionTracker onReveal={() => {}} />}
              <div className="text-center">
                <p className="font-semibold">
                  {m.awayTeam} @ {m.homeTeam}
                </p>
                <p className="text-sm text-gray-600">
                  Pick: {m.prediction.winner} ({Math.round(m.prediction.confidence * 100)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handlePrev}
        aria-controls={`demo-slide-${(index - 1 + total) % total}`}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full"
      >
        ‹
      </button>
      <button
        onClick={handleNext}
        aria-controls={`demo-slide-${(index + 1) % total}`}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full"
      >
        ›
      </button>
    </div>
  );
};

export default DemoMatchupCarousel;

