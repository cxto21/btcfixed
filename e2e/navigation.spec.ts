import { test, expect, type Page } from '@playwright/test';

async function mockWalletLogin(page: Page) {
  const address = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';
  await page.goto('/');
  await page.evaluate(
    ({ address }) => {
      localStorage.setItem(
        'btcfixed_wallet_v1',
        JSON.stringify({ address, walletId: 'privy' }),
      );
    },
    { address },
  );
  await page.reload();
  await page.waitForTimeout(1500);
}

test.describe('Navigation', () => {
  test('bottom nav shows all tabs', async ({ page }) => {
    await mockWalletLogin(page);
    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('button', { name: 'Swap' })).toBeVisible({ timeout: 10_000 });
    await expect(nav.getByRole('button', { name: 'Earn' })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'Vault' })).toBeVisible();
  });

  test('can navigate to Swap tab', async ({ page }) => {
    await mockWalletLogin(page);
    await page.getByRole('navigation').getByRole('button', { name: 'Swap' }).click();
    await expect(page.getByText('You pay')).toBeVisible({ timeout: 5_000 });
  });

  test('can navigate to Earn tab', async ({ page }) => {
    await mockWalletLogin(page);
    await page.getByRole('navigation').getByRole('button', { name: 'Earn' }).click();
    await expect(page.getByText('Starknet Native Staking')).toBeVisible({ timeout: 5_000 });
  });

  test('can navigate to Vault tab', async ({ page }) => {
    await mockWalletLogin(page);
    await page.getByRole('navigation').getByRole('button', { name: 'Vault' }).click();
    await page.waitForTimeout(500);
    await expect(page.getByRole('heading', { name: 'Vault' })).toBeVisible({ timeout: 5_000 });
  });

  test('can navigate to Identity tab', async ({ page }) => {
    await mockWalletLogin(page);
    await page.getByRole('navigation').getByRole('button', { name: 'ID' }).click();
    await expect(page.getByText('Anonymous Transactions')).toBeVisible({ timeout: 10_000 });
  });
});
