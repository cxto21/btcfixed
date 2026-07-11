import { test, expect } from '@playwright/test';

test('landing page / shows hero without login', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  
  const hasHero = await page.locator('text=Smart HODLing').isVisible();
  const hasGetStarted = await page.locator('text=GET STARTED').isVisible();
  console.log('Landing hero:', hasHero, '| GET STARTED:', hasGetStarted);
  
  await page.screenshot({ path: '/workspaces/btcfixed/e2e/screenshots/final-landing.png', fullPage: true });
});

test('/app shows auth after splash', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/app');
  // Skip splash
  await page.evaluate(() => localStorage.setItem('btcfixed_wallet_v1', 'true'));
  await page.reload();
  await page.waitForTimeout(2000);
  
  const hasAuth = await page.locator('text=Select Wallet Connection').isVisible();
  console.log('/app auth visible:', hasAuth);
  
  await page.screenshot({ path: '/workspaces/btcfixed/e2e/screenshots/final-app-auth.png', fullPage: true });
});

test('GET STARTED -> /app -> auth screen', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  
  await page.click('text=GET STARTED');
  await page.waitForTimeout(1500);
  
  // Skip splash on /app
  await page.evaluate(() => localStorage.setItem('btcfixed_wallet_v1', 'true'));
  await page.reload();
  await page.waitForTimeout(2000);
  
  const url = page.url();
  const hasAuth = await page.locator('text=Select Wallet Connection').isVisible();
  console.log('URL:', url, '| Auth:', hasAuth);
});

test('nav BTCFixed no space', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  
  const navText = await page.locator('header').first().textContent();
  const hasNoSpace = navText?.includes('BTCFixed') ?? false;
  const hasSpace = navText?.includes('BTC Fixed') ?? false;
  console.log('Nav has BTCFixed:', hasNoSpace, '| BTC Fixed:', hasSpace);
});
