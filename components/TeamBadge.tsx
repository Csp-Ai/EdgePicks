import React, { useState } from 'react';
import Image from 'next/image';

const teamFallbacks: Record<string, string> = {
  "49ers": "🟥 SF",
  "Cowboys": "🔵 DAL",
  "Jets": "🟢 NYJ",
  "Patriots": "🔴 NE",
  "Chiefs": "❤️ KC",
  "Bills": "💙 BUF",
};

export type TeamBadgeProps = {
  team: string;
  logoUrl?: string;
  isWinner?: boolean;
};

const TeamBadge: React.FC<TeamBadgeProps> = ({ team, logoUrl, isWinner }) => {
  const [useFallback, setUseFallback] = useState(false);

  const badgeClasses = `relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center overflow-hidden ${
    isWinner ? 'ring-2 ring-green-400 transition-transform hover:scale-105' : ''
  }`;

  const src = logoUrl || `/logos/${team}.png`;

  if (!useFallback && src) {
    return (
      <div className={badgeClasses}>
        <Image
          src={src}
          alt={`${team} logo`}
          fill
          sizes="(min-width: 640px) 2.5rem, 2rem"
          className="object-cover"
          onError={() => setUseFallback(true)}
        />
      </div>
    );
  }

  const fallback = teamFallbacks[team] || '🏈';
  const [emoji, initials] = fallback.split(' ');

  return (
    <div
      aria-label={team}
      className={`${badgeClasses} bg-gray-100 text-xs font-semibold`}
    >
      <span className="text-lg leading-none">{emoji}</span>
      {initials && <span className="ml-1 leading-none">{initials}</span>}
    </div>
  );
};

export default TeamBadge;

