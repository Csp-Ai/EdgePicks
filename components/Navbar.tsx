import React, { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';

const links = [
  { href: '/predictions', label: 'Predictions' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/history', label: 'History' }
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [dismissed, setDismissed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!dismissed) {
      const timer = setTimeout(() => setDismissed(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [dismissed]);

  useEffect(() => {
    const handleRoute = () => setMobileOpen(false);
    router.events.on('routeChangeComplete', handleRoute);
    return () => {
      router.events.off('routeChangeComplete', handleRoute);
    };
  }, [router.events]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <nav
        aria-label="Main navigation"
        className={`p-4 flex items-center justify-between ${!dismissed ? 'mt-12' : ''} relative fixed top-0 left-0 w-full z-40 h-16`}
      >
        {/* Gradient Scroll Fade */}
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-white/80 to-transparent dark:from-gray-900/80 transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Left section */}
        <div className="flex items-center gap-4 relative z-10">
          <button
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="sm:hidden flex flex-col gap-1"
          >
            <span className="w-6 h-0.5 bg-current"></span>
            <span className="w-6 h-0.5 bg-current"></span>
            <span className="w-6 h-0.5 bg-current"></span>
          </button>
          <div className="hidden sm:flex gap-4">
            {links.map(link => (
              <Link key={link.href} href={link.href} className="px-2 py-1 border rounded">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4 relative z-10">
          <ThemeToggle />
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
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-100%' }}
              className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 p-4 flex flex-col gap-2 sm:hidden z-20"
            >
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-2 py-1 border rounded"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

