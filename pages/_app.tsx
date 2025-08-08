import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import '../styles/typography.css';
import '../styles/intelligence.css';
import { ToastProvider } from '../lib/useToast';
import Footer from '../components/Footer';
import AppHeader from '../components/AppHeader';
import BetaRibbon from '../components/BetaRibbon';

let DevOnly: React.ComponentType<{ children: React.ReactNode }> | null = null;
let FocusDock: React.ComponentType | null = null;

if (process.env.NODE_ENV === 'development') {
  DevOnly = require('../components/dev/DevOnly').default;
  FocusDock = require('../components/dev/FocusDock').default;
}

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const showRibbon = process.env.NEXT_PUBLIC_BETA_RIBBON === '1';
  return (
    <SessionProvider session={session}>
      <ToastProvider>
        {showRibbon && <BetaRibbon />}
        <AppHeader />
        <main>
          <Component {...pageProps} />
          <Footer />
        </main>
        {DevOnly && FocusDock && (
          <DevOnly>
            <FocusDock />
          </DevOnly>
        )}
      </ToastProvider>
    </SessionProvider>
  );
}
