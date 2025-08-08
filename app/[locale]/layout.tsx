import { ReactNode } from 'react';
import { I18nProvider, Locale } from '../../lib/i18n/config';
import { getDictionary } from '../../lib/i18n/getDictionary';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  const dir = params.locale === 'ar' ? 'rtl' : 'ltr';
  return (
    <html lang={params.locale} dir={dir}>
      <body>
        <I18nProvider initialLocale={params.locale} initialNamespaces={{ common: dict }}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
