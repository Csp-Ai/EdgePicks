'use client';

import React, { createContext, useMemo, useState, ReactNode, useCallback } from 'react';
import enCommon from '../../locales/en/common.json';
import esCommon from '../../locales/es/common.json';
import arCommon from '../../locales/ar/common.json';

export type Locale = 'en' | 'es' | 'ar';
export const locales: Locale[] = ['en', 'es', 'ar'];
export type TranslationDict = Record<string, string>;
type Namespaces = Record<string, TranslationDict>;

const initialCommon: Record<Locale, TranslationDict> = {
  en: enCommon,
  es: esCommon,
  ar: arCommon,
};

export const defaultLocale: Locale = 'en';

async function loadForLocale(locale: Locale, ns: string): Promise<TranslationDict> {
  return (await import(`../../locales/${locale}/${ns}.json`)).default;
}

interface I18nContextValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  t: (key: string, ns?: string) => string;
  setLocale: (locale: Locale) => Promise<void>;
  loadNamespace: (ns: string) => Promise<void>;
}

export const I18nContext = createContext<I18nContextValue>({
  locale: defaultLocale,
  dir: 'ltr',
  t: (key: string) => key,
  setLocale: async () => {},
  loadNamespace: async () => {},
});

export function I18nProvider({
  children,
  initialLocale = defaultLocale,
  initialNamespaces = {},
}: {
  children: ReactNode;
  initialLocale?: Locale;
  initialNamespaces?: Namespaces;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [namespaces, setNamespaces] = useState<Namespaces>(
    Object.keys(initialNamespaces).length ? initialNamespaces : { common: initialCommon[initialLocale] },
  );

  const loadNamespace = useCallback(
    async (ns: string) => {
      const dict = await loadForLocale(locale, ns);
      setNamespaces((prev) => ({ ...prev, [ns]: dict }));
    },
    [locale],
  );

  const setLocale = useCallback(async (newLocale: Locale) => {
    const dict = await loadForLocale(newLocale, 'common');
    setLocaleState(newLocale);
    setNamespaces({ common: dict });
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      dir: locale === 'ar' ? 'rtl' : 'ltr',
      t: (key: string, ns: string = 'common') => namespaces[ns]?.[key] ?? key,
      setLocale,
      loadNamespace,
    }),
    [locale, namespaces, setLocale, loadNamespace],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

