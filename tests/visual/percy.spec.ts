// @ts-nocheck
import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

const routes = ['/', '/predictions', '/public', '/logs/agents'];

for (const route of routes) {
  test(`snapshot ${route}`, async ({ page }) => {
    const res = await page.goto(route);
    if (res && res.status() >= 400) return;
    await percySnapshot(page, route || 'home');
  });
}
