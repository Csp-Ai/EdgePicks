import type { AppProps } from 'next/app';
import '../styles/globals.css';
import ThemeToggle from '../components/ThemeToggle';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <header className="p-4 flex justify-end">
        <ThemeToggle />
      </header>
      <Component {...pageProps} />
      <style jsx global>{`
        :focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
}

export default MyApp;
