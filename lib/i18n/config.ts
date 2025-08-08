import React, { createContext, useMemo, useState, ReactNode } from 'react';

import en from '../../locales/en/common.json';
import es from '../../locales/es/common.json';

export type Locale = 'en' | 'es';

type TranslationDict = Record<string, string>;

const resources: Record<Locale, TranslationDict> = {
  en,
  es,
};

export const defaultLocale: Locale = 'en';

interface I18nContextValue {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
}

export const I18nContext = createContext<I18nContextValue>({
  locale: defaultLocale,
  t: (key: string) => resources[defaultLocale][key] ?? key,
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const value = useMemo(
    () => ({
      locale,
      t: (key: string) => resources[locale][key] ?? key,
      setLocale,
    }),
    [locale],
  );

  return React.createElement(I18nContext.Provider, { value }, children);
}

