/**
 * Verification / Privacy — Anonymous Transactions via MistCash
 *
 * Two flows:
 *   1. Deposit: Send funds into the privacy pool (generates a claim link)
 *   2. Withdraw: Claim funds using a private key + recipient address
 */
import React, { useState, useCallback } from 'react';
import {
  Shield,
  Send,
  Download,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  ChevronDown,
  Eye,
  EyeOff,
  Key,
  Lock,
  Info,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMistCash, MIST_TOKENS, type MistToken } from '../hooks/useMistCash';
import { ACTIVE_NETWORK_CONFIG } from '../config/networks';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TOKEN_COLORS: Record<string, string> = {
  ETH: '#627EEA', STRK: '#8B5CF6', USDC: '#2775CA', USDT: '#26A17B',
};

function truncate(s: string, start = 10, end = 6): string {
  if (s.length <= start + end + 3) return s;
  return `${s.slice(0, start)}…${s.slice(-end)}`;
}

// ---------------------------------------------------------------------------
// Token selector
// ---------------------------------------------------------------------------

function TokenSelector({
  selected,
  onSelect,
}: {
  selected: MistToken;
  onSelect: (t: MistToken) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 px-3 py-2 rounded-xl hover:bg-gray-200 dark:hover:bg-white/15 transition-colors"
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: TOKEN_COLORS[selected.symbol] ?? '#888' }}
        >
          {selected.symbol[0]}
        </div>
        <span className="text-sm font-semibold dark:text-white">{selected.symbol}</span>
        <ChevronDown size={14} className="text-gray-600 dark:text-gray-300" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-20 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl min-w-[140px] overflow-hidden">
            {MIST_TOKENS.map((t) => (
              <button
                key={t.symbol}
                onClick={() => { onSelect(t); setOpen(false); }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${
                  t.symbol === selected.symbol ? 'bg-gray-50 dark:bg-white/5' : ''
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ backgroundColor: TOKEN_COLORS[t.symbol] ?? '#888' }}
                >
                  {t.symbol[0]}
                </div>
                <span className="text-sm dark:text-white">{t.symbol}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ClaimLink modal — shown after successful deposit
// ---------------------------------------------------------------------------

function ClaimLinkModal({
  claimKey,
  recipientAddress,
  onClose,
}: {
  claimKey: string;
  recipientAddress: string;
  onClose: () => void;
}) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const claimLink = `${window.location.origin}/#key=${encodeURIComponent(claimKey)}&to=${encodeURIComponent(recipientAddress)}`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(claimLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback: user can manually copy */ }
  }, [claimLink]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-modern">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 size={22} className="text-green-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold dark:text-white">Deposit Complete</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">Save this claim link — it&apos;s the only way to withdraw</p>
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
          <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-300">
            This claim link is shown only once. If you lose it, the funds cannot be recovered.
          </p>
        </div>

        {/* Claiming key */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <Key size={12} /> Claiming Key
          </label>
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 rounded-xl px-3 py-2">
            <code className="text-xs dark:text-gray-300 flex-1 break-all font-mono">
              {showKey ? claimKey : '•'.repeat(20)}
            </code>
            <button onClick={() => setShowKey((s) => !s)} className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {/* Claim link */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <Lock size={12} /> Claim Link
          </label>
          <div className="bg-gray-50 dark:bg-white/5 rounded-xl px-3 py-2 break-all text-xs font-mono dark:text-gray-300">
            {truncate(claimLink, 40, 20)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-[#F7931A] text-white hover:bg-[#e8850f] transition-colors"
          >
            {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Claim Link'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

type Tab = 'deposit' | 'withdraw';

const Verification: React.FC = () => {
  const { address, walletId } = useAuth();
  const mist = useMistCash(walletId, address);

  const [activeTab, setActiveTab] = useState<Tab>('deposit');

  // Deposit state
  const [depositToken, setDepositToken] = useState<MistToken>(MIST_TOKENS[0]);
  const [depositAmount, setDepositAmount] = useState('');
  const [claimResult, setClaimResult] = useState<{ claimKey: string; recipientAddress: string } | null>(null);

  const isBlockchainAddress = !!address;
  const isBusy = ['approving', 'depositing', 'finding_tx', 'proving', 'withdrawing'].includes(mist.status);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;
    const result = await mist.deposit(depositToken, depositAmount);
    if (result) {
      setClaimResult(result);
      setDepositAmount('');
    }
  };

  const handleFind = async () => {
    await mist.findAsset();
  };

  const handleWithdraw = async () => {
    await mist.withdraw();
  };

  const handleReset = () => {
    mist.reset();
    setClaimResult(null);
    setDepositAmount('');
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  // Not connected or Privy DID
  if (!isBlockchainAddress) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20 animate-modern">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
          <Shield size={36} className="text-gray-500 dark:text-gray-400" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold dark:text-white">Anonymous Transactions</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-[260px]">
            Connect a Starknet wallet to use private transactions powered by MistCash ZK technology.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-modern">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-[#F7931A]/10 flex items-center justify-center">
          <Shield size={20} className="text-[#F7931A]" />
        </div>
        <div>
          <h2 className="text-lg font-bold dark:text-white">Private Transfer</h2>
          <p className="text-xs text-gray-600 dark:text-gray-300">ZK-powered anonymous transactions on Starknet</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/15 rounded-xl">
        <Info size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-600 dark:text-blue-300">
          Deposit tokens into the MistCash privacy pool, then withdraw with a claim link.
          No connection between sender and receiver on the public ledger.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex bg-gray-100 dark:bg-white/5 rounded-xl p-1">
        <button
          onClick={() => { setActiveTab('deposit'); handleReset(); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'deposit'
              ? 'bg-white dark:bg-white/10 text-[#F7931A] shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
          }`}
        >
          <Send size={14} /> Deposit
        </button>
        <button
          onClick={() => { setActiveTab('withdraw'); handleReset(); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'withdraw'
              ? 'bg-white dark:bg-white/10 text-[#F7931A] shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
          }`}
        >
          <Download size={14} /> Withdraw
        </button>
      </div>

      {/* Not ready */}
      {!mist.isReady && mist.status === 'initializing' && (
        <div className="flex items-center justify-center gap-2 py-8 text-gray-600 dark:text-gray-300">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Initializing privacy engine…</span>
        </div>
      )}

      {/* ─── DEPOSIT TAB ─── */}
      {activeTab === 'deposit' && mist.isReady && (
        <div className="space-y-4">
          {/* Token + amount */}
          <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">You deposit</span>
              <TokenSelector selected={depositToken} onSelect={setDepositToken} />
            </div>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full bg-transparent text-3xl font-bold dark:text-white outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              disabled={isBusy}
            />
          </div>

          {/* Deposit button */}
          <button
            onClick={handleDeposit}
            disabled={isBusy || !depositAmount || parseFloat(depositAmount) <= 0}
            className="w-full py-4 rounded-2xl font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-[#F7931A] hover:bg-[#e8850f] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isBusy ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {mist.statusMessage}
              </>
            ) : (
              <>
                <Shield size={18} />
                Deposit to Privacy Pool
              </>
            )}
          </button>
        </div>
      )}

      {/* ─── WITHDRAW TAB ─── */}
      {activeTab === 'withdraw' && mist.isReady && (
        <div className="space-y-4">
          {/* Claiming key */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <Key size={12} /> Claiming Key
            </label>
            <input
              type="text"
              placeholder="0x…"
              value={mist.claimKey}
              onChange={(e) => mist.setClaimKey(e.target.value)}
              className="w-full bg-gray-50 dark:bg-white/5 rounded-xl px-3 py-3 text-sm dark:text-white outline-none font-mono placeholder:text-gray-300 dark:placeholder:text-gray-600"
              disabled={isBusy}
            />
          </div>

          {/* Recipient address */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Recipient Address
            </label>
            <input
              type="text"
              placeholder="0x…"
              value={mist.recipientAddress}
              onChange={(e) => mist.setRecipientAddress(e.target.value)}
              className="w-full bg-gray-50 dark:bg-white/5 rounded-xl px-3 py-3 text-sm dark:text-white outline-none font-mono placeholder:text-gray-300 dark:placeholder:text-gray-600"
              disabled={isBusy}
            />
          </div>

          {/* Find button */}
          {!mist.foundAsset && (
            <button
              onClick={handleFind}
              disabled={isBusy || !mist.claimKey || !mist.recipientAddress}
              className="w-full py-4 rounded-2xl font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gray-800 dark:bg-white/10 hover:bg-gray-700 dark:hover:bg-white/15 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {mist.status === 'finding_tx' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Searching…
                </>
              ) : (
                <>
                  <Eye size={18} />
                  Find Funds
                </>
              )}
            </button>
          )}

          {/* Found asset */}
          {mist.foundAsset && (
            <div className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/15 rounded-2xl p-4">
                <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Funds found</p>
                <p className="text-2xl font-bold dark:text-white">
                  {mist.formatAmount(
                    BigInt(mist.foundAsset.amount),
                    MIST_TOKENS.find((t) => BigInt(t.address) === BigInt(mist.foundAsset!.addr))?.decimals ?? 18,
                  )}{' '}
                  <span className="text-base text-gray-600 dark:text-gray-300">
                    {MIST_TOKENS.find((t) => BigInt(t.address) === BigInt(mist.foundAsset!.addr))?.symbol ?? 'TOKEN'}
                  </span>
                </p>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={isBusy}
                className="w-full py-4 rounded-2xl font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-[#F7931A] hover:bg-[#e8850f] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isBusy ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {mist.statusMessage}
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    Withdraw Funds
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─── Shared status messages ─── */}

      {/* Error */}
      {mist.error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/15 rounded-xl">
          <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-red-600 dark:text-red-300">{mist.error}</p>
        </div>
      )}

      {/* Success (with tx hash) */}
      {mist.status === 'success' && mist.txHash && !claimResult && (
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/15 rounded-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-500" />
            <span className="text-xs text-green-600 dark:text-green-300">{mist.statusMessage}</span>
          </div>
          <a
            href={`${ACTIVE_NETWORK_CONFIG.explorerUrl}/tx/${mist.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 hover:underline"
          >
            View <ExternalLink size={12} />
          </a>
        </div>
      )}

      {/* Privacy footer */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-300 dark:text-gray-600 pt-2">
        <Lock size={12} />
        <span>Powered by MistCash ZK-SNARKs</span>
      </div>

      {/* Claim link modal */}
      {claimResult && (
        <ClaimLinkModal
          claimKey={claimResult.claimKey}
          recipientAddress={claimResult.recipientAddress}
          onClose={() => setClaimResult(null)}
        />
      )}
    </div>
  );
};

export default Verification;
