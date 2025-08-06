// pages/_app.tsx
import type { AppProps } from 'next/app';
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '../styles/globals.css';
import ThemeToggle from '../components/ThemeToggle';

function Header() {
  const { data: session, status } = useSession();
  const [dismissed, setDismissed] = useState(false);
  return (
    <>
      {process.env.NODE_ENV === 'development' && session && !dismissed && (
        <div className="bg-green-100 border border-green-400 text-green-800 text-sm px-4 py-2 rounded mb-2 flex justify-between items-center">
          <span>🎉 Welcome to EdgePicks Beta – Running Locally</span>
          <button onClick={() => setDismissed(true)} aria-label="Dismiss">×</button>
        </div>
      )}
      <header className="p-4 flex justify-end gap-4 items-center">
        <ThemeToggle />
        <Link href="/predictions" className="px-2 py-1 border rounded">
          Predictions
        </Link>
        {status === 'loading' ? (
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        ) : session ? (
          <>
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user?.name ? `${session.user.name}'s avatar` : 'User avatar'}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm">
                {session.user?.name ? session.user.name.charAt(0) : '?'}
              </div>
            )}
            <span>{session.user?.name || 'Anonymous'}</span>
            <button
              onClick={() => signOut()}
              className="px-2 py-1 border rounded"
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn('google')}
            className="px-2 py-1 border rounded"
          >
            Sign in with Google
          </button>
        )}
      </header>
    </>
  );
}

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
