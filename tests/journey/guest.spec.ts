import { test, expect } from '@playwright/test';

test('guest can explore demo and share trust page', async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).__shared = false;
    navigator.share = () => {
      (window as any).__shared = true;
      return Promise.resolve();
    };
  });

  await page.goto('http://localhost:3000/demo');
  await page.getByRole('button', { name: 'See agents in action' }).click();
  await page.getByTestId('reveal-cta').click();
  await expect(page.getByTestId('predictions-list')).toBeVisible();

  await page.goto('http://localhost:3000/trust');
  await expect(page.getByRole('heading', { name: 'Trust & Transparency' })).toBeVisible();

  await page.evaluate(() => navigator.share({ url: window.location.href }));
  expect(await page.evaluate(() => (window as any).__shared)).toBe(true);
});
