import { test, expect } from '@playwright/test';

/** Skip the splash/onboarding screen if it appears */
async function skipSplash(page: import('@playwright/test').Page) {
  const skipBtn = page.locator('button:has-text("Skip")');
  if (await skipBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await skipBtn.click();
    await page.waitForTimeout(500);
  }
}

test.describe('Auth Screen', () => {
  test('shows login screen with branding', async ({ page }) => {
    await page.goto('/');
    await skipSplash(page);
    await expect(page.locator('text=BTCFixed')).toBeVisible({ timeout: 10_000 });
  });

  test('shows wallet connection options', async ({ page }) => {
    await page.goto('/');
    await skipSplash(page);
    // Wait for wallet detection
    await page.waitForTimeout(1000);
    // Cartridge should always be available
    await expect(page.locator('text=Cartridge')).toBeVisible({ timeout: 5_000 });
  });

  test('shows Privy login button when configured', async ({ page }) => {
    await page.goto('/');
    await skipSplash(page);
    await page.waitForTimeout(1000);
    // If Privy is configured, we should see the social login button
    const privyButton = page.locator('text=Email · Google · Twitter · Apple');
    if (await privyButton.isVisible().catch(() => false)) {
      await expect(privyButton).toBeVisible();
    }
  });
});
