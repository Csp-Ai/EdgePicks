import { expect } from '@jest/globals';

function isRelative(url: string) {
  return !/^\w+:/.test(url);
}

function isLocalhost(url: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])/i.test(url);
}

export function installNetworkGuard() {
  if (process.env.ALLOW_TEST_NETWORK === '1') return;
  if (process.env.NODE_ENV !== 'test' && process.env.CI !== '1') return;

  const originalFetch = global.fetch;
  global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' || input instanceof URL ? input.toString() : input.url;
    const res = await originalFetch(input as any, init);
    const poweredBy = res.headers.get('x-powered-by');
    if (!isRelative(url) && !isLocalhost(url) && poweredBy !== 'msw') {
      const state = expect.getState();
      const where = state.testPath ? `${state.testPath}${state.currentTestName ? ` (${state.currentTestName})` : ''}` : '';
      throw new Error(`Network request blocked during test${where ? ` in ${where}` : ''}: ${url}`);
    }
    return res;
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const axios = require('axios');
    axios.interceptors.response.use((response: any) => {
      const url: string = response.config?.url || '';
      const poweredBy = response.headers?.['x-powered-by'];
      if (!isRelative(url) && !isLocalhost(url) && poweredBy !== 'msw') {
        const state = expect.getState();
        const where = state.testPath ? `${state.testPath}${state.currentTestName ? ` (${state.currentTestName})` : ''}` : '';
        throw new Error(`Network request blocked during test${where ? ` in ${where}` : ''}: ${url}`);
      }
      return response;
    });
  } catch {
    // axios not present
  }
}
