import { Page, expect } from '@playwright/test';

/**
 * Ensures tabbing through the page follows the expected focus order.
 * Provide an array of selectors representing the elements that
 * should receive focus sequentially when pressing Tab.
 *
 * Example:
 *   await expectFocusOrder(page, ['#nav a', 'main a', 'footer a']);
 */
export async function expectFocusOrder(page: Page, selectors: string[]) {
  for (const selector of selectors) {
    await page.keyboard.press('Tab');
    await expect(page.locator(selector)).toBeFocused();
  }
}

/**
 * Verifies that an ARIA live region announces updates.
 * The `trigger` callback should perform the action that
 * updates the live region's text content.
 *
 * Example:
 *   await expectLiveRegion(page, '[role="status"]', () => page.click('button'), 'Saved');
 */
export async function expectLiveRegion(
  page: Page,
  selector: string,
  trigger: () => Promise<void>,
  expectedText: string
) {
  const region = page.locator(selector);
  const politeness = await region.getAttribute('aria-live');
  const role = await region.getAttribute('role');
  expect(politeness || role === 'status' || role === 'alert').toBeTruthy();

  await trigger();
  await expect(region).toHaveText(expectedText);
}

/**
 * Asserts the presence of landmark roles to aid navigation.
 *
 * Example:
 *   await expectLandmarkRoles(page, ['banner', 'navigation', 'main', 'contentinfo']);
 */
export async function expectLandmarkRoles(page: Page, roles: string[]) {
  for (const role of roles) {
    await expect(page.locator(`[role="${role}"]`)).toHaveCount(1);
  }
}
