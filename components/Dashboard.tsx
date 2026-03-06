import React, { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis } from 'recharts';
import {
  ShieldCheck,
  Lock,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Zap,
  Repeat,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBalance } from '../hooks/useBalance';
import { usePrices } from '../hooks/usePrices';
import { useActivity } from '../hooks/useActivity';
import { ACTIVE_TOKENS } from '../config/tokens';
import { ACTIVE_NETWORK } from '../config/networks';

const chartData = [
  { v: 40 }, { v: 42 }, { v: 41 }, { v: 45 }, { v: 44 }, { v: 48 }, { v: 52 },
];

interface DashboardProps {
  isPrivacyMode: boolean;
  onEarnYield: (amount: string) => void;
  onSeeAllActivity: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ isPrivacyMode, onEarnYield, onSeeAllActivity }) => {
  const { address } = useAuth();
  const [displayCurrency, setDisplayCurrency] = useState<'USD' | 'BTC'>('USD');
  const recentActivity = useActivity();

  // Real on-chain balances
  const { balance: ethBalance, isLoading: ethLoading, refetch: refetchEth } = useBalance(
    address,
    ACTIVE_TOKENS.ETH,
    15_000,
  );
  const { balance: strkBalance, isLoading: strkLoading, refetch: refetchStrk } = useBalance(
    address,
    ACTIVE_TOKENS.STRK,
    15_000,
  );
  const { balance: wbtcBalance, isLoading: wbtcLoading, refetch: refetchWbtc } = useBalance(
    address,
    ACTIVE_TOKENS.WBTC,
    15_000,
  );

  // Real prices from CoinGecko
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
      case 'Stake':        return <Zap size={14} />;
      case 'Unstake':      return <ArrowDownLeft size={14} />;
      case 'ClaimRewards': return <Gift size={14} />;
      case 'Swap':         return <Repeat size={14} />;
      case 'Supply':       return <ArrowUpRight size={14} />;
      case 'Withdraw':     return <ArrowDownLeft size={14} />;
      default:             return <CheckCircle2 size={14} />;
    }
  };

  return (
    <div className="space-y-5 animate-modern relative z-10">
      {/* ─── Primary Balance ─── */}
      <section className="space-y-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={10} strokeWidth={3} className="text-green-600" />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/30 dark:text-white/60">
              PORTFOLIO BALANCE
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isLoading && (
              <RefreshCw size={10} className="animate-spin text-black/30 dark:text-white/50" />
            )}
            <button
              onClick={() => setDisplayCurrency(displayCurrency === 'USD' ? 'BTC' : 'USD')}
              className="text-[9px] font-black bg-[#F7931A] text-white px-1.5 py-0.5 tracking-widest uppercase italic border border-black dark:border-white"
            >
              {displayCurrency}
            </button>
          </div>
        </div>

        <h2 className="text-[36px] font-bold tracking-tight leading-none flex items-start dark:text-white">
          {displayCurrency === 'USD' && (
            <span className="text-[18px] mt-0.5 mr-0.5 text-black/30 dark:text-white/60 font-black">$</span>
          )}
          {displayCurrency === 'BTC' && (
            <span className="text-[18px] mt-0.5 mr-0.5 text-[#F7931A] font-black">₿</span>
          )}
          {hide(displayValue)}
          <span className="text-[11px] mt-1.5 ml-1 text-black/30 dark:text-white/60 font-black tracking-widest">
            {displayCurrency}
          </span>
        </h2>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onEarnYield(ethBalance.formatted)}
            className="flex-1 h-11 bg-black text-white dark:bg-white dark:text-black font-bold text-[11px] tracking-widest neo-shadow-orange"
          >
            EARN YIELD
          </button>
          <button
            onClick={() => { refetchEth(); refetchStrk(); refetchWbtc(); }}
            className="h-11 w-11 border-2 border-black dark:border-white font-bold bg-white dark:bg-black dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 flex items-center justify-center"
            title="Refresh balances"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </section>

      {/* ─── Market + Yield Grid ─── */}
      <div className="grid grid-cols-2 gap-2">
        {/* Market Prices */}
        <div className="border-2 border-black dark:border-white bg-white dark:bg-black col-span-1">
          <div className="bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 flex justify-between items-center">
            <span className="text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5">
              <ShieldCheck size={10} className="text-[#F7931A]" />
              Market
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[8px] font-bold uppercase">
                {ACTIVE_NETWORK === 'sepolia' ? 'Testnet' : 'Live'}
              </span>
            </span>
          </div>
          <div className="p-2.5 space-y-2 font-mono dark:text-white/90">
            {[
              { label: 'BTC', price: btcPrice, change: prices.bitcoin?.usd_24h_change },
              { label: 'ETH', price: ethPrice, change: prices.ethereum?.usd_24h_change },
              { label: 'STRK', price: strkPrice, change: prices.starknet?.usd_24h_change },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center text-[9px]">
                <span className="opacity-40 uppercase dark:opacity-70 font-bold">{row.label}</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-[#F7931A]">
                    ${row.price.toLocaleString('en-US', { maximumFractionDigits: row.price < 10 ? 4 : 2 })}
                  </span>
                  {row.change != null && (
                    <span className={`flex items-center text-[8px] font-bold ${row.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {row.change >= 0 ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
                      {Math.abs(row.change).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Yield Chart */}
        <div className="border-2 border-black dark:border-white bg-white dark:bg-black col-span-1 flex flex-col">
          <div className="bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 flex justify-between items-center">
            <span className="text-[9px] font-black tracking-widest uppercase">Yield</span>
            <span className="text-[8px] font-black text-green-400 dark:text-green-600 uppercase">+5.25% APR</span>
          </div>
          <div className="flex-1 min-h-0 p-1">
            <ResponsiveContainer width="100%" height={70}>
              <AreaChart data={chartData}>
                <XAxis dataKey="name" hide />
                <Area
                  type="stepAfter"
                  dataKey="v"
                  stroke="#F7931A"
                  strokeWidth={2}
                  fillOpacity={0.15}
                  fill="#F7931A"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── Token Balances ─── */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black tracking-widest uppercase dark:text-white">Token Balances</h3>
          <Lock size={14} strokeWidth={3} className="dark:text-white" />
        </div>
        <div className="space-y-2">
          {[
            {
              symbol: 'WBTC',
              name: 'Wrapped BTC',
              balance: wbtcBalance.formatted,
              usd: wbtcUsd,
              loading: wbtcLoading,
              badge: 'Bitcoin',
              accent: true,
            },
            {
              symbol: 'ETH',
              name: 'Ethereum',
              balance: ethBalance.formatted,
              usd: ethUsd,
              loading: ethLoading,
              badge: 'Starknet',
            },
            {
              symbol: 'STRK',
              name: 'Stark Token',
              balance: strkBalance.formatted,
              usd: strkUsd,
              loading: strkLoading,
              badge: 'Native Gas',
            },
          ].map((token) => (
            <div
              key={token.symbol}
              className={`flex items-center justify-between p-3 border-2 ${
                'accent' in token && token.accent
                  ? 'border-[#F7931A] bg-[#F7931A]/5 dark:bg-[#F7931A]/5'
                  : 'border-black dark:border-white hover:border-[#F7931A] dark:hover:border-[#F7931A] bg-white dark:bg-black'
              } transition-all`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 flex items-center justify-center font-bold text-sm border-2 ${
                  'accent' in token && token.accent
                    ? 'border-[#F7931A] bg-[#F7931A] text-white'
                    : 'border-black dark:border-white bg-zinc-50 dark:bg-zinc-900 dark:text-white'
                }`}>
                  {token.symbol === 'WBTC' ? '₿' : token.symbol[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-[12px] tracking-tight uppercase dark:text-white">
                      {token.symbol}
                    </p>
                    <span className="text-[7px] px-0.5 font-bold uppercase tracking-wider bg-black/10 text-black/50 dark:bg-white/10 dark:text-white/50">
                      {token.badge}
                    </span>
                  </div>
                  <p className="text-[9px] font-medium opacity-40 dark:opacity-60 dark:text-white">
                    {token.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-[12px] dark:text-white">
                  {token.loading ? '…' : hide(parseFloat(token.balance).toFixed(4))}
                </p>
                <p className="text-[9px] font-bold opacity-40 dark:opacity-60 dark:text-white">
                  {token.loading
                    ? '—'
                    : hide(
                        '$' + token.usd.toLocaleString('en-US', { maximumFractionDigits: 2 }),
                      )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Recent Activity ─── */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black tracking-widest uppercase dark:text-white">Recent Activity</h3>
          <button
            onClick={onSeeAllActivity}
            className="text-[9px] font-black uppercase tracking-widest text-black/40 dark:text-white/70 hover:text-black dark:hover:text-white"
          >
            See all
          </button>
        </div>
        <div className="border-2 border-black dark:border-white divide-y divide-black/10 dark:divide-white/10 bg-white dark:bg-black overflow-hidden">
          {recentActivity.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 dark:text-white">
                No transactions yet — start by staking, swapping, or supplying
              </p>
            </div>
          ) : (
            recentActivity.slice(0, 3).map((activity) => (
            <div
              key={activity.id}
              className="px-3 py-2.5 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 flex items-center justify-center border border-black/20 dark:border-white/20 bg-black text-white dark:bg-white dark:text-black"
                >
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-tight dark:text-white">
                    {activity.type}
                  </p>
                  <p className="text-[8px] font-medium text-black/30 dark:text-white/50">
                    {activity.label}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={8} className="text-green-600" />
                  <span className="text-[8px] font-bold text-green-600 uppercase">
                    OK
                  </span>
                </div>
              </div>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
};


export default Dashboard;