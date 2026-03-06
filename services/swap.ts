/**
 * AVNU Swap Service — Session 3
 *
 * Integrates AVNU's public REST API (https://starknet.api.avnu.fi) for:
 *  - Token quotes: GET /swap/v2/quotes
 *  - Call building: POST /swap/v2/build → returns Call[] ready for wallet.execute()
 *
 * No API key required.  All amounts use hex (0x-prefixed) bigint strings.
 */
import type { Call } from 'starknet';
import type { TokenConfig } from '../config/tokens';

const AVNU_API = 'https://starknet.api.avnu.fi';

// Default slippage: 0.5%
const DEFAULT_SLIPPAGE = 0.005;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SwapQuote {
  quoteId: string;
  sellTokenAddress: string;
  buyTokenAddress: string;
  /** Raw hex (0x…) bigint */
  sellAmount: string;
  /** Raw hex (0x…) bigint */
  buyAmount: string;
  /** True when AVNU supplied an estimate (not exact). */
  estimatedAmount: boolean;
  /** Price ratio between buy/sell token in USD (can be negative; absolute = price diff) */
  priceRatioUsd: number;
  routes: AvnuRoute[];
  gasless: { active: boolean } | boolean;
}

interface AvnuRoute {
  name: string;
  percent: number;
}

interface AvnuBuildResponse {
  chainId: string;
  calls: AvnuCall[];
}

interface AvnuCall {
  contractAddress: string;
  entrypoint: string;
  calldata: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a human-readable token amount to a hex bigint string. */
export function toHex(amount: string, decimals: number): string {
  const [whole, frac = ''] = amount.split('.');
  const fracPadded = (frac + '0'.repeat(decimals)).slice(0, decimals);
  const raw = BigInt(whole) * 10n ** BigInt(decimals) + BigInt(fracPadded || '0');
  return '0x' + raw.toString(16);
}

/** Convert a hex bigint string to a human-readable formatted amount. */
export function fromHex(hex: string, decimals: number): string {
  const raw = BigInt(hex);
  const divisor = 10n ** BigInt(decimals);
  const whole = raw / divisor;
  const frac = raw % divisor;
  const fracStr = frac.toString().padStart(decimals, '0');
  // Trim trailing zeros but keep at least 4 significant decimals
  const trimmed = fracStr.slice(0, 8).replace(/0+$/, '') || '0';
  return `${whole}.${trimmed}`;
}

/** Convert an AVNU call (with string[] calldata) to a starknet.js Call. */
function toStarknetCall(c: AvnuCall): Call {
  return {
    contractAddress: c.contractAddress,
    entrypoint: c.entrypoint,
    calldata: c.calldata,
  };
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

/**
 * Fetch a swap quote from AVNU.
 *
 * @param sellToken  - The token the user is selling
 * @param buyToken   - The token the user is buying
 * @param sellAmount - Human-readable amount to sell (e.g. "0.01")
 * @param takerAddress - Connected wallet address (or "0x0" for anon quotes)
 */
export async function getQuote(
  sellToken: TokenConfig,
  buyToken: TokenConfig,
  sellAmount: string,
  takerAddress: string = '0x0',
): Promise<SwapQuote> {
  if (!sellAmount || parseFloat(sellAmount) <= 0) {
    throw new Error('Enter an amount greater than 0');
  }

  const sellAmountHex = toHex(sellAmount, sellToken.decimals);

  const params = new URLSearchParams({
    sellTokenAddress: sellToken.address,
    buyTokenAddress: buyToken.address,
    sellAmount: sellAmountHex,
    takerAddress,
    size: '1',
  });

  const res = await fetch(`${AVNU_API}/swap/v2/quotes?${params}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`AVNU: no liquidity available for this pair (${res.status}${text ? ': ' + text.slice(0, 100) : ''})`);
  }

  const data: SwapQuote[] = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('AVNU: no quotes found for this token pair');
  }

  return data[0];
}

/**
 * Build swap calldata from a quoteId.
 * Returns starknet.js Call[] ready for wallet.execute().
 */
export async function buildSwapCalls(
  quoteId: string,
  takerAddress: string,
  slippage = DEFAULT_SLIPPAGE,
): Promise<Call[]> {
  const res = await fetch(`${AVNU_API}/swap/v2/build`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quoteId, takerAddress, slippage }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`AVNU build: ${res.status}${text ? ' - ' + text.slice(0, 100) : ''}`);
  }

  const data: AvnuBuildResponse = await res.json();
  if (!data.calls?.length) {
    throw new Error('AVNU: no calls generated for the swap');
  }

  return data.calls.map(toStarknetCall);
}

// ---------------------------------------------------------------------------
// Swap tokens available for BTCFixed
// ---------------------------------------------------------------------------

export const SWAP_TOKENS = ['ETH', 'STRK', 'USDC', 'USDT', 'WBTC'] as const;
export type SwapTokenSymbol = (typeof SWAP_TOKENS)[number];
