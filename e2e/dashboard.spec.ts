import { test, expect, type Page } from '@playwright/test';

/**
 * Helper: simulate a wallet login by injecting auth state into localStorage.
 * Uses walletId='privy' because it restores state without needing a wallet extension.
 */
async function mockWalletLogin(page: Page, opts?: { walletId?: string; address?: string; displayName?: string }) {
  const address = opts?.address ?? '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';
  const walletId = opts?.walletId ?? 'privy';
  const displayName = opts?.displayName ?? null;
  await page.goto('/');
  await page.evaluate(
    ({ address, walletId, displayName }) => {
      localStorage.setItem(
        'btcfixed_wallet_v1',
        JSON.stringify({ address, walletId, displayName }),
      );
    },
    { address, walletId, displayName },
  );
  await page.reload();
  await page.waitForTimeout(1500);
}

test.describe('Dashboard', () => {
  test('shows portfolio section after wallet login', async ({ page }) => {
    await mockWalletLogin(page);
    await expect(page.getByText('Total portfolio')).toBeVisible({ timeout: 10_000 });
  });

  test('shows token assets', async ({ page }) => {
    await mockWalletLogin(page);
    const main = page.getByRole('main');
    await expect(main.getByText('Bitcoin')).toBeVisible({ timeout: 10_000 });
    await expect(main.getByText('Ethereum')).toBeVisible();
    await expect(main.getByText('Starknet')).toBeVisible();
  });

  test('quick actions are visible', async ({ page }) => {
    await mockWalletLogin(page);
    const main = page.getByRole('main');
    await expect(main.getByRole('button', { name: 'Swap' })).toBeVisible({ timeout: 10_000 });
    await expect(main.getByRole('button', { name: 'Receive' })).toBeVisible();
    await expect(main.getByRole('button', { name: 'Earn', exact: true })).toBeVisible();
    await expect(main.getByRole('button', { name: 'Refresh' })).toBeVisible();
  });

  test('Receive modal opens and shows QR for blockchain address', async ({ page }) => {
    await mockWalletLogin(page);
    await page.getByRole('main').getByRole('button', { name: 'Receive' }).click();
    await expect(page.getByText('Your Starknet Address')).toBeVisible({ timeout: 5_000 });
    await expect(page.getByRole('button', { name: 'Copy Address' })).toBeVisible();
  });

  test('Receive modal shows address for Privy embedded wallet users', async ({ page }) => {
    await mockWalletLogin(page, {
      walletId: 'privy',
      address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
      displayName: 'test@example.com',
    });
    await page.getByRole('main').getByRole('button', { name: 'Receive' }).click();
    await expect(page.getByText('Your Starknet Address')).toBeVisible({ timeout: 5_000 });
    await expect(page.getByRole('button', { name: 'Copy Address' })).toBeVisible();
  });

  test('Earn yield banner is visible', async ({ page }) => {
    await mockWalletLogin(page);
    await expect(page.getByText('5.25% APR')).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('Header', () => {
  test('shows truncated address for blockchain users', async ({ page }) => {
    await mockWalletLogin(page);
    await expect(page.getByRole('heading', { name: '0x049d...4dc7' })).toBeVisible({ timeout: 10_000 });
  });

  test('shows displayName for Privy users', async ({ page }) => {
    await mockWalletLogin(page, {
      walletId: 'privy',
      address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
      displayName: 'test@example.com',
    });
    await expect(page.getByRole('heading', { name: 'test@example.com' })).toBeVisible({ timeout: 10_000 });
  });

  test('disconnect button is visible', async ({ page }) => {
    await mockWalletLogin(page);
    await expect(page.getByRole('button', { name: 'Disconnect wallet' })).toBeVisible({ timeout: 10_000 });
  });
});
