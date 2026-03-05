import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck, TrendingUp } from 'lucide-react';

interface StakingProps {
  suggestedAmount?: string | null;
  clearSuggestedAmount?: () => void;
}

const Staking: React.FC<StakingProps> = ({ suggestedAmount, clearSuggestedAmount }) => {
  const [activeService, setActiveService] = useState<'staking' | 'lending' | 'liquidity'>('staking');
  const [inputValue, setInputValue] = useState(suggestedAmount || '');

  useEffect(() => {
    if (suggestedAmount) {
      setInputValue(suggestedAmount);
    }
  }, [suggestedAmount]);

  const maxBalance = 142.50;

  const services = [
    { id: 'staking', label: 'STAKING', icon: Zap, apr: '5.25%' },
    { id: 'lending', label: 'LENDING', icon: TrendingUp, apr: '4.10%' },
    { id: 'liquidity', label: 'LP POOLS', icon: ShieldCheck, apr: '12.5%' },
  ];

  return (
    <div className="space-y-10 animate-modern">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tighter dark:text-white uppercase">GROW ASSETS</h2>
        <p className="text-black/40 dark:text-white/70 text-sm font-medium uppercase tracking-widest">Institutional Yield Strategies</p>
      </div>

      {/* Service Navigation */}
      <div className="flex border-2 border-black dark:border-white bg-white dark:bg-black p-1">
        {services.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveService(s.id as any)}
            className={`flex-1 py-3 text-[10px] font-black tracking-widest transition-all ${activeService === s.id ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-black/40 dark:text-white/40 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-[2px] bg-black dark:bg-white border-2 border-black dark:border-white overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
        <div className="bg-white dark:bg-black p-6 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black tracking-widest mb-1 opacity-30 dark:opacity-70 uppercase dark:text-white">Current APR</p>
            <p className="text-4xl font-bold tracking-tighter dark:text-white">{services.find(s => s.id === activeService)?.apr}</p>
          </div>
          {React.createElement(services.find(s => s.id === activeService)?.icon || Zap, { size: 32, className: "opacity-10 dark:opacity-30 dark:text-white" })}
        </div>
        <div className="bg-white dark:bg-black p-6">
          <p className="text-[10px] font-black tracking-widest mb-1 opacity-30 dark:opacity-70 uppercase dark:text-white">Strategy Risk Profile</p>
          <p className="text-2xl font-bold tracking-tighter dark:text-white uppercase">Institutional Grade</p>
        </div>
      </div>

      <div className="p-8 border-2 border-black dark:border-white space-y-8 bg-white dark:bg-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)]">
        <div className="flex border-b-2 border-black dark:border-white pb-8">
          <div className="flex-1">
            <input 
              type="number" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="0.00" 
              className="text-4xl font-bold bg-transparent outline-none w-full tracking-tighter dark:text-white" 
            />
            <p className="text-[10px] font-bold opacity-30 dark:opacity-70 uppercase tracking-[0.2em] mt-2 dark:text-white">Allocation Amount</p>
          </div>
          <button 
            onClick={() => setInputValue(maxBalance.toString())}
            className="text-[10px] font-black border-2 border-black dark:border-white px-4 h-10 self-center ml-4 bg-black text-white dark:bg-white dark:text-black uppercase tracking-widest"
          >
            Max
          </button>
        </div>

        <div className="flex justify-between items-center text-xs font-bold dark:text-white">
          <div className="flex items-center gap-2">
            <Zap size={16} strokeWidth={3} />
            <span className="tracking-widest uppercase">Projected 1Y Return</span>
          </div>
          <span className="text-lg tracking-tighter font-black">
            +{inputValue ? (parseFloat(inputValue) * parseFloat(services.find(s => s.id === activeService)?.apr || '0') / 100).toFixed(2) : '0.00'} BTC
          </span>
        </div>

        <button className="w-full h-16 bg-black text-white dark:bg-white dark:text-black font-bold text-lg tracking-[0.2em] uppercase">Deploy Capital</button>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-4 p-5 border-2 border-black dark:border-white bg-muted/50 dark:bg-zinc-900/50">
          <ShieldCheck size={20} className="mt-1 shrink-0 dark:text-white" strokeWidth={3} />
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-1 dark:text-white">Fixed Assurance</p>
            <p className="text-[11px] text-black/60 dark:text-white/80 leading-relaxed font-medium">Your principal is secured by BTCFixed institutional liquidity reserve. No lock-ups, no hidden fees.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staking;