import React, { useEffect, useState } from 'react';
import { getStoredTheme, setStoredTheme } from '@/lib/theme/persist';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const stored = getStoredTheme();
    const initial = stored ? stored === 'dark' : mq.matches;
    document.documentElement.classList.toggle('dark', initial);
    setIsDark(initial);

    const listener = (e: MediaQueryListEvent) => {
      if (!getStoredTheme()) {
        document.documentElement.classList.toggle('dark', e.matches);
        setIsDark(e.matches);
      }
    };
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const next = html.classList.toggle('dark');
    setStoredTheme(next ? 'dark' : 'light');
    setIsDark(next);
  };

  return (
    <button onClick={toggleTheme} aria-label="Toggle dark mode">
      {isDark ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;

