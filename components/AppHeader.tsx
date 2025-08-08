import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';

export default function AppHeader() {
  let session: ReturnType<typeof useSession>['data'] | null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    session = useSession().data;
  } catch {
    session = null;
  }

  return (
    <header className="border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center p-4">
        <div>
          <Link href="/" className="font-bold">
            EdgePicks
          </Link>
        </div>
        <nav className="flex justify-center gap-4">
          <Link href="/predictions" className="hover:underline">
            Predictions
          </Link>
          <Link href="/leaderboard" className="hover:underline">
            Leaderboard
          </Link>
          <Link href="/history" className="hover:underline">
            History
          </Link>
        </nav>
        <div className="flex justify-end">
          {!session && (
            <button
              onClick={() => signIn('google')}
              className="px-3 py-1 border rounded"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

