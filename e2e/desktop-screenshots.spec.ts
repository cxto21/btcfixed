import { test, expect } from '@playwright/test';

test('desktop layout - auth screen (matches new_design)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  
  // Skip splash screen by setting localStorage
  await page.goto('http://localhost:3000');
  await page.evaluate(() => {
    localStorage.setItem('btcfixed_wallet_v1', 'true');
  });
  
  // Reload to skip splash
  await page.reload();
  await page.waitForTimeout(2000);
  
  // Take screenshot of auth screen (wallet connection - like new_design.html)
  await page.screenshot({ 
    path: '/workspaces/btcfixed/e2e/screenshots/desktop-auth.png',
    fullPage: true
  });
});

test('new_design reference', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('file:///workspaces/btcfixed/new_design.html');
  await page.waitForTimeout(1000);
  
  await page.screenshot({ 
    path: '/workspaces/btcfixed/e2e/screenshots/new-design-reference.png',
    fullPage: true
  });
});
