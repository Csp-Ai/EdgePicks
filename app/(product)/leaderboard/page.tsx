'use client';

import Image from 'next/image';
import Leaderboard from '@/components/Leaderboard';
export const revalidate = 0 as const;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

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
      <Leaderboard />
    </main>
  );
}
