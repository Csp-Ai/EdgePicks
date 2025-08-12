import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DemoPage from '../app/demo/page';
import { DemoModeProvider } from '../lib/demoMode';

jest.mock('../lib/logUiEvent', () => ({ logUiEvent: jest.fn() }));

test.skip('guest demo flows from upcoming to predictions without network', async () => {
  const realFetch = global.fetch;
  const fetchSpy = jest.fn(() => Promise.reject(new Error('network')));
  global.fetch = fetchSpy as any;
  window.HTMLElement.prototype.scrollIntoView = jest.fn();

  render(
    <DemoModeProvider>
      <DemoPage />
    </DemoModeProvider>
  );

  await screen.findByText('Alpha FC');
  expect(fetchSpy).not.toHaveBeenCalled();

  fireEvent.click(await screen.findByTestId('reveal-cta'));
  await screen.findByTestId('predictions-list');

  global.fetch = realFetch;
});
