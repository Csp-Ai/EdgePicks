'use client';

import { useContext } from 'react';
import { I18nContext } from '../../lib/i18n/config';
import { LocaleSwitcher } from '../../lib/i18n/LocaleSwitcher';

export default function Page() {
  const { t } = useContext(I18nContext);
  return (
    <main>
      <h1>{t('hello')}</h1>
      <p>{t('welcome')}</p>
      <LocaleSwitcher />
    </main>
  );
}
