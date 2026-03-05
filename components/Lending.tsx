
import React from 'react';
import { Lock, Shield, TrendingUp } from 'lucide-react';

const Lending: React.FC = () => {
  const assets = [
    { name: 'Bitcoin', symbol: 'BTC', amount: '42.50', status: 'Available', type: 'Cold Storage' },
    { name: 'Yield BTC', symbol: 'fyBTC', amount: '100.00', status: 'Yielding', type: 'Fixed 5.25%' },
    { name: 'Staked ETH', symbol: 'stETH', amount: '12.40', status: 'Yielding', type: 'Lido 3.8%' },
    { name: 'Stablecoin', symbol: 'fUSD', amount: '25,000', status: 'Available', type: 'Cash' },
  ];

  const availableAssets = assets.filter(a => a.status === 'Available');
  const yieldingAssets = assets.filter(a => a.status === 'Yielding');

  return (
    <div className="space-y-12 animate-modern">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tighter uppercase dark:text-white">VAULT ASSETS</h2>
        <p className="text-black/40 dark:text-white/70 text-sm font-medium uppercase tracking-widest">Institutional Asset Management</p>
      </div>

      <div className="space-y-8">
        {/* Available Now Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-black dark:border-white pb-2">
            <Lock size={14} className="dark:text-white" />
            <h3 className="text-xs font-black tracking-widest uppercase dark:text-white">Available Now</h3>
          </div>
          <div className="space-y-3">
            {availableAssets.map((asset, i) => (
              <div key={i} className="flex items-center justify-between p-5 border-2 border-black dark:border-white bg-white dark:bg-black neo-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center border-2 border-black dark:border-white bg-zinc-50 dark:bg-zinc-900 font-bold dark:text-white">
                    {asset.symbol[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm tracking-tight uppercase dark:text-white">{asset.name}</p>
                    <p className="text-[10px] font-bold opacity-40 dark:opacity-70 uppercase tracking-widest dark:text-white">{asset.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm dark:text-white">{asset.amount} {asset.symbol}</p>
                  <span className="text-[8px] px-1 font-black uppercase tracking-widest bg-black text-white dark:bg-white dark:text-black">LIQUID</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Generating Yield Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-black dark:border-white pb-2">
            <TrendingUp size={14} className="text-green-600" />
            <h3 className="text-xs font-black tracking-widest uppercase dark:text-white">Generating Yield</h3>
          </div>
          <div className="space-y-3">
            {yieldingAssets.map((asset, i) => (
              <div key={i} className="flex items-center justify-between p-5 border-2 border-black dark:border-white bg-white dark:bg-black neo-shadow-orange">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center border-2 border-black dark:border-white bg-zinc-50 dark:bg-zinc-900 font-bold dark:text-white">
                    {asset.symbol[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm tracking-tight uppercase dark:text-white">{asset.name}</p>
                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">{asset.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm dark:text-white">{asset.amount} {asset.symbol}</p>
                  <span className="text-[8px] px-1 font-black uppercase tracking-widest bg-green-500 text-white">ACTIVE</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="p-8 bg-zinc-50 dark:bg-zinc-900 border-2 border-dashed border-black/20 dark:border-white/20 flex flex-col gap-4">
          <p className="text-xs font-bold text-black/40 dark:text-white/70 uppercase tracking-widest">Vault Security Protocol</p>
          <div className="flex items-center gap-3">
            <Shield size={24} className="text-[#F7931A]" />
            <p className="text-[11px] font-medium leading-relaxed dark:text-white/80">
              All vault assets are protected by multi-sig institutional custody and real-time on-chain audits.
            </p>
          </div>
      </div>
    </div>
  );
};

export default Lending;
