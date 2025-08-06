import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import TeamBadge from './TeamBadge';
import ConfidenceMeter from './ConfidenceMeter';
import { formatAgentName } from '../lib/utils';
import type { AgentExecution } from '../lib/flow/runFlow';
import type { ConfidenceMeterProps } from './ConfidenceMeter';

interface UpcomingGame {
  homeTeam: ConfidenceMeterProps['teamA'];
  awayTeam: ConfidenceMeterProps['teamB'];
  confidence: number;
  time: string;
  league: string;
  edgePick: AgentExecution[];
}

const valueProps = [
  'Injury Insights',
  'Line Movement Alerts',
  'Stat Crunches',
  'Trend Analysis',
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const HeroSection: React.FC = () => {
  const { data } = useSWR<UpcomingGame[]>('/api/upcoming-games', fetcher);
  const game = data && data.length > 0 ? data[0] : null;
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
      <div
        className={`max-w-md mx-auto bg-white rounded-xl shadow p-6 transition-transform duration-300 hover:scale-105 ${
          game ? '' : 'animate-pulse'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Today's Edge</h2>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            AI-Powered Pick
          </span>
        </div>
        {game ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TeamBadge team={game.homeTeam.name} />
                <span>{game.homeTeam.name}</span>
                <span className="text-gray-400">vs</span>
                <TeamBadge team={game.awayTeam.name} />
                <span>{game.awayTeam.name}</span>
              </div>
              <time className="text-sm text-gray-500">{game.time}</time>
            </div>
            <ConfidenceMeter
              teamA={game.homeTeam}
              teamB={game.awayTeam}
              confidence={game.confidence}
            />
            <div className="mt-4 space-y-2 text-sm text-left">
              {game.edgePick
                .filter((e) => e.result && e.name !== 'guardianAgent')
                .slice(0, 2)
                .map((e) => (
                  <p key={e.name}>
                    <span className="font-medium">
                      {formatAgentName(e.name)}:
                    </span>{' '}
                    {e.result!.reason}
                  </p>
                ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">Loading matchup...</p>
        )}
      </div>
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

