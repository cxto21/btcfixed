import React, { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { ShieldCheck, Lock, TrendingUp, Clock, ArrowUpRight, CheckCircle2, AlertCircle, Zap, Repeat } from 'lucide-react';
import { Activity } from '../types';

const chartData = [
  { name: '1', v: 40 }, { name: '2', v: 42 }, { name: '3', v: 41 }, 
  { name: '4', v: 45 }, { name: '5', v: 44 }, { name: '6', v: 48 }, { name: '7', v: 52 },
];

const mockActivities: Activity[] = [
  { id: 'tx-001', type: 'Stake', amount: '1.25 BTC', status: 'Completed', timestamp: '2h ago' },
  { id: 'tx-002', type: 'Bridge', amount: '0.85 BTC', status: 'Pending', timestamp: '15m ago' },
  { id: 'tx-003', type: 'Borrow', amount: '25,000 fUSD', status: 'Completed', timestamp: '1d ago' },
  { id: 'tx-004', type: 'Mint', amount: '5,000 fUSD', status: 'Completed', timestamp: '3d ago' },
];

interface DashboardProps {
  isPrivacyMode: boolean;
  onEarnYield: (amount: string) => void;
  onSeeAllActivity: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ isPrivacyMode, onEarnYield, onSeeAllActivity }) => {
  const [displayCurrency, setDisplayCurrency] = useState<'USD' | 'BTC'>('USD');
  const formatValue = (val: string) => isPrivacyMode ? "******" : val;
  const btcPrice = 65420.50;
  const currentWealthBtc = 142.50;
  const currentWealthUsd = currentWealthBtc * btcPrice;

  const displayValue = displayCurrency === 'USD' 
    ? currentWealthUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : currentWealthBtc.toFixed(2);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Stake': return <Zap size={14} />;
      case 'Bridge': return <Repeat size={14} />;
      case 'Borrow': return <ArrowUpRight size={14} />;
      default: return <CheckCircle2 size={14} />;
    }
  };

  return (
    <div className="space-y-12 animate-modern relative z-10">
      {/* Saldo Principal */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2">
            <TrendingUp size={12} strokeWidth={3} className="text-green-600" />
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-black/30 dark:text-white/60">GROWTH HISTORY</p>
          </div>
          <button 
            onClick={() => setDisplayCurrency(displayCurrency === 'USD' ? 'BTC' : 'USD')}
            className="text-[10px] font-black bg-[#F7931A] text-white px-2 py-0.5 tracking-widest uppercase italic border-2 border-black dark:border-white"
          >
            {displayCurrency}
          </button>
        </div>
        <h2 className="text-[42px] font-bold tracking-tight leading-none relative flex items-start dark:text-white">
          {displayCurrency === 'USD' && <span className="text-[20px] mt-1 mr-1 text-black/30 dark:text-white/60 font-black">$</span>}
          {formatValue(displayValue)}
          <span className="text-[12px] mt-2 ml-1 text-black/30 dark:text-white/60 font-black tracking-widest">{displayCurrency}</span>
        </h2>
        <div className="flex gap-2 pt-2">
          <button 
            onClick={() => onEarnYield(currentWealthBtc.toFixed(2))}
            className="flex-1 h-14 bg-black text-white dark:bg-white dark:text-black font-bold text-xs tracking-widest neo-shadow-orange"
          >
            EARN YIELD
          </button>
          <button className="flex-1 h-14 border-2 border-black dark:border-white font-bold text-xs tracking-widest bg-white dark:bg-black dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900">WITHDRAW</button>
        </div>
      </section>

      {/* Terminal de Estado L2 */}
      <div className="border-2 border-black dark:border-white p-0 bg-white dark:bg-black neo-shadow">
        <div className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 flex justify-between items-center">
            <span className="text-[10px] font-black tracking-widest uppercase flex items-center gap-2">
                <ShieldCheck size={12} className="text-[#F7931A]" />
                Proof-of-Reserve
            </span>
            <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] font-bold uppercase">Starknet Mainnet</span>
            </span>
        </div>
        <div className="p-4 space-y-3 font-mono dark:text-white/90">
            <div className="flex justify-between text-[10px]">
                <span className="opacity-40 uppercase dark:opacity-70">Verified Block:</span>
                <span className="font-bold">#884,122</span>
            </div>
            <div className="flex justify-between text-[10px]">
                <span className="opacity-40 uppercase dark:opacity-70">Network Integrity:</span>
                <span className="font-bold text-[#F7931A]">99.9% TRUSTLESS</span>
            </div>
        </div>
      </div>

      {/* Yield projection Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black tracking-widest uppercase dark:text-white">Yield Projection</h3>
          <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">+5.25% APR Fixed</span>
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

      {/* Vault Assets Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black tracking-widest uppercase dark:text-white">Vault Strategy</h3>
          <Lock size={16} strokeWidth={3} className="dark:text-white" />
        </div>
        <div className="space-y-3">
          {[
            { n: 'Pure Bitcoin', s: 'BTC', v: '85.20', u: '$5.4M', badge: 'Cold Storage' },
            { n: 'Yield Engine', s: 'fyBTC', v: '57.30', u: '$3.6M', badge: '+5.25% APR' },
            { n: 'Smart Liquidity', s: 'USD', v: '245.0K', u: '$245.0K', badge: '1.5% APY Cost' },
          ].map((asset, i) => (
            <div key={i} className="flex items-center justify-between p-5 border-2 border-black dark:border-white hover:border-[#F7931A] dark:hover:border-[#F7931A] transition-all cursor-pointer group relative overflow-hidden bg-white dark:bg-black">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center font-bold text-lg border-2 border-black dark:border-white bg-zinc-50 dark:bg-zinc-900">
                  {i === 0 ? <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1280px-Bitcoin.svg.png" className="w-6 h-6" /> : <span className="dark:text-white">{asset.s[0]}</span>}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm tracking-tight uppercase dark:text-white">
                      {asset.n}
                    </p>
                    <span className={`text-[8px] px-1 font-black uppercase tracking-widest ${i === 1 ? 'bg-green-500 text-white' : 'bg-black text-white dark:bg-white dark:text-black'}`}>
                        {asset.badge}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold opacity-40 dark:opacity-70 uppercase tracking-widest dark:text-white">{asset.s}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm dark:text-white">{formatValue(asset.v)}</p>
                <p className="text-[10px] font-bold opacity-40 dark:opacity-70 dark:text-white">{formatValue(asset.u)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
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
          {mockActivities.map((activity) => (
            <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 flex items-center justify-center border-2 border-black dark:border-white ${activity.status === 'Pending' ? 'bg-[#F7931A]/10 text-[#F7931A]' : 'bg-black text-white dark:bg-white dark:text-black'}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-tight dark:text-white">{activity.type}</p>
                  <p className="text-[9px] font-bold text-black/30 dark:text-white/60 uppercase tracking-widest">{activity.timestamp}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-black tracking-tight dark:text-white">
                  {isPrivacyMode ? "******" : activity.amount}
                </p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  {activity.status === 'Pending' ? (
                    <>
                      <span className="w-1 h-1 bg-[#F7931A] rounded-full animate-pulse"></span>
                      <span className="text-[8px] font-black text-[#F7931A] uppercase tracking-widest">In Progress</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={8} className="text-green-600" />
                      <span className="text-[8px] font-black text-green-600 uppercase tracking-widest">Finalized</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;