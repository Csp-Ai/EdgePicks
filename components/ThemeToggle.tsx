import React, { useEffect, useState } from 'react';

const themeKey = 'theme';
const colorKey = 'colorblind';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [isColorblind, setIsColorblind] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    setIsDark(html.classList.contains('dark'));
    setIsColorblind(html.classList.contains('colorblind'));
  }, []);

  const toggleDark = () => {
    const html = document.documentElement;
    const next = html.classList.toggle('dark');
    localStorage.setItem(themeKey, next ? 'dark' : 'light');
    setIsDark(next);
  };

  const toggleColorblind = () => {
    const html = document.documentElement;
    const next = html.classList.toggle('colorblind');
    localStorage.setItem(colorKey, next ? 'colorblind' : 'normal');
    setIsColorblind(next);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={toggleDark}
        aria-label="Toggle dark mode"
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
      >
        {isDark ? '🌙' : '☀️'}
      </button>
      <button
        onClick={toggleColorblind}
        aria-label="Toggle colorblind-friendly colors"
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
      >
        {isColorblind ? '👁️‍🗨️' : '👁️'}
      </button>
    </div>
  );
};

export default ThemeToggle;

