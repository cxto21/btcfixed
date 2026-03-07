/**
 * Staking — Session 2
 *
 * Real STRK delegation staking via StarkZap SDK.
 * - STAKING tab: live position data, stake/unstake/claim transactions
 * - LENDING / LP POOLS: coming soon placeholders
 */
import React, { useState, useEffect } from 'react';
import {
  Zap,
  ShieldCheck,
  TrendingUp,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Clock,
  ArrowDownLeft,
  Gift,
  Info,
} from 'lucide-react';
import { useStaking, type TxStatus } from '../hooks/useStaking';
import { useBalance } from '../hooks/useBalance';
import { useAuth } from '../contexts/AuthContext';
import { ACTIVE_TOKENS } from '../config/tokens';
import { FEATURED_VALIDATORS, type ValidatorKey } from '../services/staking';
import { ACTIVE_NETWORK_CONFIG } from '../config/networks';

interface StakingProps {
  suggestedAmount?: string | null;
  clearSuggestedAmount?: () => void;
}

type Tab = 'staking' | 'lending' | 'liquidity';

function formatAmountDisplay(base: bigint, decimals = 18, dp = 4): string {
  const divisor = 10n ** BigInt(decimals);
  const whole = base / divisor;
  const frac = base % divisor;
  const fracStr = frac.toString().padStart(decimals, '0').slice(0, dp);
  return `${whole}.${fracStr}`;
}

function explorerUrl(txHash: string): string {
  return `${ACTIVE_NETWORK_CONFIG.explorerUrl}/tx/${txHash}`;
}

function TxBanner({ status, txHash }: { status: TxStatus; txHash: string | null }) {
  if (status === 'idle') return null;
  if (status === 'pending') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
        <Loader2 size={16} className="animate-spin shrink-0" />
        <span className="text-sm font-medium">Transaction in progress...</span>
      </div>
    );
  }
  if (status === 'success' && txHash) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
        <CheckCircle2 size={16} className="shrink-0" />
        <span className="text-sm font-medium flex-1">Transaction confirmed!</span>
        <a href={explorerUrl(txHash)} target="_blank" rel="noopener noreferrer" className="text-sm font-medium underline flex items-center gap-1">
          View <ExternalLink size={12} />
        </a>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400">
        <AlertTriangle size={16} className="shrink-0" />
        <span className="text-sm font-medium">Transaction failed. Please try again.</span>
      </div>
    );
  }
  return null;
}

function ValidatorSelector({ selected, onChange }: { selected: ValidatorKey; onChange: (k: ValidatorKey) => void }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Validator</p>
      <div className="grid grid-cols-3 gap-2">
        {FEATURED_VALIDATORS.map((v) => (
          <button
            key={v.key}
            onClick={() => onChange(v.key as ValidatorKey)}
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              selected === v.key
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}
          >
            {v.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function StakingTab({ suggestedAmount }: { suggestedAmount?: string | null }) {
  const { address } = useAuth();
  const [validatorKey, setValidatorKey] = useState<ValidatorKey>('AVNU');
  const [inputValue, setInputValue] = useState(suggestedAmount ?? '');
  const [unstakeInput, setUnstakeInput] = useState('');
  const [activeAction, setActiveAction] = useState<'stake' | 'unstake' | 'claim'>('stake');

  const { commission, effectiveAPY, position, isLoading, error, txStatus, lastTxHash, stake, exitIntent, exit, claimRewards } = useStaking(validatorKey);
  const { balance: strkBalance } = useBalance(address, ACTIVE_TOKENS.STRK, 15_000);

  useEffect(() => { if (suggestedAmount) setInputValue(suggestedAmount); }, [suggestedAmount]);

  const strkAvailable = strkBalance?.formatted ?? '0';
  const stakedDisplay = position ? formatAmountDisplay(position.staked.toBase(), 18, 4) : '—';
  const rewardsDisplay = position ? formatAmountDisplay(position.rewards.toBase(), 18, 6) : '—';
  const unpoolingDisplay = position?.unpooling ? formatAmountDisplay(position.unpooling.toBase(), 18, 4) : null;
  const unpoolTime = position?.unpoolTime ?? null;
  const projectedReturn = inputValue && effectiveAPY ? (parseFloat(inputValue) * (effectiveAPY / 100)).toFixed(4) : '0.0000';
  const isPending = txStatus === 'pending';
  const hasRewards = position ? position.rewards.toBase() > 0n : false;

  async function handleStake() {
    if (!inputValue || parseFloat(inputValue) <= 0) return;
    try { await stake(inputValue); setInputValue(''); } catch { /* TxBanner shows error */ }
  }
  async function handleExitIntent() {
    if (!unstakeInput || parseFloat(unstakeInput) <= 0) return;
    try { await exitIntent(unstakeInput); setUnstakeInput(''); } catch { /* TxBanner shows error */ }
  }
  async function handleExit() { try { await exit(); } catch { /* TxBanner shows error */ } }
  async function handleClaim() { try { await claimRewards(); } catch { /* TxBanner shows error */ } }

  return (
    <div className="space-y-5">
      {/* APY Card */}
      <div className="bg-gradient-to-br from-[#F7931A] to-[#E67E00] rounded-2xl p-5 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-medium text-white/70 mb-1">Effective APY</p>
            {isLoading && effectiveAPY === null ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <p className="text-4xl font-bold">{effectiveAPY !== null ? `${effectiveAPY}%` : '—'}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-white/70 mb-1">Commission</p>
            <p className="text-lg font-bold">{commission !== null ? `${commission}%` : '—'}</p>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-white/20">
          <p className="text-xs font-medium text-white/70">Starknet Native Staking</p>
        </div>
      </div>

      <ValidatorSelector selected={validatorKey} onChange={setValidatorKey} />

      {/* Current position */}
      {position && (
        <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5 space-y-4">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Your Position</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Staked</p>
              <p className="text-xl font-bold dark:text-white">{stakedDisplay} STRK</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Rewards</p>
              <p className="text-xl font-bold text-green-600">{rewardsDisplay} STRK</p>
            </div>
          </div>
          {unpoolingDisplay && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <Clock size={14} className="shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="text-xs font-medium dark:text-white">{unpoolingDisplay} STRK exiting</p>
                {unpoolTime && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">Available: {unpoolTime.toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                )}
                {unpoolTime && new Date() >= unpoolTime && (
                  <button onClick={handleExit} disabled={isPending} className="mt-2 text-xs font-semibold px-3 py-1 rounded-lg bg-black dark:bg-white text-white dark:text-black disabled:opacity-40">
                    Withdraw funds
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action tabs */}
      <div className="flex bg-gray-100 dark:bg-white/5 rounded-xl p-1 gap-1">
        {(['stake', 'unstake', 'claim'] as const).map((a) => (
          <button key={a} onClick={() => setActiveAction(a)}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all ${
              activeAction === a ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
            }`}
          >
            {a === 'stake' ? 'Stake' : a === 'unstake' ? 'Unstake' : 'Claim'}
          </button>
        ))}
      </div>

      <TxBanner status={txStatus} txHash={lastTxHash} />

      {error && txStatus !== 'pending' && (
        <div className="flex items-start gap-2 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20">
          <AlertTriangle size={16} className="shrink-0 text-red-500 mt-0.5" />
          <p className="text-xs font-medium dark:text-white">{error}</p>
        </div>
      )}

      {/* STAKE */}
      {activeAction === 'stake' && (
        <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5 space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="0.00" min="0"
                className="text-3xl font-bold bg-transparent outline-none w-full dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600" />
              <button onClick={() => setInputValue(strkAvailable)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-black dark:bg-white text-white dark:text-black shrink-0 ml-3">
                Max
              </button>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              STRK amount · Available: {strkAvailable}
            </p>
          </div>
          <div className="flex justify-between items-center bg-white dark:bg-[#1a1a1a] rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Zap size={14} />
              <span>Estimated annual return</span>
            </div>
            <span className="text-sm font-bold dark:text-white">+{projectedReturn} STRK</span>
          </div>
          <button onClick={handleStake} disabled={isPending || !inputValue || parseFloat(inputValue) <= 0 || !address}
            className="w-full h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:opacity-90">
            {isPending ? <><Loader2 size={16} className="animate-spin" />Confirming...</> : 'Stake STRK'}
          </button>
        </div>
      )}

      {/* UNSTAKE */}
      {activeAction === 'unstake' && (
        <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5 space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <input type="number" value={unstakeInput} onChange={(e) => setUnstakeInput(e.target.value)} placeholder="0.00" min="0"
                className="text-3xl font-bold bg-transparent outline-none w-full dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600" />
              {position && (
                <button onClick={() => setUnstakeInput(stakedDisplay.replace('—', ''))}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-black dark:bg-white text-white dark:text-black shrink-0 ml-3">
                  Max
                </button>
              )}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              STRK to unstake · Staked: {stakedDisplay}
            </p>
          </div>
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
            <Clock size={14} className="shrink-0 text-amber-600 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              Unstaking starts an exit period. Funds stop earning rewards and become available after the protocol lockup ends.
            </p>
          </div>
          <button onClick={handleExitIntent} disabled={isPending || !unstakeInput || parseFloat(unstakeInput) <= 0 || !position}
            className="w-full h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:opacity-90">
            {isPending ? <><Loader2 size={16} className="animate-spin" />Confirming...</> : <><ArrowDownLeft size={16} />Start Unstake</>}
          </button>
        </div>
      )}

      {/* CLAIM */}
      {activeAction === 'claim' && (
        <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5 space-y-5">
          <div className="text-center space-y-3 py-4">
            <Gift size={40} className="mx-auto text-gray-500 dark:text-gray-400" />
            <p className="text-xs text-gray-600 dark:text-gray-300">Accumulated Rewards</p>
            <p className="text-4xl font-bold dark:text-white">{position ? rewardsDisplay : '—'} STRK</p>
          </div>
          <button onClick={handleClaim} disabled={isPending || !hasRewards}
            className="w-full h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:opacity-90">
            {isPending ? <><Loader2 size={16} className="animate-spin" />Confirming...</> : <><Gift size={16} />Claim Rewards</>}
          </button>
        </div>
      )}

      {/* Info footer */}
      <div className="flex items-start gap-3 bg-gray-50 dark:bg-white/5 rounded-2xl p-4">
        <Info size={16} className="mt-0.5 shrink-0 text-gray-600 dark:text-gray-300" />
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          Delegate your STRK to a Starknet validator. Your funds <strong className="text-gray-600 dark:text-gray-300">never leave your wallet</strong> — you only delegate staking power.
        </p>
      </div>

      {/* Powered by StarkZap */}
      <div className="flex items-center justify-center gap-2 py-1 opacity-40">
        <Zap size={10} className="dark:text-white" />
        <span className="text-[10px] font-medium dark:text-white">Powered by StarkZap</span>
      </div>
    </div>
  );
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <TrendingUp size={40} strokeWidth={1.5} className="text-gray-500 dark:text-gray-400" />
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{label} — Coming Soon</p>
    </div>
  );
}

const Staking: React.FC<StakingProps> = ({ suggestedAmount, clearSuggestedAmount }) => {
  const [activeTab, setActiveTab] = useState<Tab>('staking');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'staking', label: 'Staking' },
    { id: 'lending', label: 'Lending' },
    { id: 'liquidity', label: 'LP Pools' },
  ];

  useEffect(() => {
    if (suggestedAmount && clearSuggestedAmount) clearSuggestedAmount();
  }, [suggestedAmount, clearSuggestedAmount]);

  return (
    <div className="space-y-5 animate-modern">
      <div className="flex bg-gray-100 dark:bg-white/5 rounded-xl p-1 gap-1">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === t.id ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'staking' && <StakingTab suggestedAmount={suggestedAmount} />}
      {activeTab === 'lending' && <ComingSoon label="Lending" />}
      {activeTab === 'liquidity' && <ComingSoon label="LP Pools" />}
    </div>
  );
};

export default Staking;
