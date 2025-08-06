// pages/_app.tsx
import type { AppProps } from 'next/app';
import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '../styles/globals.css';
import '../styles/typography.css';
import Navbar from '../components/Navbar';
import ThemeToggle from '../components/ThemeToggle';
import { ToastProvider } from '../lib/useToast';
import { logUiEvent } from '../lib/logUiEvent';

function Header() {
  const { data: session, status: sessionType } = useSession();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!dismissed) {
      const timer = setTimeout(() => setDismissed(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [dismissed]);

  return (
    <>
      {!dismissed && (
        <div className="fixed top-0 left-0 w-full z-50 bg-green-100 border-b border-green-400 text-green-800 text-sm px-4 py-2 flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          <span className="text-center w-full">🎉 Welcome to EdgePicks Beta</span>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="self-end sm:self-auto"
          >
            ×
          </button>
        </div>
      )}
      <header className={`p-4 flex justify-end gap-4 items-center ${!dismissed ? 'mt-12' : ''}`}>
        <ThemeToggle />
        <Link href="/predictions" className="min-h-[44px] px-4 py-2 border rounded">
          Predictions
        </Link>
        {sessionType === 'loading' ? (
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
              onClick={() => {
                void logUiEvent('sign_out', sessionType, session?.user?.id);
                signOut();
              }}
              className="min-h-[44px] px-4 py-2 border rounded"
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              logUiEvent('sign_in_click', {
                session_type: sessionType,
                user_id: session?.user?.id ?? 'unknown',
              });
              signIn('google');
            }}
            className="min-h-[44px] px-4 py-2 border rounded"
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
      <ToastProvider>
        <Navbar />
        <Header />
        <div className="pt-16">
          <Component {...pageProps} />
        </div>
      </ToastProvider>
    </SessionProvider>
  );
}



