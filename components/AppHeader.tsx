import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';

interface Props {
  /**
   * Optional override for auth state in tests. When undefined, `useSession` is
   * used to detect authentication.
   */
  isAuthenticated?: boolean;
}

export default function AppHeader({ isAuthenticated }: Props) {
  let authed = isAuthenticated ?? false;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    authed = !!useSession().data;
  } catch {
    // ignore – use provided prop
  }

  return (
    <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-2 sm:gap-0 h-full sm:h-16 py-4 sm:py-0">
          <div className="flex items-center justify-center sm:justify-start">
            <Link href="/" className="beta-h1">
              EdgePicks
            </Link>
          </div>
          <nav className="order-3 sm:order-2 flex justify-center gap-6" role="navigation">
            <Link href="/#live-games" className="py-2 hover:underline">
              Live
            </Link>
            <Link href="/history" className="py-2 hover:underline">
              History
            </Link>
            <Link href="/leaderboard" className="py-2 hover:underline">
              Leaderboard
            </Link>
          </nav>
          <div className="order-2 sm:order-3 flex justify-end items-center min-w-[150px] min-h-[44px]">
            {!authed && (
              <button
                onClick={() => signIn('google')}
                className="px-4 py-2 rounded-full bg-blue-600 text-white hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

