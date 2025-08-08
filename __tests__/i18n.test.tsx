import { renderHook, act } from '@testing-library/react';
import { I18nProvider } from '../lib/i18n/config';
import useI18n from '../hooks/useI18n';

describe('useI18n', () => {
  it('returns translations for default locale', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <I18nProvider>{children}</I18nProvider>
    );
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.t('hello')).toBe('Hello');
  });

  it('changes locale when setLocale is called', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <I18nProvider>{children}</I18nProvider>
    );
    const { result } = renderHook(() => useI18n(), { wrapper });
    act(() => result.current.setLocale('es'));
    expect(result.current.t('hello')).toBe('Hola');
  });
});
