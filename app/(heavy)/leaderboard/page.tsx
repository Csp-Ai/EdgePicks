import Image from 'next/image';
import Leaderboard from '../../../components/Leaderboard';

async function LeaderboardContent() {
  // Simulate slow data fetching so the skeleton can stream
  await new Promise((r) => setTimeout(r, 1000));
  return <Leaderboard />;
}

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 space-y-4">
      <div className="flex justify-center">
        <Image
          src="https://a.espncdn.com/i/teamlogos/nfl/500/scorebug/kc.png"
          alt="Featured team logo"
          width={120}
          height={120}
          priority
          fetchPriority="high"
        />
      </div>
      {/* Stream the leaderboard once the data is ready */}
      {/* @ts-expect-error Async Server Component */}
      <LeaderboardContent />
    </main>
  );
}
