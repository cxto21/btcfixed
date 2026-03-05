import { useCallback, useEffect, useState } from 'react';
import { RpcProvider, Contract } from 'starknet';
import { ACTIVE_NETWORK_CONFIG } from '../config/networks';
import type { TokenConfig } from '../config/tokens';

// Minimal ERC-20 ABI for balance reads (Cairo 2 / Starknet v0.13+)
const ERC20_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [
      {
        name: 'account',
        type: 'core::starknet::contract_address::ContractAddress',
      },
    ],
    outputs: [{ type: 'core::integer::u256' }],
    state_mutability: 'view',
  },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a starknet.js u256 result (may be bigint or { low, high }) to bigint */
function u256ToBigInt(value: unknown): bigint {
  if (typeof value === 'bigint') return value;
  if (typeof value === 'object' && value !== null && 'low' in value && 'high' in value) {
    const { low, high } = value as { low: bigint; high: bigint };
    return low + high * 2n ** 128n;
  }
  return 0n;
}

/** Format a raw bigint amount to a human-readable string */
function formatUnits(raw: bigint, decimals: number): string {
  const divisor = 10n ** BigInt(decimals);
  const whole = raw / divisor;
  const frac = raw % divisor;
  const fracStr = frac
    .toString()
    .padStart(decimals, '0')
    .slice(0, 6)
    .replace(/0+$/, '');
  return fracStr ? `${whole}.${fracStr}` : `${whole}`;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TokenBalance {
  raw: bigint;
  formatted: string;
}

export interface UseBalanceResult {
  balance: TokenBalance;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Fetches and polls an ERC-20 balance for a given address and token.
 *
 * @param address   Starknet wallet address (hex string) — pass null to skip
 * @param token     Token config (address + decimals)
 * @param pollMs    Polling interval in ms (default 15 s; 0 = no polling)
 */
export function useBalance(
  address: string | null,
  token: TokenConfig,
  pollMs = 15_000,
): UseBalanceResult {
  const [balance, setBalance] = useState<TokenBalance>({ raw: 0n, formatted: '0' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!address) return;
    setIsLoading(true);
    setError(null);

    try {
      const provider = new RpcProvider({ nodeUrl: ACTIVE_NETWORK_CONFIG.rpcUrl });
      const contract = new Contract(ERC20_ABI as unknown as Parameters<typeof Contract>[0], token.address, provider);

      // starknet.js v9 – call via dynamic property
      const raw = await (contract as unknown as Record<string, (arg: string) => Promise<unknown>>)
        ['balanceOf'](address);

      const bigint = u256ToBigInt(raw);
      setBalance({ raw: bigint, formatted: formatUnits(bigint, token.decimals) });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error fetching balance';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [address, token.address, token.decimals]);

  useEffect(() => {
    fetchBalance();
    if (!pollMs) return;
    const id = setInterval(fetchBalance, pollMs);
    return () => clearInterval(id);
  }, [fetchBalance, pollMs]);

  return { balance, isLoading, error, refetch: fetchBalance };
}
