import { renderHook, act } from '@testing-library/react';
import useI18n from '../hooks/useI18n';
import { TestProviders } from '../test/utils/renderWithProviders';
import en from './fixtures/i18n/en.json';

describe('useI18n', () => {
  it('returns translations for default locale', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TestProviders locale="en" namespaces={{ common: en }}>
        {children}
      </TestProviders>
    );
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.t('hello')).toBe('Hello');
  });

  it('changes locale when setLocale is called', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TestProviders locale="en" namespaces={{ common: en }}>
        {children}
      </TestProviders>
    );
    const { result } = renderHook(() => useI18n(), { wrapper });
    act(() => result.current.setLocale('es'));
    expect(result.current.t('hello')).toBe('Hola');
  });
});
