
/**
 * Lending — Session 4
 *
 * Real lending via Vesu Protocol (Prime pool, Starknet mainnet).
 * - Supply tab: deposit assets into Vesu Prime pool (ERC-4626 vTokens)
 * - Positions tab: view active deposits with live APYs
 */
import React, { useState } from 'react';
import {
  TrendingUp,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ArrowDownLeft,
  ChevronDown,
} from 'lucide-react';
import { useLending } from '../hooks/useLending';
import { useBalance } from '../hooks/useBalance';
import { useAuth } from '../contexts/AuthContext';
import { ACTIVE_NETWORK_CONFIG } from '../config/networks';
import type { VesuAsset, UserPosition } from '../services/lending';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const SYMBOL_EMOJI: Record<string, string> = {
  ETH: '⟠',
  USDC: '◎',
  USDT: '₮',
  STRK: '★',
  WBTC: '₿',
};

interface TxBannerProps {
  txHash: string | null;
  status: 'success' | 'error';
  error: string | null;
  onClose: () => void;
}

const TxBanner: React.FC<TxBannerProps> = ({ txHash, status, error, onClose }) => (
  <div
    className={`flex items-start gap-3 p-4 border-2 ${
      status === 'success'
        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
        : 'border-red-500 bg-red-50 dark:bg-red-900/20'
    }`}
  >
    {status === 'success' ? (
      <CheckCircle2 size={16} className="text-green-600 mt-0.5 shrink-0" />
    ) : (
      <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
    )}
    <div className="flex-1 min-w-0">
      {status === 'success' && txHash ? (
        <>
          <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-widest">
            Transaction submitted!
          </p>
          <a
            href={`${ACTIVE_NETWORK_CONFIG.explorerUrl}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-green-600 dark:text-green-400 flex items-center gap-1 mt-1 hover:underline"
          >
            View on explorer <ExternalLink size={10} />
          </a>
        </>
      ) : (
        <p className="text-xs font-bold text-red-600 dark:text-red-400 break-words">{error}</p>
      )}
    </div>
    <button
      onClick={onClose}
      className="text-xs font-black text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
    >
      ✕
    </button>
  </div>
);

// ---------------------------------------------------------------------------
// Asset selector dropdown
// ---------------------------------------------------------------------------

interface AssetSelectorProps {
  assets: VesuAsset[];
  selected: VesuAsset | null;
  onSelect: (a: VesuAsset) => void;
}

const AssetSelector: React.FC<AssetSelectorProps> = ({ assets, selected, onSelect }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 border-2 border-black dark:border-white bg-white dark:bg-black font-bold text-sm dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900"
      >
        <span>{selected ? SYMBOL_EMOJI[selected.symbol] ?? selected.symbol[0] : '?'}</span>
        <span>{selected?.symbol ?? 'Seleccionar'}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 border-2 border-black dark:border-white bg-white dark:bg-black shadow-lg min-w-[160px]">
          {assets.map(a => (
            <button
              key={a.symbol}
              onClick={() => { onSelect(a); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left"
            >
              <span>{SYMBOL_EMOJI[a.symbol] ?? a.symbol[0]}</span>
              <span>{a.symbol}</span>
              <span className="ml-auto text-[10px] text-green-600 font-black">{a.supplyApy.toFixed(2)}%</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Supply tab
// ---------------------------------------------------------------------------

interface SupplyTabProps {
  assets: VesuAsset[];
  txStatus: string;
  txError: string | null;
  lastTxHash: string | null;
  onDeposit: (asset: VesuAsset, amount: string) => Promise<void>;
  onResetStatus: () => void;
  userAddress: string;
}

const SupplyTab: React.FC<SupplyTabProps> = ({
  assets,
  txStatus,
  txError,
  lastTxHash,
  onDeposit,
  onResetStatus,
  userAddress,
}) => {
  const [selectedAsset, setSelectedAsset] = useState<VesuAsset | null>(assets[0] ?? null);
  const [amount, setAmount] = useState('');

  const { balance } = useBalance(
    selectedAsset?.address ?? null,
    userAddress,
    selectedAsset?.decimals ?? 18,
  );

  const handleMax = () => {
    if (balance) setAmount(balance);
  };

  const handleSubmit = async () => {
    if (!selectedAsset || !amount) return;
    await onDeposit(selectedAsset, amount);
    setAmount('');
  };

  return (
    <div className="space-y-5">
      {/* Asset + Amount input */}
      <div className="border-2 border-black dark:border-white bg-white dark:bg-black p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-black/50 dark:text-white/50">
            Depositar
          </span>
          {balance && (
            <button
              onClick={handleMax}
              className="text-[10px] font-black uppercase tracking-widest text-[#F7931A] hover:underline"
            >
              MAX: {parseFloat(balance).toFixed(4)} {selectedAsset?.symbol}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <AssetSelector
            assets={assets}
            selected={selectedAsset}
            onSelect={a => { setSelectedAsset(a); setAmount(''); }}
          />
          <input
            type="number"
            min="0"
            step="any"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="flex-1 bg-transparent text-2xl font-bold dark:text-white outline-none text-right placeholder:text-black/20 dark:placeholder:text-white/20"
          />
        </div>
      </div>

      {/* APY info */}
      {selectedAsset && (
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40">
            Supply APY
          </span>
          <span className="text-sm font-black text-green-600">
            {selectedAsset.supplyApy.toFixed(2)}%
          </span>
        </div>
      )}

      {/* Protocol badge */}
      <div className="flex items-center gap-2 px-1">
        <span className="text-[9px] font-black uppercase tracking-widest text-black/30 dark:text-white/30">
          via
        </span>
        <span className="text-[9px] font-black uppercase tracking-widest border border-black/20 dark:border-white/30 px-1.5 py-0.5 dark:text-white/50">
          Vesu Prime Pool · Mainnet
        </span>
      </div>

      {/* Submit */}
      <button
        disabled={txStatus === 'pending' || !amount || !selectedAsset || parseFloat(amount) <= 0}
        onClick={() => void handleSubmit()}
        className="w-full py-4 border-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-black text-sm uppercase tracking-widest neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
      >
        {txStatus === 'pending' ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={14} className="animate-spin" />
            Submitting…
          </span>
        ) : (
          `Deposit ${selectedAsset?.symbol ?? ''}`
        )}
      </button>

      {/* Tx banner */}
      {(txStatus === 'success' || txStatus === 'error') && (
        <TxBanner
          txHash={lastTxHash}
          status={txStatus as 'success' | 'error'}
          error={txError}
          onClose={onResetStatus}
        />
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Positions tab
// ---------------------------------------------------------------------------

interface PositionsTabProps {
  assets: VesuAsset[];
  positions: UserPosition[];
  txStatus: string;
  txError: string | null;
  lastTxHash: string | null;
  onWithdraw: (asset: VesuAsset, position: UserPosition) => Promise<void>;
  onResetStatus: () => void;
}

const PositionsTab: React.FC<PositionsTabProps> = ({
  assets,
  positions,
  txStatus,
  txError,
  lastTxHash,
  onWithdraw,
  onResetStatus,
}) => {
  if (positions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <TrendingUp size={32} className="text-black/20 dark:text-white/20" />
        <p className="text-sm font-bold text-black/40 dark:text-white/40">No active positions</p>
        <p className="text-xs text-black/30 dark:text-white/30 max-w-[200px]">
          Deposit an asset to start earning yield on Vesu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {positions.map(position => {
        const asset = assets.find(a => a.symbol === position.symbol);
        if (!asset) return null;
        return (
          <div key={position.symbol} className="border-2 border-black dark:border-white p-5 bg-white dark:bg-black space-y-3 neo-shadow-orange">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center border-2 border-black dark:border-white bg-zinc-50 dark:bg-zinc-900 font-bold text-lg dark:text-white">
                  {SYMBOL_EMOJI[asset.symbol] ?? asset.symbol[0]}
                </div>
                <div>
                  <p className="font-bold text-sm dark:text-white">{asset.symbol}</p>
                  <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">
                    {asset.supplyApy.toFixed(2)}% APY
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm dark:text-white">
                  {position.assetAmount.toFixed(6)}
                </p>
                <p className="text-[10px] text-black/40 dark:text-white/40 uppercase tracking-widest">deposited</p>
              </div>
            </div>

            <button
              disabled={txStatus === 'pending'}
              onClick={() => void onWithdraw(asset, position)}
              className="w-full flex items-center justify-center gap-2 py-2 border-2 border-black dark:border-white text-xs font-black uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {txStatus === 'pending' ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <ArrowDownLeft size={12} />
              )}
              Withdraw all
            </button>
          </div>
        );
      })}

      {(txStatus === 'success' || txStatus === 'error') && (
        <TxBanner
          txHash={lastTxHash}
          status={txStatus as 'success' | 'error'}
          error={txError}
          onClose={onResetStatus}
        />
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

type LendingTab = 'supply' | 'positions';

const Lending: React.FC = () => {
  const { address, walletId } = useAuth();
  const [activeTab, setActiveTab] = useState<LendingTab>('supply');

  const {
    assets,
    positions,
    loading,
    txStatus,
    txError,
    lastTxHash,
    deposit,
    withdraw,
    resetStatus,
  } = useLending(address, walletId);

  const TABS: { id: LendingTab; label: string }[] = [
    { id: 'supply', label: 'Deposit' },
    { id: 'positions', label: `Positions${positions.length ? ` (${positions.length})` : ''}` },
  ];

  return (
    <div className="space-y-8 animate-modern">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h2 className="text-4xl font-bold tracking-tighter uppercase dark:text-white">LENDING</h2>
          <span className="text-[8px] px-2 py-0.5 font-black uppercase tracking-widest border-2 border-[#F7931A] text-[#F7931A]">
            VESU · MAINNET
          </span>
        </div>
        <p className="text-black/40 dark:text-white/70 text-sm font-medium uppercase tracking-widest">
          Prime Pool · Starknet Mainnet
        </p>
      </div>

      {/* Market overview */}
      {loading ? (
        <div className="flex items-center gap-2 py-6 text-black/40 dark:text-white/40">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest">Loading rates…</span>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {assets.slice(0, 3).map(a => (
            <div key={a.symbol} className="border-2 border-black dark:border-white p-3 bg-white dark:bg-black text-center">
              <p className="text-lg">{SYMBOL_EMOJI[a.symbol] ?? a.symbol[0]}</p>
              <p className="text-[10px] font-black uppercase tracking-widest dark:text-white">{a.symbol}</p>
              <p className="text-sm font-black text-green-600">{a.supplyApy.toFixed(2)}%</p>
              <p className="text-[8px] text-black/30 dark:text-white/30 uppercase tracking-widest">APY</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b-2 border-black dark:border-white flex">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); resetStatus(); }}
            className={`px-5 py-3 text-xs font-black uppercase tracking-widest border-r-2 border-black dark:border-white last:border-r-0 dark:text-white transition-colors ${
              activeTab === tab.id
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'supply' ? (
        <SupplyTab
          assets={assets}
          txStatus={txStatus}
          txError={txError}
          lastTxHash={lastTxHash}
          onDeposit={deposit}
          onResetStatus={resetStatus}
          userAddress={address ?? ''}
        />
      ) : (
        <PositionsTab
          assets={assets}
          positions={positions}
          txStatus={txStatus}
          txError={txError}
          lastTxHash={lastTxHash}
          onWithdraw={withdraw}
          onResetStatus={resetStatus}
        />
      )}
    </div>
  );
};

export default Lending;
