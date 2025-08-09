import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { I18nProvider, Locale, TranslationDict } from '../../lib/i18n/config';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';

// simple stub theme provider
const ThemeProvider = ({ children }: { children: ReactNode }) => <>{children}</>;

interface ProvidersProps {
  children: ReactNode;
  locale?: Locale;
  namespaces?: Record<string, TranslationDict>;
  router?: Partial<any>;
}

export function TestProviders({
  children,
  locale = (process.env.NEXT_PUBLIC_LOCALE as Locale) || 'en',
  namespaces = {},
  router = {},
}: ProvidersProps) {
  const mockRouter = {
    pathname: '/',
    route: '/',
    asPath: '/',
    query: {},
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(null),
    ...router,
  } as any;
  return (
    <ThemeProvider>
      <I18nProvider initialLocale={locale} initialNamespaces={namespaces}>
        <RouterContext.Provider value={mockRouter}>{children}</RouterContext.Provider>
      </I18nProvider>
    </ThemeProvider>
  );
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  locale?: Locale;
  namespaces?: Record<string, TranslationDict>;
  router?: Partial<any>;
}

export function renderWithProviders(
  ui: ReactElement,
  { locale, namespaces, router, ...opts }: ExtendedRenderOptions = {},
) {
  return render(ui, {
    wrapper: (props) => (
      <TestProviders locale={locale} namespaces={namespaces} router={router} {...props} />
    ),
    ...opts,
  });
}
