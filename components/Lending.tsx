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
  Info,
} from 'lucide-react';
import { useLending } from '../hooks/useLending';
import { useBalance } from '../hooks/useBalance';
import { useAuth } from '../contexts/AuthContext';
import { ACTIVE_NETWORK_CONFIG } from '../config/networks';
import type { VesuAsset, UserPosition } from '../services/lending';

const TOKEN_COLORS: Record<string, string> = {
  ETH: '#627EEA', USDC: '#2775CA', USDT: '#26A17B', STRK: '#8B5CF6', WBTC: '#F7931A',
};

interface TxBannerProps {
  txHash: string | null;
  status: 'success' | 'error';
  error: string | null;
  onClose: () => void;
}

const TxBanner: React.FC<TxBannerProps> = ({ txHash, status, error, onClose }) => (
  <div className={`flex items-start gap-3 p-4 rounded-2xl ${
    status === 'success'
      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
  }`}>
    {status === 'success' ? (
      <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
    ) : (
      <AlertTriangle size={16} className="mt-0.5 shrink-0" />
    )}
    <div className="flex-1 min-w-0">
      {status === 'success' && txHash ? (
        <>
          <p className="text-sm font-medium">Transaction submitted!</p>
          <a
            href={`${ACTIVE_NETWORK_CONFIG.explorerUrl}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs flex items-center gap-1 mt-1 hover:underline"
          >
            View on explorer <ExternalLink size={10} />
          </a>
        </>
      ) : (
        <p className="text-sm font-medium break-words">{error}</p>
      )}
    </div>
    <button
      onClick={onClose}
      className="text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-white"
    >
      ✕
    </button>
  </div>
);

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
        className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 px-3 py-2 rounded-xl hover:bg-gray-200 dark:hover:bg-white/15 transition-colors"
      >
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: selected ? (TOKEN_COLORS[selected.symbol] ?? '#888') : '#888' }}>
          {selected ? selected.symbol[0] : '?'}
        </div>
        <span className="text-sm font-semibold dark:text-white">{selected?.symbol ?? 'Select'}</span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-2 z-20 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl min-w-[160px] overflow-hidden">
            {assets.map(a => (
              <button
                key={a.symbol}
                onClick={() => { onSelect(a); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: TOKEN_COLORS[a.symbol] ?? '#888' }}>
                  {a.symbol[0]}
                </div>
                <span className="font-medium dark:text-white">{a.symbol}</span>
                <span className="ml-auto text-xs font-semibold text-green-600">{a.supplyApy.toFixed(2)}%</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

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

  const tokenConfig = selectedAsset
    ? { symbol: selectedAsset.symbol, name: selectedAsset.name, address: selectedAsset.address, decimals: selectedAsset.decimals, coingeckoId: '' }
    : null;
  const { balance } = useBalance(
    userAddress || null,
    tokenConfig ?? { symbol: '', name: '', address: '', decimals: 18, coingeckoId: '' },
    15_000,
  );

  const handleMax = () => {
    if (balance?.formatted) setAmount(balance.formatted);
  };

  const handleSubmit = async () => {
    if (!selectedAsset || !amount) return;
    await onDeposit(selectedAsset, amount);
    setAmount('');
  };

  return (
    <div className="space-y-5">
      {/* Asset + Amount input */}
      <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400">Deposit</span>
          {balance?.formatted && (
            <button
              onClick={handleMax}
              className="text-xs text-[#F7931A] font-medium hover:underline"
            >
              Balance: {parseFloat(balance.formatted).toFixed(4)} {selectedAsset?.symbol}
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
            className="flex-1 bg-transparent text-2xl font-bold dark:text-white outline-none text-right placeholder:text-gray-300 dark:placeholder:text-gray-600"
          />
        </div>
      </div>

      {/* APY info */}
      {selectedAsset && (
        <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 rounded-xl px-4 py-3">
          <span className="text-xs text-gray-400">Supply APY</span>
          <span className="text-sm font-bold text-green-600">{selectedAsset.supplyApy.toFixed(2)}%</span>
        </div>
      )}

      {/* Protocol badge */}
      <div className="flex items-center gap-2 px-1">
        <span className="text-[10px] font-medium text-gray-300 dark:text-gray-600 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
          via Vesu Prime Pool
        </span>
      </div>

      {/* Submit */}
      <button
        disabled={txStatus === 'pending' || !amount || !selectedAsset || parseFloat(amount) <= 0}
        onClick={() => void handleSubmit()}
        className="w-full h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:opacity-90 flex items-center justify-center gap-2"
      >
        {txStatus === 'pending' ? (
          <><Loader2 size={14} className="animate-spin" /> Submitting...</>
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
        <TrendingUp size={32} className="text-gray-300 dark:text-gray-600" />
        <p className="text-sm font-medium text-gray-400">No active positions</p>
        <p className="text-xs text-gray-400 max-w-[200px]">
          Deposit an asset to start earning yield on Vesu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {positions.map(position => {
        const asset = assets.find(a => a.symbol === position.symbol);
        if (!asset) return null;
        return (
          <div key={position.symbol} className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: TOKEN_COLORS[asset.symbol] ?? '#888' }}>
                  {asset.symbol[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm dark:text-white">{asset.symbol}</p>
                  <p className="text-xs font-medium text-green-600">{asset.supplyApy.toFixed(2)}% APY</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm dark:text-white">{position.assetAmount.toFixed(6)}</p>
                <p className="text-xs text-gray-400">deposited</p>
              </div>
            </div>

            <button
              disabled={txStatus === 'pending'}
              onClick={() => void onWithdraw(asset, position)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-white/10 dark:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
    <div className="space-y-5 animate-modern">
      {/* Market overview */}
      {loading ? (
        <div className="flex items-center gap-2 py-6 text-gray-400">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-xs font-medium">Loading rates...</span>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {assets.slice(0, 3).map(a => (
            <div key={a.symbol} className="bg-gray-50 dark:bg-white/5 rounded-2xl p-3 text-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mx-auto mb-2" style={{ backgroundColor: TOKEN_COLORS[a.symbol] ?? '#888' }}>
                {a.symbol[0]}
              </div>
              <p className="text-xs font-semibold dark:text-white">{a.symbol}</p>
              <p className="text-sm font-bold text-green-600">{a.supplyApy.toFixed(2)}%</p>
              <p className="text-[10px] text-gray-400">APY</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-white/5 rounded-xl p-1 gap-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); resetStatus(); }}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
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

      {/* Info footer */}
      <div className="flex items-start gap-3 bg-gray-50 dark:bg-white/5 rounded-2xl p-4">
        <Info size={16} className="mt-0.5 shrink-0 text-gray-400" />
        <p className="text-xs text-gray-400 leading-relaxed">
          Lending powered by <strong className="text-gray-600 dark:text-gray-300">Vesu Protocol</strong>. Deposits go into the Prime pool and earn yield automatically.
        </p>
      </div>
    </div>
  );
};

export default Lending;
