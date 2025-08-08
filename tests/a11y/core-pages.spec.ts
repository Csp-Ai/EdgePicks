import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';
import path from 'path';

const pagesDir = path.join(__dirname, '..', '..', 'pages');
const routes = fs
  .readdirSync(pagesDir)
  .filter((file) => file.endsWith('.tsx') && !file.startsWith('_'))
  .map((file) => {
    const name = file.replace(/\.tsx$/, '');
    return name === 'index' ? '/' : `/${name}`;
  });

for (const route of routes) {
  test(`page ${route} has no accessibility violations`, async ({ page }) => {
    await page.goto(`http://localhost:3000${route}`);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}
