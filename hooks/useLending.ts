/**
 * BTCFixed – Session 4: useLending hook
 *
 * Fetches live APYs from Vesu, loads user positions, and exposes
 * deposit / withdraw actions using executeTransaction().
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { WalletId } from '../config/wallets';
import { executeTransaction } from '../config/wallets';
import {
  fetchLendingAssets,
  fetchUserPositions,
  buildDepositCalls,
  buildWithdrawCalls,
  toWei,
  type VesuAsset,
  type UserPosition,
} from '../services/lending';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TxStatus = 'idle' | 'pending' | 'success' | 'error';

export interface LendingState {
  assets: VesuAsset[];
  positions: UserPosition[];
  loading: boolean;
  txStatus: TxStatus;
  txError: string | null;
  lastTxHash: string | null;
  /** Deposit an asset to Vesu Prime pool */
  deposit: (asset: VesuAsset, amount: string) => Promise<void>;
  /** Withdraw all shares of an asset from Vesu Prime pool */
  withdraw: (asset: VesuAsset, position: UserPosition) => Promise<void>;
  resetStatus: () => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

const POLL_INTERVAL = 30_000; // 30 seconds

export function useLending(address: string | null, walletId: WalletId | null): LendingState {
  const [assets, setAssets] = useState<VesuAsset[]>([]);
  const [positions, setPositions] = useState<UserPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [txStatus, setTxStatus] = useState<TxStatus>('idle');
  const [txError, setTxError] = useState<string | null>(null);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    const [liveAssets, userPos] = await Promise.all([
      fetchLendingAssets(),
      address ? fetchUserPositions(address) : Promise.resolve([]),
    ]);
    setAssets(liveAssets);
    setPositions(userPos);
    setLoading(false);
  }, [address]);

  // Initial load + polling
  useEffect(() => {
    setLoading(true);
    void refresh();

    intervalRef.current = setInterval(() => {
      void refresh();
    }, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refresh]);

  const deposit = useCallback(async (asset: VesuAsset, amount: string) => {
    if (!address || !walletId) throw new Error('Wallet no conectada');
    const amountWei = toWei(amount, asset.decimals);
    if (amountWei === 0n) throw new Error('Monto inválido');

    setTxStatus('pending');
    setTxError(null);
    setLastTxHash(null);

    try {
      const calls = buildDepositCalls(asset, amountWei, address);
      const txHash = await executeTransaction(walletId, calls);
      setLastTxHash(txHash);
      setTxStatus('success');
      // Refresh positions after a short delay to let the chain settle
      setTimeout(() => void refresh(), 4000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setTxError(msg);
      setTxStatus('error');
    }
  }, [address, walletId, refresh]);

  const withdraw = useCallback(async (asset: VesuAsset, position: UserPosition) => {
    if (!address || !walletId) throw new Error('Wallet no conectada');
    const shares = BigInt(position.vTokenBalance);
    if (shares === 0n) throw new Error('Sin posición para retirar');

    setTxStatus('pending');
    setTxError(null);
    setLastTxHash(null);

    try {
      const calls = buildWithdrawCalls(asset, shares, address);
      const txHash = await executeTransaction(walletId, calls);
      setLastTxHash(txHash);
      setTxStatus('success');
      setTimeout(() => void refresh(), 4000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setTxError(msg);
      setTxStatus('error');
    }
  }, [address, walletId, refresh]);

  const resetStatus = useCallback(() => {
    setTxStatus('idle');
    setTxError(null);
    setLastTxHash(null);
  }, []);

  return {
    assets,
    positions,
    loading,
    txStatus,
    txError,
    lastTxHash,
    deposit,
    withdraw,
    resetStatus,
  };
}
