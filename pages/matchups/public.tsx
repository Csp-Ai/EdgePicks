import React from 'react';
import UpcomingGamesPanel from '../../components/UpcomingGamesPanel';

const PublicMatchupsPage: React.FC = () => (
  <main className="min-h-screen bg-gray-50 p-6 space-y-4">
    <p className="text-center text-gray-700">
      Sign in to unlock full predictions. Here are a few upcoming matchups:
    </p>
    <UpcomingGamesPanel maxVisible={3} />
  </main>
);

export default PublicMatchupsPage;
