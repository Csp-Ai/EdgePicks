import NoPrefetchLink from '@/components/NoPrefetchLink';

export default function StickyNavBar() {
  return (
    <nav aria-label="Quick Nav" className="fixed inset-x-0 bottom-3 z-40">
      <div className="mx-auto max-w-5xl">
        <div className="mx-3 rounded-2xl border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow">
          <ul className="flex items-center justify-around p-2 text-sm">
            <li>
              <a href="#matchups" className="hover:underline">
                Matchups
              </a>
            </li>
            <li>
              <a href="#live-agents" className="hover:underline">
                Agents
              </a>
            </li>
            <li>
              <NoPrefetchLink href="/leaderboard" className="hover:underline">
                Leaderboard
              </NoPrefetchLink>
            </li>
            <li>
              <NoPrefetchLink href="/predictions" className="hover:underline">
                My Picks
              </NoPrefetchLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
