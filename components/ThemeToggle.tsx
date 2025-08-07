import React, { useEffect, useState } from 'react';

const storageKey = 'theme';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const stored = localStorage.getItem(storageKey);
    const initial = stored ? stored === 'dark' : mq.matches;
    document.documentElement.classList.toggle('dark', initial);
    setIsDark(initial);

    const listener = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(storageKey)) {
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
    localStorage.setItem(storageKey, next ? 'dark' : 'light');
    setIsDark(next);
  };

  return (
    <button onClick={toggleTheme} aria-label="Toggle dark mode">
      {isDark ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;

