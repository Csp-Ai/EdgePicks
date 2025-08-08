import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DemoPage, { getStaticProps } from '../pages/demo/nfl';
import { DemoModeProvider } from '../lib/demoMode';

jest.mock('../lib/logUiEvent', () => ({ logUiEvent: jest.fn() }));

test('NFL demo route loads fixtures and tracker without network', async () => {
  const { props } = (await getStaticProps({} as any)) as any;
  const realFetch = global.fetch;
  const fetchSpy = jest.fn(() => Promise.reject(new Error('network')));
  global.fetch = fetchSpy as any;
  window.HTMLElement.prototype.scrollIntoView = jest.fn();

  render(
    <DemoModeProvider>
      <DemoPage {...props} />
    </DemoModeProvider>
  );

  await screen.findByText('Alpha FC');
  expect(fetchSpy).not.toHaveBeenCalled();

  fireEvent.click(await screen.findByTestId('reveal-cta'));
  await screen.findByTestId('predictions-list');
  expect(screen.getByTestId('node-injuryScout')).toBeInTheDocument();
  expect(screen.getByTestId('node-lineWatcher')).toBeInTheDocument();

  global.fetch = realFetch;
});
