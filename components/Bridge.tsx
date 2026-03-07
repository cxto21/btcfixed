/**
 * Bridge (Swap) — Session 3
 *
 * Real token swaps via AVNU DEX aggregator.
 * Provides real-time quotes, slippage info, and on-chain execution.
 */
import React from 'react';
import {
  RefreshCw,
  Zap,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ArrowUpDown,
  Info,
} from 'lucide-react';
import { useSwap } from '../hooks/useSwap';
import { useBalance } from '../hooks/useBalance';
import { useAuth } from '../contexts/AuthContext';
import { ACTIVE_TOKENS, type TokenConfig } from '../config/tokens';
import { SWAP_TOKENS, type SwapTokenSymbol } from '../services/swap';
import { ACTIVE_NETWORK_CONFIG } from '../config/networks';

const TOKEN_COLORS: Record<string, string> = {
  ETH: '#627EEA', STRK: '#8B5CF6', USDC: '#2775CA', USDT: '#26A17B', WBTC: '#F7931A',
};

function TokenSelector({
  selected,
  onSelect,
}: {
  selected: TokenConfig;
  onSelect: (t: TokenConfig) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 px-3 py-2 rounded-xl hover:bg-gray-200 dark:hover:bg-white/15 transition-colors"
      >
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: TOKEN_COLORS[selected.symbol] ?? '#888' }}>
          {selected.symbol[0]}
        </div>
        <span className="text-sm font-semibold dark:text-white">{selected.symbol}</span>
        <ChevronDown size={14} className="text-gray-600 dark:text-gray-300" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-20 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl min-w-[140px] overflow-hidden">
            {SWAP_TOKENS.map((sym) => {
              const token = ACTIVE_TOKENS[sym as SwapTokenSymbol];
              if (!token) return null;
              return (
                <button
                  key={sym}
                  onClick={() => { onSelect(token); setOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${sym === selected.symbol ? 'bg-gray-50 dark:bg-white/5' : ''}`}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: TOKEN_COLORS[sym] ?? '#888' }}>
                    {sym[0]}
                  </div>
                  <span className="font-medium dark:text-white">{sym}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

const Bridge: React.FC = () => {
  const { address } = useAuth();
  const swap = useSwap();

  const { balance } = useBalance(address, swap.sellToken, 20_000);
  const balanceFormatted = balance?.formatted ?? '0';

  const isSameToken = swap.sellToken.symbol === swap.buyToken.symbol;
  const isQuoting = swap.status === 'quoting';
  const isReady = swap.status === 'ready';
  const isPending = swap.status === 'pending';
  const isSuccess = swap.status === 'success';
  const isError = swap.status === 'error';

  const handleSetSellToken = (token: TokenConfig) => {
    if (token.symbol === swap.buyToken.symbol) swap.flipTokens();
    else swap.setSellToken(token);
  };

  const handleSetBuyToken = (token: TokenConfig) => {
    if (token.symbol === swap.sellToken.symbol) swap.flipTokens();
    else swap.setBuyToken(token);
  };

  const routeName = swap.quote?.routes?.[0]?.name;
  const isGasless =
    swap.quote?.gasless &&
    typeof swap.quote.gasless === 'object' &&
    (swap.quote.gasless as { active: boolean }).active;

  const explorerLink = swap.lastTxHash
    ? `${ACTIVE_NETWORK_CONFIG.explorerUrl}/tx/${swap.lastTxHash}`
    : null;

  return (
    <div className="space-y-5 animate-modern">
      {/* Status banner */}
      {(isPending || isSuccess || isError) && (
        <div className={`rounded-2xl p-4 flex items-center gap-3 ${
          isPending ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
          : isSuccess ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
        }`}>
          {isPending && <><Loader2 size={16} className="animate-spin shrink-0" /><span className="text-sm font-medium">Executing swap...</span></>}
          {isSuccess && explorerLink && (
            <>
              <CheckCircle2 size={16} className="shrink-0" />
              <span className="text-sm font-medium flex-1">Swap completed!</span>
              <a href={explorerLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium underline flex items-center gap-1">
                View <ExternalLink size={12} />
              </a>
            </>
          )}
          {isError && <><AlertTriangle size={16} className="shrink-0" /><span className="text-sm font-medium truncate">{swap.error ?? 'Error'}</span></>}
        </div>
      )}

      {/* Swap card */}
      <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5 space-y-4">
        {/* SELL */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-300">You pay</p>
            {address && (
              <button
                onClick={() => swap.setSellAmount(balanceFormatted)}
                className="text-xs text-[#F7931A] font-medium hover:underline"
              >
                Balance: {parseFloat(balanceFormatted).toFixed(4)}
              </button>
            )}
          </div>
          <div className="flex items-center justify-between gap-3">
            <input
              type="number"
              placeholder="0.00"
              value={swap.sellAmount}
              onChange={(e) => swap.setSellAmount(e.target.value)}
              min="0"
              className="text-3xl font-bold bg-transparent outline-none w-full dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
            />
            <TokenSelector
              selected={swap.sellToken}
              onSelect={handleSetSellToken}
            />
          </div>
        </div>

        {/* Flip */}
        <div className="flex justify-center -my-1 relative z-10">
          <button
            onClick={swap.flipTokens}
            disabled={isPending}
            className="w-10 h-10 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl flex items-center justify-center shadow-sm hover:shadow transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
          >
            <ArrowUpDown size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* BUY */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-300">You receive</p>
            <div className="flex items-center gap-2">
              {isGasless && (
                <span className="text-[10px] font-medium text-green-500 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Gasless</span>
              )}
              {routeName && isReady && (
                <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full">via {routeName}</span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            {isQuoting ? (
              <Loader2 size={24} className="animate-spin text-gray-500 dark:text-gray-400" />
            ) : (
              <span className={`text-3xl font-bold ${swap.buyAmount ? 'dark:text-white' : 'text-gray-300 dark:text-gray-600'}`}>
                {swap.buyAmount || '0.00'}
              </span>
            )}
            <TokenSelector
              selected={swap.buyToken}
              onSelect={handleSetBuyToken}
            />
          </div>
        </div>
      </div>

      {/* Quote details */}
      {isReady && swap.quote && (
        <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 space-y-2.5">
          {[
            { label: 'Rate', value: `1 ${swap.sellToken.symbol} ≈ ${(parseFloat(swap.buyAmount) / parseFloat(swap.sellAmount)).toFixed(4)} ${swap.buyToken.symbol}` },
            { label: 'Route', value: routeName || 'AVNU' },
            ...(swap.priceImpact ? [{ label: 'Price impact', value: `~${swap.priceImpact}`, warn: parseFloat(swap.priceImpact) > 1 }] : []),
            { label: 'Slippage', value: '0.5%' },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-300">{row.label}</span>
              <span className={`text-xs font-medium ${'warn' in row && row.warn ? 'text-red-500' : 'dark:text-white'}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Execute button */}
      <button
        onClick={isSuccess || isError ? swap.resetStatus : swap.executeSwap}
        disabled={isPending || isQuoting || isSameToken || (!isReady && !isSuccess && !isError) || !address}
        className="w-full h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:opacity-90"
      >
        {isPending ? (
          <><Loader2 size={18} className="animate-spin" /> Processing...</>
        ) : isSuccess ? (
          <><CheckCircle2 size={18} /> New Swap</>
        ) : isError ? (
          <><RefreshCw size={18} /> Retry</>
        ) : isQuoting ? (
          <><Loader2 size={18} className="animate-spin" /> Quoting...</>
        ) : !address ? (
          'Connect wallet'
        ) : (
          <><Zap size={18} /> Swap</>
        )}
      </button>

      {/* Info footer */}
      <div className="flex items-start gap-3 bg-gray-50 dark:bg-white/5 rounded-2xl p-4">
        <Info size={16} className="mt-0.5 shrink-0 text-gray-600 dark:text-gray-300" />
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          Swaps powered by <strong className="text-gray-600 dark:text-gray-300">AVNU</strong>, Starknet's leading DEX aggregator. Best route automatically selected.
        </p>
      </div>
    </div>
  );
};

export default Bridge;
