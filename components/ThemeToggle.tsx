import React, { useEffect, useState } from 'react';

const storageKey = 'theme';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
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

