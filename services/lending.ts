/**
 * BTCFixed – Session 4: Lending via Vesu Protocol
 *
 * Vesu pool "Prime" on Starknet mainnet.
 * Deposits use the ERC-4626 vToken interface (approve + deposit).
 * Withdrawals use vToken.redeem(shares, receiver, owner).
 * APYs come from the Vesu REST API (https://api.vesu.xyz).
 */

import type { Call } from 'starknet';
import { RpcProvider, Contract } from 'starknet';
import { ACTIVE_NETWORK_CONFIG } from '../config/networks';

// ---------------------------------------------------------------------------
// Constants – Vesu Prime pool (v2, mainnet)
// ---------------------------------------------------------------------------

export const VESU_PRIME_POOL_ID =
  '0x0451fe483d5921a2919ddd81d0de6696669bccdacd859f72a4fba7656b97c3b5';

export const VESU_API_BASE = 'https://api.vesu.xyz';

/** Supported lending assets in Vesu Prime pool */
export interface VesuAsset {
  symbol: string;
  name: string;
  decimals: number;
  /** ERC-20 token address */
  address: string;
  /** vToken (ERC-4626 vault) address – represents supply position */
  vTokenAddress: string;
  /** Supply APY in percent (fetched from API, updated at runtime) */
  supplyApy: number;
  /** Borrow APR in percent (fetched from API, updated at runtime) */
  borrowApr: number;
  /** Price in USD (fetched from API) */
  usdPrice?: number;
}

// Static fallback data – updated every 30 s via fetchLendingAssets()
export const LENDING_ASSETS_DEFAULT: VesuAsset[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    vTokenAddress: '0x006ac248c18c69e57573aa3eeccbb7f8cd29e3024561be252ee7b34b96c1043e',
    supplyApy: 0.49,
    borrowApr: 2.25,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    address: '0x033068f6539f8e6e6b131e6b2b814e6c34a5224bc66947c47dab9dfee93b35fb',
    vTokenAddress: '0x00387e8ddbb1ab36ca08874d9abc702ef4872ad600dcf76b7f240b71d7bc4e65',
    supplyApy: 2.44,
    borrowApr: 5.03,
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    address: '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8',
    vTokenAddress: '0x06be9f8980779930045b93c295105c6810d38191ec522b5175ddf7dbf9b22f9d',
    supplyApy: 3.66,
    borrowApr: 6.18,
  },
  {
    symbol: 'STRK',
    name: 'Starknet Token',
    decimals: 18,
    address: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    vTokenAddress: '0x06d6d2bf905dd199c78f2e421521d8473042737be9f47904e7578536c10f279d',
    supplyApy: 1.77,
    borrowApr: 4.28,
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    address: '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac',
    vTokenAddress: '0x04ecb0667140b9f45b067d026953ed79f22723f1cfac05a7b26c3ac06c88f56c',
    supplyApy: 0.23,
    borrowApr: 1.54,
  },
];

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

interface VesuPoolAssetRaw {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  vToken?: { address: string };
  usdPrice?: { value: string; decimals: number };
  stats?: {
    supplyApy?: { value: string } | null;
    borrowApr?: { value: string } | null;
  } | null;
}

function toPercent(raw: string | undefined | null): number {
  if (!raw) return 0;
  try {
    return Number(BigInt(raw)) / 1e18 * 100;
  } catch {
    return 0;
  }
}

function toUsdPrice(raw: { value: string; decimals: number } | undefined): number | undefined {
  if (!raw) return undefined;
  try {
    return Number(BigInt(raw.value)) / Math.pow(10, raw.decimals);
  } catch {
    return undefined;
  }
}

/**
 * Fetch live APY/APR data from Vesu Prime pool, keyed by vToken address.
 * Falls back to LENDING_ASSETS_DEFAULT on any error.
 */
export async function fetchLendingAssets(): Promise<VesuAsset[]> {
  try {
    const res = await fetch(`${VESU_API_BASE}/pools`);
    if (!res.ok) throw new Error(`Vesu API ${res.status}`);
    const json = await res.json() as { data: { id: string; name: string; assets: VesuPoolAssetRaw[] }[] };

    const prime = json.data.find(p => p.id === VESU_PRIME_POOL_ID);
    if (!prime) throw new Error('Prime pool not found');

    const SYMBOL_SET = new Set(LENDING_ASSETS_DEFAULT.map(a => a.symbol));
    const updated: VesuAsset[] = [];

    for (const raw of prime.assets) {
      if (!SYMBOL_SET.has(raw.symbol)) continue;
      const def = LENDING_ASSETS_DEFAULT.find(a => a.symbol === raw.symbol);
      if (!def) continue;

      updated.push({
        ...def,
        supplyApy: toPercent((raw.stats?.supplyApy ?? null)?.value),
        borrowApr: toPercent((raw.stats?.borrowApr ?? null)?.value),
        usdPrice: toUsdPrice(raw.usdPrice),
      });
    }

    // Preserve order and fill any missing with defaults
    return LENDING_ASSETS_DEFAULT.map(def => updated.find(u => u.symbol === def.symbol) ?? def);
  } catch {
    return LENDING_ASSETS_DEFAULT;
  }
}

// ---------------------------------------------------------------------------
// User position query
// ---------------------------------------------------------------------------

export interface UserPosition {
  symbol: string;
  /** Raw vToken balance (u256 as string) */
  vTokenBalance: string;
  /** Underlying asset amount (already divided by decimals) */
  assetAmount: number;
}

/**
 * Query vToken ERC-20 balanceOf for each asset.
 * Uses starknet.js RpcProvider via a dynamic import to avoid circular deps.
 */
export async function fetchUserPositions(userAddress: string): Promise<UserPosition[]> {
  const provider = new RpcProvider({ nodeUrl: ACTIVE_NETWORK_CONFIG.rpcUrl });

  // Minimal ERC-20 ABI: balanceOf + decimals
  const ERC20_ABI = [
    {
      name: 'balanceOf',
      type: 'function',
      inputs: [{ name: 'account', type: 'felt' }],
      outputs: [{ name: 'balance', type: 'Uint256' }],
      stateMutability: 'view',
    },
  ] as const;

  const positions: UserPosition[] = [];

  for (const asset of LENDING_ASSETS_DEFAULT) {
    try {
      const contract = new Contract(ERC20_ABI as unknown as Parameters<typeof Contract>[0], asset.vTokenAddress, provider);
      const result = await contract.balanceOf(userAddress);

      // balanceOf returns Uint256 { low, high } or BigInt depending on starknet.js version
      let raw: bigint;
      if (typeof result === 'bigint') {
        raw = result;
      } else if (result && typeof result === 'object' && 'low' in result) {
        raw = BigInt((result as { low: bigint; high: bigint }).low) +
              (BigInt((result as { low: bigint; high: bigint }).high) << BigInt(128));
      } else {
        raw = BigInt(String(result));
      }

      if (raw > 0n) {
        const assetAmount = Number(raw) / Math.pow(10, asset.decimals);
        positions.push({
          symbol: asset.symbol,
          vTokenBalance: raw.toString(),
          assetAmount,
        });
      }
    } catch {
      // Skip assets with errors (no position or call failed)
    }
  }

  return positions;
}

// ---------------------------------------------------------------------------
// Transaction builders (ERC-4626 vToken)
// ---------------------------------------------------------------------------

/**
 * Build calldata for supplying (depositing) an asset into Vesu Prime pool.
 * Flow: ERC-20.approve(vToken, amount) + vToken.deposit(amount, receiver)
 */
export function buildDepositCalls(asset: VesuAsset, amountWei: bigint, userAddress: string): Call[] {
  const amountLow = (amountWei & BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')).toString();
  const amountHigh = (amountWei >> BigInt(128)).toString();

  return [
    {
      contractAddress: asset.address,
      entrypoint: 'approve',
      calldata: [asset.vTokenAddress, amountLow, amountHigh],
    },
    {
      contractAddress: asset.vTokenAddress,
      entrypoint: 'deposit',
      calldata: [amountLow, amountHigh, userAddress],
    },
  ];
}

/**
 * Build calldata for withdrawing (redeeming) shares from Vesu Prime pool.
 * Flow: vToken.redeem(shares, receiver, owner)
 */
export function buildWithdrawCalls(asset: VesuAsset, sharesWei: bigint, userAddress: string): Call[] {
  const sharesLow = (sharesWei & BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')).toString();
  const sharesHigh = (sharesWei >> BigInt(128)).toString();

  return [
    {
      contractAddress: asset.vTokenAddress,
      entrypoint: 'redeem',
      calldata: [sharesLow, sharesHigh, userAddress, userAddress],
    },
  ];
}

// ---------------------------------------------------------------------------
// Amount helpers
// ---------------------------------------------------------------------------

/** Convert human-readable amount string to raw bigint (applying decimals). */
export function toWei(amount: string, decimals: number): bigint {
  if (!amount || amount === '.' || isNaN(Number(amount))) return 0n;
  const [integer, fraction = ''] = amount.split('.');
  const frac = fraction.slice(0, decimals).padEnd(decimals, '0');
  return BigInt(integer + frac);
}

/** Convert raw bigint to human-readable string with given decimals. */
export function fromWei(raw: bigint, decimals: number, precision = 6): string {
  const divisor = BigInt(10 ** decimals);
  const whole = raw / divisor;
  const remainder = raw % divisor;
  if (remainder === 0n) return whole.toString();
  const frac = remainder.toString().padStart(decimals, '0').slice(0, precision).replace(/0+$/, '');
  return frac ? `${whole}.${frac}` : whole.toString();
}
