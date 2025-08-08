import { Locale, TranslationDict } from './config';

export async function getDictionary(locale: Locale, ns: string = 'common'): Promise<TranslationDict> {
  return (await import(`../../locales/${locale}/${ns}.json`)).default;
}
