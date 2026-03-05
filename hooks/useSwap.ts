/**
 * useSwap — Session 3
 *
 * React hook that orchestrates the AVNU swap flow:
 *  1. User selects tokens + amount
 *  2. Hook debounces and fetches a live quote
 *  3. User confirms → hook builds calldata + executes via wallet
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { executeTransaction } from '../config/wallets';
import { ACTIVE_TOKENS, type TokenConfig } from '../config/tokens';
import { getQuote, buildSwapCalls, fromHex, type SwapQuote } from '../services/swap';

export type SwapTxStatus = 'idle' | 'quoting' | 'ready' | 'pending' | 'success' | 'error';

export interface SwapState {
  sellToken: TokenConfig;
  buyToken: TokenConfig;
  sellAmount: string;
  buyAmount: string;
  quote: SwapQuote | null;
  status: SwapTxStatus;
  error: string | null;
  lastTxHash: string | null;
  /** Price impact string (e.g. "0.12%") */
  priceImpact: string | null;
  setSellToken: (t: TokenConfig) => void;
  setBuyToken: (t: TokenConfig) => void;
  setSellAmount: (v: string) => void;
  flipTokens: () => void;
  executeSwap: () => Promise<void>;
  resetStatus: () => void;
}

const QUOTE_DEBOUNCE_MS = 700;

export function useSwap(): SwapState {
  const { address, walletId } = useAuth();

  const [sellToken, setSellToken] = useState<TokenConfig>(ACTIVE_TOKENS.ETH);
  const [buyToken, setBuyToken] = useState<TokenConfig>(ACTIVE_TOKENS.STRK);
  const [sellAmount, setSellAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [status, setStatus] = useState<SwapTxStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);
  const [priceImpact, setPriceImpact] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ---------------------------------------------------------------------------
  // Auto-quote when amount / tokens change
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const amount = parseFloat(sellAmount);
    if (!sellAmount || isNaN(amount) || amount <= 0) {
      setBuyAmount('');
      setQuote(null);
      setPriceImpact(null);
      if (status === 'quoting' || status === 'ready') setStatus('idle');
      return;
    }

    setStatus('quoting');
    setError(null);

    debounceRef.current = setTimeout(async () => {
      try {
        const takerAddr = address ?? '0x0';
        const q = await getQuote(sellToken, buyToken, sellAmount, takerAddr);
        if (!mountedRef.current) return;

        const out = fromHex(q.buyAmount, buyToken.decimals);
        setBuyAmount(out);
        setQuote(q);

        // Approximate price impact from priceRatioUsd (negative = user pays more)
        const impact = Math.abs(q.priceRatioUsd);
        setPriceImpact(impact > 0 ? `${impact.toFixed(3)}%` : null);

        setStatus('ready');
      } catch (err: unknown) {
        if (!mountedRef.current) return;
        setError(err instanceof Error ? err.message : 'Error al obtener quote');
        setStatus('error');
        setBuyAmount('');
        setQuote(null);
      }
    }, QUOTE_DEBOUNCE_MS);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellAmount, sellToken.address, buyToken.address, address]);

  // ---------------------------------------------------------------------------
  // Flip tokens
  // ---------------------------------------------------------------------------
  const flipTokens = useCallback(() => {
    setSellToken((prev) => buyToken);
    setBuyToken((prev) => sellToken);
    setSellAmount(buyAmount);
    setBuyAmount('');
    setQuote(null);
    setStatus('idle');
    setError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellToken, buyToken, buyAmount]);

  // ---------------------------------------------------------------------------
  // Execute swap
  // ---------------------------------------------------------------------------
  const executeSwap = useCallback(async () => {
    if (!quote) throw new Error('No hay quote activo');
    if (!address || !walletId) throw new Error('Conecta tu billetera primero');

    setStatus('pending');
    setError(null);
    setLastTxHash(null);

    try {
      const calls = await buildSwapCalls(quote.quoteId, address);
      const txHash = await executeTransaction(walletId, calls);

      if (!mountedRef.current) return;
      setStatus('success');
      setLastTxHash(txHash);
      // Reset form
      setSellAmount('');
      setBuyAmount('');
      setQuote(null);
    } catch (err: unknown) {
      if (!mountedRef.current) return;
      const msg = err instanceof Error ? err.message : 'Swap fallido';
      setError(msg);
      setStatus('error');
      throw err;
    }
  }, [quote, address, walletId]);

  const resetStatus = useCallback(() => {
    setStatus('idle');
    setError(null);
    setLastTxHash(null);
  }, []);

  const handleSetSellToken = useCallback((t: TokenConfig) => {
    // Avoid same token on both sides
    if (t.address === buyToken.address) {
      setBuyToken(sellToken);
    }
    setSellToken(t);
    setSellAmount('');
    setBuyAmount('');
    setQuote(null);
  }, [sellToken, buyToken]);

  const handleSetBuyToken = useCallback((t: TokenConfig) => {
    if (t.address === sellToken.address) {
      setSellToken(buyToken);
    }
    setBuyToken(t);
    setBuyAmount('');
    setQuote(null);
  }, [sellToken, buyToken]);

  return {
    sellToken,
    buyToken,
    sellAmount,
    buyAmount,
    quote,
    status,
    error,
    lastTxHash,
    priceImpact,
    setSellToken: handleSetSellToken,
    setBuyToken: handleSetBuyToken,
    setSellAmount,
    flipTokens,
    executeSwap,
    resetStatus,
  };
}
