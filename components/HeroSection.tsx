import React, { useEffect, useState } from 'react';
import NextBigGame from './NextBigGame';

const valueProps = [
  'Injury Insights',
  'Line Movement Alerts',
  'Stat Crunches',
  'Trend Analysis',
];

const HeroSection: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % valueProps.length);
        setVisible(true);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleScroll = () => {
    document
      .getElementById('upcoming-games')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="text-center space-y-8 py-12">
      <h1 className="text-4xl sm:text-5xl font-bold">
        Don’t Bet Blind – AI Agents. Real Reasons. Weekly Picks with an Edge.
      </h1>
      <div className="h-8 text-xl text-blue-700 font-mono">
        <span
          className={`block transition-opacity duration-500 ease-in-out ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {valueProps[index]}
        </span>
      </div>
      <NextBigGame />
      <button
        onClick={handleScroll}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded focus:outline-none transition ring-2 ring-transparent hover:ring-blue-400 focus:ring-blue-400"
      >
        See All Matchups
      </button>
    </section>
  );
};

export default HeroSection;

