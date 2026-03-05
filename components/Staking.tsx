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
      <div className="flex items-center gap-3 p-4 border-2 border-black dark:border-white bg-yellow-50 dark:bg-yellow-900/20">
        <Loader2 size={18} className="animate-spin shrink-0 dark:text-white" />
        <span className="text-xs font-bold tracking-widest uppercase dark:text-white">Transaction in progress…</span>
      </div>
    );
  }
  if (status === 'success' && txHash) {
    return (
      <div className="flex items-center gap-3 p-4 border-2 border-black dark:border-white bg-green-50 dark:bg-green-900/20">
        <CheckCircle2 size={18} className="text-green-600 shrink-0" />
        <span className="text-xs font-bold tracking-widest uppercase dark:text-white flex-1">Transaction confirmed!</span>
        <a href={explorerUrl(txHash)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-bold underline dark:text-white">
          Ver <ExternalLink size={12} />
        </a>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="flex items-center gap-3 p-4 border-2 border-black dark:border-white bg-red-50 dark:bg-red-900/20">
        <AlertTriangle size={18} className="text-red-500 shrink-0" />
        <span className="text-xs font-bold tracking-widest uppercase dark:text-white">Transaction failed. Please try again.</span>
      </div>
    );
  }
  return null;
}

function ValidatorSelector({ selected, onChange }: { selected: ValidatorKey; onChange: (k: ValidatorKey) => void }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black tracking-widest opacity-40 dark:opacity-60 uppercase dark:text-white">Validator</p>
      <div className="grid grid-cols-3 gap-2">
        {FEATURED_VALIDATORS.map((v) => (
          <button
            key={v.key}
            onClick={() => onChange(v.key as ValidatorKey)}
            className={`py-2 px-3 border-2 text-[9px] font-black tracking-widest uppercase transition-all ${
              selected === v.key
                ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                : 'border-black/20 dark:border-white/20 text-black/40 dark:text-white/40 hover:border-black dark:hover:border-white'
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
  const strkBalance = useBalance(address, ACTIVE_TOKENS.STRK, 15_000);

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
    <div className="space-y-6">
      {/* APY Card */}
      <div className="flex flex-col gap-[2px] bg-black dark:bg-white border-2 border-black dark:border-white overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
        <div className="bg-white dark:bg-black p-6 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black tracking-widest mb-1 opacity-30 dark:opacity-70 uppercase dark:text-white">Effective APY</p>
            {isLoading && effectiveAPY === null ? (
              <Loader2 size={24} className="animate-spin dark:text-white" />
            ) : (
              <p className="text-4xl font-bold tracking-tighter dark:text-white">{effectiveAPY !== null ? `${effectiveAPY}%` : '—'}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black tracking-widest mb-1 opacity-30 dark:opacity-70 uppercase dark:text-white">Commission</p>
            <p className="text-lg font-bold dark:text-white">{commission !== null ? `${commission}%` : '—'}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-black p-6">
          <p className="text-[10px] font-black tracking-widest mb-1 opacity-30 dark:opacity-70 uppercase dark:text-white">Protocol</p>
          <p className="text-xl font-bold tracking-tighter dark:text-white uppercase">Starknet Native Staking</p>
        </div>
      </div>

      <ValidatorSelector selected={validatorKey} onChange={setValidatorKey} />

      {/* Current position */}
      {position && (
        <div className="border-2 border-black dark:border-white bg-white dark:bg-black p-5 space-y-4">
          <p className="text-[10px] font-black tracking-widest opacity-40 dark:opacity-60 uppercase dark:text-white">Your Position</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] opacity-40 dark:opacity-60 uppercase tracking-widest dark:text-white mb-1">Staked</p>
              <p className="text-xl font-bold dark:text-white">{stakedDisplay} STRK</p>
            </div>
            <div>
              <p className="text-[9px] opacity-40 dark:opacity-60 uppercase tracking-widest dark:text-white mb-1">Rewards</p>
              <p className="text-xl font-bold text-green-600">{rewardsDisplay} STRK</p>
            </div>
          </div>
          {unpoolingDisplay && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-400">
              <Clock size={14} className="shrink-0 mt-0.5 text-yellow-600" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest dark:text-white">{unpoolingDisplay} STRK exiting</p>
                {unpoolTime && (
                  <p className="text-[9px] opacity-60 mt-0.5 dark:text-white">Available: {unpoolTime.toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                )}
                {unpoolTime && new Date() >= unpoolTime && (
                  <button onClick={handleExit} disabled={isPending} className="mt-2 text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-black text-white dark:bg-white dark:text-black disabled:opacity-40">
                    Withdraw funds
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action tabs */}
      <div className="flex border-2 border-black dark:border-white bg-white dark:bg-black p-1">
        {(['stake', 'unstake', 'claim'] as const).map((a) => (
          <button key={a} onClick={() => setActiveAction(a)}
            className={`flex-1 py-2.5 text-[9px] font-black tracking-widest uppercase transition-all ${
              activeAction === a ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-black/40 dark:text-white/40 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
          >
            {a === 'stake' ? 'Stake' : a === 'unstake' ? 'Unstake' : 'Claim'}
          </button>
        ))}
      </div>

      <TxBanner status={txStatus} txHash={lastTxHash} />

      {error && txStatus !== 'pending' && (
        <div className="flex items-start gap-2 p-4 border-2 border-red-500 bg-red-50 dark:bg-red-900/20">
          <AlertTriangle size={16} className="shrink-0 text-red-500 mt-0.5" />
          <p className="text-xs font-medium dark:text-white">{error}</p>
        </div>
      )}

      {/* STAKE */}
      {activeAction === 'stake' && (
        <div className="p-8 border-2 border-black dark:border-white space-y-6 bg-white dark:bg-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)]">
          <div className="flex border-b-2 border-black dark:border-white pb-6">
            <div className="flex-1">
              <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="0.00" min="0"
                className="text-4xl font-bold bg-transparent outline-none w-full tracking-tighter dark:text-white" />
              <p className="text-[10px] font-bold opacity-30 dark:opacity-70 uppercase tracking-[0.2em] mt-2 dark:text-white">
                STRK amount · Available: {strkAvailable}
              </p>
            </div>
            <button onClick={() => setInputValue(strkAvailable)}
              className="text-[10px] font-black border-2 border-black dark:border-white px-4 h-10 self-center ml-4 bg-black text-white dark:bg-white dark:text-black uppercase tracking-widest">
              Max
            </button>
          </div>
          <div className="flex justify-between items-center text-xs font-bold dark:text-white">
            <div className="flex items-center gap-2">
              <Zap size={14} strokeWidth={3} />
              <span className="tracking-widest uppercase">Estimated annual return</span>
            </div>
            <span className="text-base tracking-tighter font-black">+{projectedReturn} STRK</span>
          </div>
          <button onClick={handleStake} disabled={isPending || !inputValue || parseFloat(inputValue) <= 0 || !address}
            className="w-full h-14 bg-black text-white dark:bg-white dark:text-black font-bold text-sm tracking-[0.2em] uppercase disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isPending ? <><Loader2 size={16} className="animate-spin" />Confirming…</> : 'Stake STRK'}
          </button>
        </div>
      )}

      {/* UNSTAKE */}
      {activeAction === 'unstake' && (
        <div className="p-8 border-2 border-black dark:border-white space-y-6 bg-white dark:bg-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)]">
          <div className="flex border-b-2 border-black dark:border-white pb-6">
            <div className="flex-1">
              <input type="number" value={unstakeInput} onChange={(e) => setUnstakeInput(e.target.value)} placeholder="0.00" min="0"
                className="text-4xl font-bold bg-transparent outline-none w-full tracking-tighter dark:text-white" />
              <p className="text-[10px] font-bold opacity-30 dark:opacity-70 uppercase tracking-[0.2em] mt-2 dark:text-white">
                STRK to unstake · Staked: {stakedDisplay}
              </p>
            </div>
            {position && (
              <button onClick={() => setUnstakeInput(stakedDisplay.replace('—', ''))}
                className="text-[10px] font-black border-2 border-black dark:border-white px-4 h-10 self-center ml-4 bg-black text-white dark:bg-white dark:text-black uppercase tracking-widest">
                Max
              </button>
            )}
          </div>
          <div className="flex items-start gap-2 p-3 border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20">
            <Clock size={14} className="shrink-0 text-yellow-600 mt-0.5" />
            <p className="text-[10px] font-medium dark:text-white leading-relaxed">
              Unstaking starts an exit period. Funds stop earning rewards and become available after the protocol lockup ends.
            </p>
          </div>
          <button onClick={handleExitIntent} disabled={isPending || !unstakeInput || parseFloat(unstakeInput) <= 0 || !position}
            className="w-full h-14 bg-black text-white dark:bg-white dark:text-black font-bold text-sm tracking-[0.2em] uppercase disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isPending ? <><Loader2 size={16} className="animate-spin" />Confirming…</> : <><ArrowDownLeft size={16} />Start Unstake</>}
          </button>
        </div>
      )}

      {/* CLAIM */}
      {activeAction === 'claim' && (
        <div className="p-8 border-2 border-black dark:border-white space-y-6 bg-white dark:bg-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)]">
          <div className="text-center space-y-3 py-4">
            <Gift size={40} className="mx-auto dark:text-white opacity-30" />
            <p className="text-[10px] font-black tracking-widest uppercase dark:text-white opacity-40">Accumulated Rewards</p>
            <p className="text-4xl font-bold tracking-tighter dark:text-white">{position ? rewardsDisplay : '—'} STRK</p>
          </div>
          <button onClick={handleClaim} disabled={isPending || !hasRewards}
            className="w-full h-14 bg-black text-white dark:bg-white dark:text-black font-bold text-sm tracking-[0.2em] uppercase disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isPending ? <><Loader2 size={16} className="animate-spin" />Confirming…</> : <><Gift size={16} />Claim Rewards</>}
          </button>
        </div>
      )}

      <div className="flex items-start gap-4 p-5 border-2 border-black dark:border-white bg-muted/50 dark:bg-zinc-900/50" id="starkzap-badge">
        <ShieldCheck size={20} className="mt-1 shrink-0 dark:text-white" strokeWidth={3} />
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-1 dark:text-white">Native Staking</p>
          <p className="text-[11px] text-black/60 dark:text-white/80 leading-relaxed font-medium">
            Delegate your STRK to a Starknet protocol validator. Your funds <strong>never leave your wallet</strong> — you only delegate staking power.
          </p>
        </div>
      </div>

      {/* Powered by StarkZap */}
      <div className="flex items-center justify-center gap-2 py-2 opacity-40">
        <Zap size={10} className="dark:text-white" />
        <span className="text-[9px] font-black uppercase tracking-widest dark:text-white">Powered by StarkZap</span>
      </div>
    </div>
  );
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-40">
      <TrendingUp size={40} strokeWidth={1.5} className="dark:text-white" />
      <p className="text-xs font-black uppercase tracking-widest dark:text-white">{label} — Coming Soon</p>
    </div>
  );
}

const Staking: React.FC<StakingProps> = ({ suggestedAmount, clearSuggestedAmount }) => {
  const [activeTab, setActiveTab] = useState<Tab>('staking');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'staking', label: 'STAKING' },
    { id: 'lending', label: 'LENDING' },
    { id: 'liquidity', label: 'LP POOLS' },
  ];

  useEffect(() => {
    if (suggestedAmount && clearSuggestedAmount) clearSuggestedAmount();
  }, [suggestedAmount, clearSuggestedAmount]);

  return (
    <div className="space-y-8 animate-modern">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h2 className="text-4xl font-bold tracking-tighter dark:text-white uppercase">GROW ASSETS</h2>
          <span className="text-[8px] px-2 py-0.5 font-black uppercase tracking-widest border-2 border-[#F7931A] text-[#F7931A]">
            MAINNET
          </span>
        </div>
        <p className="text-black/40 dark:text-white/70 text-sm font-medium uppercase tracking-widest">Institutional Yield Strategies · Powered by StarkZap</p>
      </div>

      <div className="flex border-2 border-black dark:border-white bg-white dark:bg-black p-1">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-3 text-[10px] font-black tracking-widest transition-all ${
              activeTab === t.id ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-black/40 dark:text-white/40 hover:bg-zinc-50 dark:hover:bg-zinc-900'
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
