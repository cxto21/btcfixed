/**
 * Bridge (Swap Terminal) — Session 3
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
} from 'lucide-react';
import { useSwap } from '../hooks/useSwap';
import { useBalance } from '../hooks/useBalance';
import { useAuth } from '../contexts/AuthContext';
import { ACTIVE_TOKENS, type TokenConfig } from '../config/tokens';
import { SWAP_TOKENS, type SwapTokenSymbol } from '../services/swap';
import { ACTIVE_NETWORK_CONFIG } from '../config/networks';

// ---------------------------------------------------------------------------
// Token selector dropdown
// ---------------------------------------------------------------------------

const TOKEN_EMOJI: Record<string, string> = {
  ETH: '⟠',
  STRK: '✦',
  USDC: '$',
  USDT: '₮',
  WBTC: '₿',
};

function TokenSelector({
  selected,
  onSelect,
  disabledSymbol,
}: {
  selected: TokenConfig;
  onSelect: (t: TokenConfig) => void;
  disabledSymbol: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 border-2 border-black dark:border-white px-3 py-2 bg-white dark:bg-black hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
      >
        <span className="text-base font-black dark:text-white">{TOKEN_EMOJI[selected.symbol] ?? '◈'}</span>
        <span className="text-sm font-black dark:text-white">{selected.symbol}</span>
        <ChevronDown size={12} className="dark:text-white" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-black border-2 border-black dark:border-white shadow-[4px_4px_0_rgba(0,0,0,1)] min-w-[120px]">
            {SWAP_TOKENS.map((sym) => {
              const token = ACTIVE_TOKENS[sym as SwapTokenSymbol];
              if (!token) return null;
              const isDisabled = sym === disabledSymbol;
              return (
                <button
                  key={sym}
                  onClick={() => { if (!isDisabled) { onSelect(token); setOpen(false); } }}
                  disabled={isDisabled}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs font-black tracking-widest transition-colors ${
                    isDisabled
                      ? 'opacity-30 cursor-not-allowed dark:text-white'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:text-white'
                  } ${sym === selected.symbol ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}
                >
                  <span>{TOKEN_EMOJI[sym] ?? '◈'}</span>
                  <span>{sym}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Route badge
// ---------------------------------------------------------------------------

function RouteBadge({ label }: { label: string }) {
  return (
    <div className="px-2 py-0.5 bg-black dark:bg-white text-white dark:text-black text-[8px] font-black tracking-widest uppercase">
      {label}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bridge component
// ---------------------------------------------------------------------------

const Bridge: React.FC = () => {
  const { address } = useAuth();
  const swap = useSwap();

  // Balance of sell token
  const balance = useBalance(address, swap.sellToken, 20_000);
  const balanceFormatted = balance?.formatted ?? '0';

  const isQuoting = swap.status === 'quoting';
  const isReady = swap.status === 'ready';
  const isPending = swap.status === 'pending';
  const isSuccess = swap.status === 'success';
  const isError = swap.status === 'error';

  const routeName = swap.quote?.routes?.[0]?.name;
  const isGasless =
    swap.quote?.gasless &&
    typeof swap.quote.gasless === 'object' &&
    (swap.quote.gasless as { active: boolean }).active;

  const explorerLink = swap.lastTxHash
    ? `${ACTIVE_NETWORK_CONFIG.explorerUrl}/tx/${swap.lastTxHash}`
    : null;

  return (
    <div className="space-y-10 animate-modern">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tighter uppercase dark:text-white">SWAP TERMINAL</h2>
        <p className="text-black/40 dark:text-white/70 text-sm font-medium uppercase tracking-widest">
          Instant Liquidity · AVNU DEX Aggregator
        </p>
      </div>

      {/* Swap card */}
      <div className="space-y-[2px] bg-black dark:bg-white border-2 border-black dark:border-white overflow-visible">
        <div className="p-8 bg-white dark:bg-black space-y-6">

          {/* SELL */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 dark:opacity-70 dark:text-white">
                Sell
              </p>
              {address && (
                <button
                  onClick={() => swap.setSellAmount(balanceFormatted)}
                  className="text-[9px] font-black opacity-40 dark:opacity-60 dark:text-white hover:opacity-100 transition-opacity uppercase tracking-widest"
                >
                  Balance: {balanceFormatted} {swap.sellToken.symbol}
                </button>
              )}
            </div>
            <div className="flex items-center justify-between gap-4">
              <input
                type="number"
                placeholder="0.00"
                value={swap.sellAmount}
                onChange={(e) => swap.setSellAmount(e.target.value)}
                min="0"
                className="text-4xl font-bold bg-transparent outline-none w-full tracking-tighter dark:text-white"
              />
              <TokenSelector
                selected={swap.sellToken}
                onSelect={swap.setSellToken}
                disabledSymbol={swap.buyToken.symbol}
              />
            </div>
          </div>

          {/* Flip button */}
          <div className="flex justify-center -my-1 relative z-10">
            <button
              onClick={swap.flipTokens}
              disabled={isPending}
              className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center border-4 border-white dark:border-black transition-transform hover:scale-110 active:scale-95 disabled:opacity-40"
            >
              <ArrowUpDown size={20} strokeWidth={3} />
            </button>
          </div>

          {/* BUY */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 dark:opacity-70 dark:text-white">
                Receive (estimated)
              </p>
              {isGasless && <RouteBadge label="Gasless" />}
            </div>
            <div className="flex items-center justify-between gap-4">
              {isQuoting ? (
                <Loader2 size={28} className="animate-spin dark:text-white opacity-40" />
              ) : (
                <span className={`text-4xl font-bold tracking-tighter ${swap.buyAmount ? 'dark:text-white' : 'opacity-30 dark:opacity-40 dark:text-white'}`}>
                  {swap.buyAmount || '0.00'}
                </span>
              )}
              <TokenSelector
                selected={swap.buyToken}
                onSelect={swap.setBuyToken}
                disabledSymbol={swap.sellToken.symbol}
              />
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className={`p-4 flex items-center gap-3 transition-colors ${
          isPending
            ? 'bg-yellow-400 text-black'
            : isSuccess
            ? 'bg-green-700 text-white'
            : isError
            ? 'bg-red-700 text-white'
            : 'bg-black dark:bg-white text-white dark:text-black'
        }`}>
          {isPending && <><Loader2 size={16} className="animate-spin shrink-0" /><span className="text-[10px] font-black uppercase tracking-widest">Executing swap on Starknet…</span></>}
          {isSuccess && explorerLink && (
            <>
              <CheckCircle2 size={16} className="shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-widest flex-1">Swap completed!</span>
              <a href={explorerLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] font-black underline">
                View <ExternalLink size={11} />
              </a>
            </>
          )}
          {isError && (
            <>
              <AlertTriangle size={16} className="shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-widest truncate">{swap.error ?? 'Error'}</span>
            </>
          )}
          {!isPending && !isSuccess && !isError && (
            <>
              <Zap size={16} className="text-[#F7931A]" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isQuoting ? 'Finding best route…' : isReady && routeName ? `Route: ${routeName}` : 'Powered by AVNU'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Quote details */}
      {isReady && swap.quote && (
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-black/10 dark:border-white/20 p-4 space-y-2 font-mono">
          <div className="flex justify-between items-center text-[9px] font-bold dark:text-white">
            <span className="opacity-40 dark:opacity-70">EXCHANGE RATE:</span>
            <span>
              1 {swap.sellToken.symbol} ≈{' '}
              {(parseFloat(swap.buyAmount) / parseFloat(swap.sellAmount)).toFixed(4)}{' '}
              {swap.buyToken.symbol}
            </span>
          </div>
          <div className="flex justify-between items-center text-[9px] font-bold dark:text-white">
            <span className="opacity-40 dark:opacity-70">ROUTE:</span>
            <span>{routeName || 'AVNU'}</span>
          </div>
          {swap.priceImpact && (
            <div className="flex justify-between items-center text-[9px] font-bold dark:text-white">
              <span className="opacity-40 dark:opacity-70">PRICE IMPACT:</span>
              <span className={parseFloat(swap.priceImpact) > 1 ? 'text-red-500' : 'text-green-600'}>
                ~{swap.priceImpact}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center text-[9px] font-bold dark:text-white">
            <span className="opacity-40 dark:opacity-70">SLIPPAGE:</span>
            <span>0.5%</span>
          </div>
        </div>
      )}

      {/* Execute button */}
      <button
        onClick={isSuccess || isError ? swap.resetStatus : swap.executeSwap}
        disabled={isPending || isQuoting || (!isReady && !isSuccess && !isError) || !address}
        className="w-full h-16 bg-black dark:bg-white text-white dark:text-black text-base font-bold tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed uppercase transition-opacity"
      >
        {isPending ? (
          <><Loader2 size={20} className="animate-spin" /> Processing…</>
        ) : isSuccess ? (
          <><CheckCircle2 size={20} /> New Swap</>
        ) : isError ? (
          <><RefreshCw size={20} /> Retry</>
        ) : isQuoting ? (
          <><Loader2 size={20} className="animate-spin" /> Quoting…</>
        ) : !address ? (
          'Connect your wallet'
        ) : (
          <><Zap size={20} /> Execute Swap</>
        )}
      </button>

      {/* Info */}
      <div className="flex items-start gap-4 p-5 border-2 border-black dark:border-white bg-muted/50 dark:bg-zinc-900/50">
        <ArrowUpDown size={20} className="mt-1 shrink-0 dark:text-white" strokeWidth={3} />
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-1 dark:text-white">DEX Aggregator</p>
          <p className="text-[11px] text-black/60 dark:text-white/80 leading-relaxed font-medium">
            Swaps are executed by <strong>AVNU</strong>, Starknet’s leading liquidity aggregator. The best available route is always selected across multiple DEXs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Bridge;
