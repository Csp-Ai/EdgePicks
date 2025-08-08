'use client';

import { useContext } from 'react';
import { I18nContext, Locale, locales } from './config';

export function LocaleSwitcher() {
  const { locale, setLocale } = useContext(I18nContext);
  return (
    <select
      value={locale}
      onChange={e => setLocale(e.target.value as Locale)}
    >
      {locales.map(l => (
        <option key={l} value={l}>
          {l === 'en' ? 'English' : l === 'es' ? 'Español' : 'العربية'}
        </option>
      ))}
    </select>
  );
}
