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
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBalance } from '../hooks/useBalance';
import { usePrices } from '../hooks/usePrices';
import { useActivity } from '../hooks/useActivity';
import { ACTIVE_TOKENS } from '../config/tokens';
import { ACTIVE_NETWORK, ACTIVE_NETWORK_CONFIG } from '../config/networks';
import { truncateAddress } from '../config/wallets';

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
    <div className="space-y-12 animate-modern relative z-10">
      {/* ─── Primary Balance ─── */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2">
            <TrendingUp size={12} strokeWidth={3} className="text-green-600" />
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-black/30 dark:text-white/60">
              PORTFOLIO BALANCE
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isLoading && (
              <RefreshCw size={10} className="animate-spin text-black/30 dark:text-white/50" />
            )}
            <button
              onClick={() => setDisplayCurrency(displayCurrency === 'USD' ? 'BTC' : 'USD')}
              className="text-[10px] font-black bg-[#F7931A] text-white px-2 py-0.5 tracking-widest uppercase italic border-2 border-black dark:border-white"
            >
              {displayCurrency}
            </button>
          </div>
        </div>

        <h2 className="text-[42px] font-bold tracking-tight leading-none flex items-start dark:text-white">
          {displayCurrency === 'USD' && (
            <span className="text-[20px] mt-1 mr-1 text-black/30 dark:text-white/60 font-black">$</span>
          )}
          {displayCurrency === 'BTC' && (
            <span className="text-[20px] mt-1 mr-1 text-[#F7931A] font-black">₿</span>
          )}
          {hide(displayValue)}
          <span className="text-[12px] mt-2 ml-1 text-black/30 dark:text-white/60 font-black tracking-widest">
            {displayCurrency}
          </span>
        </h2>

        {/* Wallet address chip */}
        {address && (
          <a
            href={`${ACTIVE_NETWORK_CONFIG.explorerUrl}/contract/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold text-black/40 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors"
          >
            {truncateAddress(address)}
            <ExternalLink size={9} />
            {ACTIVE_NETWORK_CONFIG.isTestnet && (
              <span className="ml-1 bg-amber-400 text-black text-[8px] font-black uppercase px-1 py-0.5">
                SEPOLIA
              </span>
            )}
          </a>
        )}

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onEarnYield(ethBalance.formatted)}
            className="flex-1 h-14 bg-black text-white dark:bg-white dark:text-black font-bold text-xs tracking-widest neo-shadow-orange"
          >
            EARN YIELD
          </button>
          <button
            onClick={() => { refetchEth(); refetchStrk(); refetchWbtc(); }}
            className="h-14 w-14 border-2 border-black dark:border-white font-bold bg-white dark:bg-black dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 flex items-center justify-center"
            title="Refresh balances"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </section>

      {/* ─── Market Overview ─── */}
      <div className="border-2 border-black dark:border-white p-0 bg-white dark:bg-black neo-shadow">
        <div className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 flex justify-between items-center">
          <span className="text-[10px] font-black tracking-widest uppercase flex items-center gap-2">
            <ShieldCheck size={12} className="text-[#F7931A]" />
            Market
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-bold uppercase">
              {ACTIVE_NETWORK === 'sepolia' ? 'Sepolia Testnet' : 'Mainnet'}
            </span>
          </span>
        </div>
        <div className="p-4 space-y-3 font-mono dark:text-white/90">
          {[
            { label: 'BTC/USD', price: btcPrice, change: prices.bitcoin?.usd_24h_change },
            { label: 'ETH/USD', price: ethPrice, change: prices.ethereum?.usd_24h_change },
            { label: 'STRK/USD', price: strkPrice, change: prices.starknet?.usd_24h_change },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-center text-[10px]">
              <span className="opacity-40 uppercase dark:opacity-70">{row.label}:</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#F7931A]">
                  ${row.price.toLocaleString('en-US', { maximumFractionDigits: row.price < 10 ? 4 : 2 })}
                </span>
                {row.change != null && (
                  <span className={`flex items-center gap-0.5 text-[9px] font-bold ${row.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {row.change >= 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                    {Math.abs(row.change).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Yield Chart ─── */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black tracking-widest uppercase dark:text-white">Yield Projection</h3>
          <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
            +5.25% APR Fixed
          </span>
        </div>
        <div className="h-32 w-full border-b-2 border-black dark:border-white">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <XAxis dataKey="name" hide />
              <Area
                type="stepAfter"
                dataKey="v"
                stroke="#F7931A"
                strokeWidth={4}
                fillOpacity={0.1}
                fill="#F7931A"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── Token Balances ─── */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black tracking-widest uppercase dark:text-white">Token Balances</h3>
          <Lock size={16} strokeWidth={3} className="dark:text-white" />
        </div>
        <div className="space-y-3">
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
              className={`flex items-center justify-between p-5 border-2 ${
                'accent' in token && token.accent
                  ? 'border-[#F7931A] bg-[#F7931A]/5 dark:bg-[#F7931A]/5'
                  : 'border-black dark:border-white hover:border-[#F7931A] dark:hover:border-[#F7931A] bg-white dark:bg-black'
              } transition-all`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 flex items-center justify-center font-bold text-lg border-2 ${
                  'accent' in token && token.accent
                    ? 'border-[#F7931A] bg-[#F7931A] text-white'
                    : 'border-black dark:border-white bg-zinc-50 dark:bg-zinc-900 dark:text-white'
                }`}>
                  {token.symbol === 'WBTC' ? '₿' : token.symbol[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm tracking-tight uppercase dark:text-white">
                      {token.name}
                    </p>
                    <span className="text-[8px] px-1 font-black uppercase tracking-widest bg-black text-white dark:bg-white dark:text-black">
                      {token.badge}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold opacity-40 dark:opacity-70 uppercase tracking-widest dark:text-white">
                    {token.symbol}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm dark:text-white">
                  {token.loading ? '…' : hide(parseFloat(token.balance).toFixed(4))}
                </p>
                <p className="text-[10px] font-bold opacity-40 dark:opacity-70 dark:text-white">
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black tracking-widest uppercase dark:text-white">Recent Activity</h3>
          <button
            onClick={onSeeAllActivity}
            className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/70 hover:text-black dark:hover:text-white"
          >
            See all
          </button>
        </div>
        <div className="border-2 border-black dark:border-white divide-y-2 divide-black dark:divide-white bg-white dark:bg-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
          {recentActivity.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-30 dark:text-white">
                No transactions yet — start by staking, swapping, or supplying
              </p>
            </div>
          ) : (
            recentActivity.slice(0, 3).map((activity) => (
            <div
              key={activity.id}
              className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 flex items-center justify-center border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black"
                >
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-tight dark:text-white">
                    {activity.type}
                  </p>
                  <p className="text-[9px] font-bold text-black/30 dark:text-white/60 uppercase tracking-widest">
                    {activity.label}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={10} className="text-green-600" />
                  <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">
                    Confirmed
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