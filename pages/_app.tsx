import type { AppProps } from 'next/app';
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';
import '../styles/globals.css';
import ThemeToggle from '../components/ThemeToggle';

function Header() {
  const { data: session } = useSession();
  return (
    <header className="p-4 flex justify-end gap-4">
      <ThemeToggle />
      {session ? (
        <>
          <span>{session.user?.name}</span>
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
          Sign in
        </button>
      )}
    </header>
  );
}

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
