import NoPrefetchLink from '@/components/NoPrefetchLink';
import { useSession, signIn } from 'next-auth/react';

interface Props {
  /**
   * Optional override for auth state in tests. When undefined, `useSession` is
   * used to detect authentication.
   */
  isAuthenticated?: boolean;
}

export default function AppHeader({ isAuthenticated }: Props) {
  const { data: session } = useSession();
  const authed = isAuthenticated ?? !!session;

  return (
    <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-2 sm:gap-0 h-full sm:h-16 py-4 sm:py-0">
          <div className="flex items-center justify-center sm:justify-start">
            <NoPrefetchLink href="/" className="beta-h1">
              EdgePicks
            </NoPrefetchLink>
          </div>
          <nav className="order-3 sm:order-2 flex justify-center gap-6" role="navigation">
            <NoPrefetchLink href="/#live-games" className="py-2 hover:underline">
              Live
            </NoPrefetchLink>
            <NoPrefetchLink href="/history" className="py-2 hover:underline">
              History
            </NoPrefetchLink>
            <NoPrefetchLink href="/leaderboard" className="py-2 hover:underline">
              Leaderboard
            </NoPrefetchLink>
          </nav>
          <div className="order-2 sm:order-3 flex justify-end items-center min-w-[150px] min-h-[44px]">
            {!authed && (
              <button
                onClick={() => signIn('credentials')}
                className="px-4 py-2 rounded-full bg-blue-600 text-white hover:opacity-90 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

