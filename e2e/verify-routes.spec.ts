import { test, expect } from '@playwright/test';

test('root / shows auth screen (old login)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000');
  await page.evaluate(() => localStorage.setItem('btcfixed_wallet_v1', 'true'));
  await page.reload();
  await page.waitForTimeout(2000);
  
  // Check if we see the auth/login screen
  const hasAuthText = await page.locator('text=Select Wallet Connection').isVisible();
  console.log('Root / shows auth:', hasAuthText);
  
  await page.screenshot({ path: '/workspaces/btcfixed/e2e/screenshots/verify-root.png' });
});

test('clicking nav links goes to auth screen', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000');
  await page.evaluate(() => localStorage.setItem('btcfixed_wallet_v1', 'true'));
  await page.reload();
  await page.waitForTimeout(2000);
  
  // Click "Who We Are"
  await page.click('text=Who We Are');
  await page.waitForTimeout(1000);
  const url1 = page.url();
  const hasAuth1 = await page.locator('text=Select Wallet Connection').isVisible();
  console.log('After Who We Are:', url1, 'auth visible:', hasAuth1);
  
  // Click "Community"
  await page.click('text=Community');
  await page.waitForTimeout(1000);
  const url2 = page.url();
  const hasAuth2 = await page.locator('text=Select Wallet Connection').isVisible();
  console.log('After Community:', url2, 'auth visible:', hasAuth2);
  
  await page.screenshot({ path: '/workspaces/btcfixed/e2e/screenshots/verify-nav.png' });
});
