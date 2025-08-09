'use client';

import React, { useContext, useEffect, useState } from 'react';
import { getStoredTheme, setStoredTheme } from '../../lib/theme/persist';
import { I18nContext, Locale, locales } from '../../lib/i18n/config';

const LOW_IMPACT_KEY = 'low-impact';
const LOCALE_KEY = 'locale';

export default function SettingsDrawer() {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [lowImpact, setLowImpact] = useState(false);
  const { locale, setLocale } = useContext(I18nContext);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = getStoredTheme();
    const initialDark = storedTheme ? storedTheme === 'dark' : mq.matches;
    document.documentElement.classList.toggle('dark', initialDark);
    setIsDark(initialDark);

    const storedLow = localStorage.getItem(LOW_IMPACT_KEY) === '1';
    setLowImpact(storedLow);
    document.documentElement.classList.toggle('low-impact', storedLow);

    const storedLocale = localStorage.getItem(LOCALE_KEY) as Locale | null;
    if (storedLocale && storedLocale !== locale) {
      setLocale(storedLocale);
    }
  }, [locale, setLocale]);

  const toggleTheme = () => {
    const next = !isDark;
    document.documentElement.classList.toggle('dark', next);
    setStoredTheme(next ? 'dark' : 'light');
    setIsDark(next);
  };

  const toggleLowImpact = () => {
    const next = !lowImpact;
    document.documentElement.classList.toggle('low-impact', next);
    localStorage.setItem(LOW_IMPACT_KEY, next ? '1' : '0');
    setLowImpact(next);
  };

  const changeLanguage = async (newLocale: Locale) => {
    await setLocale(newLocale);
    localStorage.setItem(LOCALE_KEY, newLocale);
  };

  return (
    <>
      <button
        className="fixed bottom-4 right-4 rounded-full bg-blue-600 text-white p-4 shadow-lg"
        onClick={() => setOpen(o => !o)}
        aria-label="Open settings"
      >
        ⚙️
      </button>
      {open && (
        <div className="fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 p-4 shadow-lg z-50">
          <h2 className="text-lg font-bold mb-4">Settings</h2>
          <label className="flex items-center justify-between mb-4">
            <span>Dark mode</span>
            <input type="checkbox" checked={isDark} onChange={toggleTheme} />
          </label>
          <label className="flex items-center justify-between mb-4">
            <span>Low-impact</span>
            <input type="checkbox" checked={lowImpact} onChange={toggleLowImpact} />
          </label>
          <label className="flex flex-col">
            <span className="mb-1">Language</span>
            <select value={locale} onChange={e => changeLanguage(e.target.value as Locale)}>
              {locales.map(l => (
                <option key={l} value={l}>
                  {l === 'en' ? 'English' : l === 'es' ? 'Español' : 'العربية'}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </>
  );
}

