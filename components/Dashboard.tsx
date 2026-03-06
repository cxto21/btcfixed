import React, { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis } from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Zap,
  Repeat,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  RefreshCw,
  Send,
  Download,
  ChevronRight,
  Eye,
  EyeOff,
  X,
  Copy,
  Check,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../contexts/AuthContext';
import { useBalance } from '../hooks/useBalance';
import { usePrices } from '../hooks/usePrices';
import { useActivity } from '../hooks/useActivity';
import { ACTIVE_TOKENS } from '../config/tokens';
import { truncateAddress } from '../config/wallets';

const chartData = [
  { v: 40 }, { v: 42 }, { v: 41 }, { v: 45 }, { v: 44 }, { v: 48 }, { v: 52 },
];

// Token icon colors
const TOKEN_COLORS: Record<string, string> = {
  WBTC: '#F7931A',
  ETH: '#627EEA',
  STRK: '#8B5CF6',
};

interface DashboardProps {
  isPrivacyMode: boolean;
  setIsPrivacyMode: (v: boolean) => void;
  onEarnYield: (amount: string) => void;
  onSeeAllActivity: () => void;
}

/* ─── Receive Modal ─── */
const ReceiveModal: React.FC<{ address: string; onClose: () => void }> = ({ address, onClose }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-5 animate-modern">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold dark:text-white">Receive</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-2xl">
            <QRCodeSVG value={address} size={200} level="M" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-400 text-center">Your Starknet Address</p>
          <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3">
            <p className="text-xs font-mono text-gray-600 dark:text-gray-300 break-all text-center leading-relaxed">
              {address}
            </p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="w-full h-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
        >
          {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Address</>}
        </button>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ isPrivacyMode, setIsPrivacyMode, onEarnYield, onSeeAllActivity }) => {
  const { address } = useAuth();
  const [displayCurrency, setDisplayCurrency] = useState<'USD' | 'BTC'>('USD');
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const recentActivity = useActivity();

  // Only use address for on-chain operations if it's a real blockchain address
  const isValidAddress = address && !address.startsWith('did:');
  const onChainAddress = isValidAddress ? address : null;

  const { balance: ethBalance, isLoading: ethLoading, refetch: refetchEth } = useBalance(
    onChainAddress,
    ACTIVE_TOKENS.ETH,
    15_000,
  );
  const { balance: strkBalance, isLoading: strkLoading, refetch: refetchStrk } = useBalance(
    onChainAddress,
    ACTIVE_TOKENS.STRK,
    15_000,
  );
  const { balance: wbtcBalance, isLoading: wbtcLoading, refetch: refetchWbtc } = useBalance(
    onChainAddress,
    ACTIVE_TOKENS.WBTC,
    15_000,
  );

  const { prices } = usePrices();
  const btcPrice = prices.bitcoin?.usd ?? 95000;
  const ethPrice = prices.ethereum?.usd ?? 3000;
  const strkPrice = prices.starknet?.usd ?? 0.5;

  const ethUsd = parseFloat(ethBalance.formatted) * ethPrice;
  const strkUsd = parseFloat(strkBalance.formatted) * strkPrice;
  const wbtcUsd = parseFloat(wbtcBalance.formatted) * btcPrice;
  const totalUsd = ethUsd + strkUsd + wbtcUsd;
  const totalBtc = btcPrice > 0 ? totalUsd / btcPrice : 0;

  const isLoading = ethLoading || strkLoading || wbtcLoading;

  const hide = (val: string) => (isPrivacyMode ? '••••••' : val);

  const displayValue =
    displayCurrency === 'USD'
      ? totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : totalBtc.toFixed(8);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Stake':        return <Zap size={16} className="text-[#F7931A]" />;
      case 'Unstake':      return <ArrowDownLeft size={16} className="text-red-500" />;
      case 'ClaimRewards': return <Gift size={16} className="text-green-500" />;
      case 'Swap':         return <Repeat size={16} className="text-blue-500" />;
      case 'Supply':       return <ArrowUpRight size={16} className="text-green-500" />;
      case 'Withdraw':     return <ArrowDownLeft size={16} className="text-red-500" />;
      default:             return <CheckCircle2 size={16} className="text-gray-400" />;
    }
  };

  const tokens = [
    {
      symbol: 'WBTC',
      name: 'Bitcoin',
      balance: wbtcBalance.formatted,
      usd: wbtcUsd,
      loading: wbtcLoading,
      change: prices.bitcoin?.usd_24h_change,
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: ethBalance.formatted,
      usd: ethUsd,
      loading: ethLoading,
      change: prices.ethereum?.usd_24h_change,
    },
    {
      symbol: 'STRK',
      name: 'Starknet',
      balance: strkBalance.formatted,
      usd: strkUsd,
      loading: strkLoading,
      change: prices.starknet?.usd_24h_change,
    },
  ];

  return (
    <div className="space-y-6 animate-modern relative z-10">
      {/* ─── Total Portfolio ─── */}
      <section className="text-center pt-2 pb-4">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1">Total portfolio</p>
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-4xl font-bold tracking-tight dark:text-white">
            {displayCurrency === 'USD' ? '$' : '₿'}
            {hide(displayValue)}
          </h2>
          <button
            onClick={() => setIsPrivacyMode(!isPrivacyMode)}
            className={`p-1.5 rounded-full transition-all ${isPrivacyMode ? 'text-[#F7931A]' : 'text-gray-300 dark:text-gray-600 hover:text-gray-500'}`}
            aria-label="Toggle privacy mode"
          >
            {isPrivacyMode ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {isLoading && (
            <RefreshCw size={14} className="animate-spin text-gray-300 dark:text-gray-600" />
          )}
        </div>
        <button
          onClick={() => setDisplayCurrency(displayCurrency === 'USD' ? 'BTC' : 'USD')}
          className="mt-1 text-xs font-medium text-[#F7931A] hover:underline"
        >
          Show in {displayCurrency === 'USD' ? 'BTC' : 'USD'}
        </button>
      </section>

      {/* ─── Quick Actions ─── */}
      <div className="flex justify-center gap-6">
        {[
          { icon: Send, label: 'Swap', action: () => onEarnYield('0') },
          { icon: Download, label: 'Receive', action: () => isValidAddress && setShowReceiveModal(true) },
          { icon: TrendingUp, label: 'Earn', action: () => onEarnYield(ethBalance.formatted) },
          { icon: RefreshCw, label: 'Refresh', action: () => { refetchEth(); refetchStrk(); refetchWbtc(); } },
        ].map((action) => (
          <button
            key={action.label}
            onClick={action.action}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center group-hover:bg-[#F7931A]/10 transition-colors">
              <action.icon size={20} className="text-gray-600 dark:text-gray-300 group-hover:text-[#F7931A] transition-colors" />
            </div>
            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{action.label}</span>
          </button>
        ))}
      </div>

      {/* ─── Yield Banner ─── */}
      <button
        onClick={() => onEarnYield(ethBalance.formatted)}
        className="w-full bg-gradient-to-r from-[#F7931A] to-[#F7A541] rounded-2xl p-4 flex items-center justify-between group hover:shadow-lg transition-shadow"
      >
        <div className="text-left">
          <p className="text-white/80 text-xs font-medium">Earn up to</p>
          <p className="text-white text-2xl font-bold">5.25% APR</p>
          <p className="text-white/70 text-[11px]">Stake STRK and earn rewards</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="w-12 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="name" hide />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="#fff"
                  strokeWidth={2}
                  fillOpacity={0.2}
                  fill="#fff"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <ChevronRight size={18} className="text-white/60 group-hover:translate-x-1 transition-transform" />
        </div>
      </button>

      {/* ─── Assets ─── */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-semibold dark:text-white">Assets</h3>
        </div>
        <div className="space-y-1">
          {tokens.map((token) => (
            <div
              key={token.symbol}
              className="flex items-center justify-between py-3.5 px-1 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: TOKEN_COLORS[token.symbol] ?? '#888' }}
                >
                  {token.symbol === 'WBTC' ? '₿' : token.symbol[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm dark:text-white">{token.name}</p>
                  <p className="text-xs text-gray-400">
                    {token.loading ? '...' : `${parseFloat(token.balance).toFixed(4)} ${token.symbol}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm dark:text-white">
                  {token.loading ? '...' : hide(`$${token.usd.toLocaleString('en-US', { maximumFractionDigits: 2 })}`)}
                </p>
                {token.change != null && (
                  <p className={`text-xs font-medium flex items-center justify-end gap-0.5 ${token.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {token.change >= 0 ? '+' : ''}{token.change.toFixed(2)}%
                    {token.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Recent Activity ─── */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-semibold dark:text-white">Recent Activity</h3>
          <button
            onClick={onSeeAllActivity}
            className="text-xs font-medium text-[#F7931A] hover:underline"
          >
            See all
          </button>
        </div>
        <div className="bg-gray-50 dark:bg-white/5 rounded-2xl overflow-hidden">
          {recentActivity.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-400 dark:text-gray-500">
                No transactions yet
              </p>
              <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
                Start by staking, swapping, or supplying
              </p>
            </div>
          ) : (
            recentActivity.slice(0, 3).map((activity, idx) => (
              <div
                key={activity.id}
                className={`px-4 py-3.5 flex items-center justify-between ${
                  idx < Math.min(recentActivity.length, 3) - 1 ? 'border-b border-gray-100 dark:border-white/5' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white dark:bg-black/40 flex items-center justify-center shadow-sm">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium dark:text-white">{activity.type}</p>
                    <p className="text-xs text-gray-400">{activity.label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-green-500" />
                  <span className="text-xs font-medium text-green-500">Done</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ─── Receive Modal ─── */}
      {showReceiveModal && isValidAddress && address && (
        <ReceiveModal address={address} onClose={() => setShowReceiveModal(false)} />
      )}
    </div>
  );
};

export default Dashboard;