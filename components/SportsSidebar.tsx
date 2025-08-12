interface SportsSidebarProps {
  leagues: Array<{
    id: string;
    name: string;
    icon: string;
    gameCount?: number;
  }>;
  activeLeague: string;
  onLeagueChange: (league: string) => void;
}

export default function SportsSidebar({
  leagues,
  activeLeague,
  onLeagueChange
}: SportsSidebarProps) {
  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-800 p-4 hidden md:block">
      <nav className="space-y-1">
        {leagues.map(league => (
          <button
            key={league.id}
            onClick={() => onLeagueChange(league.id)}
            className={`
              w-full flex items-center space-x-3 px-4 py-2 text-sm rounded-lg
              ${activeLeague === league.id
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }
            `}
          >
            <span className="text-xl">{league.icon}</span>
            <span className="font-medium">{league.name}</span>
            {league.gameCount !== undefined && (
              <span className={`
                ml-auto px-2 py-0.5 text-xs rounded-full
                ${activeLeague === league.id
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }
              `}>
                {league.gameCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-8 px-4">
        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
          Trending Picks
        </h4>
        <div className="space-y-2">
          {/* Add trending picks here */}
        </div>
      </div>
    </aside>
  );
}
