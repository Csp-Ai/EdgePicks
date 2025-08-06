import React, { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 h-16">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-white/80 to-transparent dark:from-gray-900/80 transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="h-full px-4 flex justify-end gap-4 items-center relative">
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
            <button onClick={() => signOut()} className="px-2 py-1 border rounded">
              Sign out
            </button>
          </>
        ) : (
          <button onClick={() => signIn('google')} className="px-2 py-1 border rounded">
            Sign in with Google
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
