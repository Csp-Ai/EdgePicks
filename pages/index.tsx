import React from 'react';
import MatchupCard from '../components/MatchupCard';
import { mockMatchups } from '../lib/mock/agentOutput';

const HomePage: React.FC = () => (
  <main className="p-4 flex flex-col gap-4 items-center">
    {mockMatchups.map((m, idx) => (
      <MatchupCard key={idx} matchup={m} />
    ))}
  </main>
);

export default HomePage;
