/**
 * useStaking — Session 2
 *
 * React hook that integrates StarkZap staking into the BTCFixed UI.
 * Loads pool commission (APY source), user position, and exposes
 * stake / exitIntent / exit / claimRewards transaction functions.
 *
 * Usage:
 *   const { commission, position, isLoading, stake } = useStaking('AVNU');
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { executeTransaction } from '../config/wallets';
import {
  getValidatorCommission,
  getUserPosition,
  buildStakeCalls,
  buildExitIntentCalls,
  buildExitCalls,
  buildClaimCalls,
  calcEffectiveAPY,
  type ValidatorKey,
} from '../services/staking';
import type { PoolMember } from 'starkzap';

export type TxStatus = 'idle' | 'pending' | 'success' | 'error';

export interface StakingState {
  /** Validator commission in % (e.g. 10 = 10%). null while loading. */
  commission: number | null;
  /** Effective APY after commission, based on ~7.4% protocol APY. */
  effectiveAPY: number | null;
  /** Current pool member position, or null if not staked / loading. */
  position: PoolMember | null;
  /** True during initial data fetch. */
  isLoading: boolean;
  /** Human-readable error message, or null. */
  error: string | null;
  /** Status of the most recent transaction. */
  txStatus: TxStatus;
  /** Hash of the last successful transaction. */
  lastTxHash: string | null;
  /** Stake STRK in the selected pool. Handles enter vs add automatically. */
  stake: (amountStrk: string) => Promise<void>;
  /** Initiate unstaking for an amount. Stops earning rewards immediately. */
  exitIntent: (amountStrk: string) => Promise<void>;
  /** Complete withdrawal after the exit window has passed. */
  exit: () => Promise<void>;
  /** Claim accumulated rewards. */
  claimRewards: () => Promise<void>;
  /** Manually refresh position data. */
  refresh: () => Promise<void>;
}

const POLL_INTERVAL = 30_000; // 30 s

export function useStaking(validatorKey: ValidatorKey = 'AVNU'): StakingState {
  const { address, walletId } = useAuth();

  const [commission, setCommission] = useState<number | null>(null);
  const [position, setPosition] = useState<PoolMember | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<TxStatus>('idle');
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  // ---------------------------------------------------------------------------
  // Data loading
  // ---------------------------------------------------------------------------

  const loadData = useCallback(async () => {
    if (!mountedRef.current) return;
    setIsLoading(true);
    setError(null);
    try {
      // Commission can be loaded without user address
      const c = await getValidatorCommission(validatorKey);
      if (mountedRef.current) setCommission(c);

      // Position requires address
      if (address) {
        const pos = await getUserPosition(validatorKey, address);
        if (mountedRef.current) setPosition(pos);
      }
    } catch (err: unknown) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err.message : 'Error al cargar datos de staking');
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, [validatorKey, address]);

  useEffect(() => {
    mountedRef.current = true;
    loadData();

    // Polling to keep position fresh
    pollingRef.current = setInterval(loadData, POLL_INTERVAL);

    return () => {
      mountedRef.current = false;
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [loadData]);

  // ---------------------------------------------------------------------------
  // Transaction helper
  // ---------------------------------------------------------------------------

  const runTransaction = useCallback(
    async (buildCalls: () => Promise<import('starknet').Call[]>) => {
      if (!address || !walletId) {
        throw new Error('Conecta tu billetera primero.');
      }
      setTxStatus('pending');
      setLastTxHash(null);
      try {
        const calls = await buildCalls();
        const txHash = await executeTransaction(walletId, calls);
        setTxStatus('success');
        setLastTxHash(txHash);
        // Refresh position after tx confirms (small delay for indexer)
        setTimeout(() => loadData(), 4_000);
      } catch (err: unknown) {
        setTxStatus('error');
        const msg = err instanceof Error ? err.message : 'Transacción fallida';
        setError(msg);
        throw err;
      }
    },
    [address, walletId, loadData],
  );

  // ---------------------------------------------------------------------------
  // Public transaction functions
  // ---------------------------------------------------------------------------

  const stake = useCallback(
    async (amountStrk: string) => {
      if (!address) throw new Error('No hay dirección conectada');
      await runTransaction(() => buildStakeCalls(validatorKey, address, amountStrk));
    },
    [address, validatorKey, runTransaction],
  );

  const exitIntent = useCallback(
    async (amountStrk: string) => {
      await runTransaction(() => buildExitIntentCalls(validatorKey, amountStrk));
    },
    [validatorKey, runTransaction],
  );

  const exit = useCallback(async () => {
    if (!address) throw new Error('No hay dirección conectada');
    await runTransaction(() => buildExitCalls(validatorKey, address));
  }, [address, validatorKey, runTransaction]);

  const claimRewards = useCallback(async () => {
    if (!address) throw new Error('No hay dirección conectada');
    await runTransaction(() => buildClaimCalls(validatorKey, address));
  }, [address, validatorKey, runTransaction]);

  // ---------------------------------------------------------------------------
  // Derived values
  // ---------------------------------------------------------------------------

  const effectiveAPY = commission !== null ? calcEffectiveAPY(commission) : null;

  return {
    commission,
    effectiveAPY,
    position,
    isLoading,
    error,
    txStatus,
    lastTxHash,
    stake,
    exitIntent,
    exit,
    claimRewards,
    refresh: loadData,
  };
}
