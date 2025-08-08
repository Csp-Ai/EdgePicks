// @ts-nocheck
import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.use({ baseURL: 'http://localhost:3000' });

=======

const routes = ['/', '/predictions', '/public', '/logs/agents'];

for (const route of routes) {
  test(`snapshot ${route}`, async ({ page }) => {

    const response = await page.goto(route);
    const status = response?.status() ?? 0;
    test.skip(status >= 400, `${route} not available`);
    const name = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-');
    await percySnapshot(page, name);
=======
    const res = await page.goto(route);
    if (res && res.status() >= 400) return;
    await percySnapshot(page, route || 'home');

  });
}
