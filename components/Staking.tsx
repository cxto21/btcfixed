
import React from 'react';
import { Zap, ShieldCheck, TrendingUp } from 'lucide-react';

const Staking: React.FC = () => {
  return (
    <div className="space-y-12 animate-modern">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tighter">FIX YIELD</h2>
        <p className="text-black/40 text-sm font-medium uppercase tracking-widest">Guaranteed BTC Accumulation</p>
      </div>

      <div className="flex flex-col gap-[2px] bg-black border-2 border-black overflow-hidden">
        <div className="bg-white p-6 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black tracking-widest mb-1 opacity-30 uppercase">Fixed APR</p>
            <p className="text-4xl font-bold tracking-tighter">5.25%</p>
          </div>
          <TrendingUp size={32} className="opacity-10" />
        </div>
        <div className="bg-white p-6">
          <p className="text-[10px] font-black tracking-widest mb-1 opacity-30 uppercase">Total Value Locked</p>
          <p className="text-2xl font-bold tracking-tighter">42,804.12 BTC</p>
        </div>
      </div>

      <div className="p-8 border-2 border-black space-y-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex border-b-2 border-black pb-8">
          <div className="flex-1">
            <input type="number" placeholder="0.00" className="text-4xl font-bold bg-transparent outline-none w-full tracking-tighter" />
            <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em] mt-2">Deposit Amount</p>
          </div>
          <button className="text-[10px] font-black border-2 border-black px-4 h-10 self-center ml-4 bg-black text-white uppercase tracking-widest">Max</button>
        </div>

        <div className="flex justify-between items-center text-xs font-bold">
          <div className="flex items-center gap-2">
            <Zap size={16} strokeWidth={3} />
            <span className="tracking-widest uppercase">Projected 1Y Return</span>
          </div>
          <span className="text-lg tracking-tighter font-black">+4.47 BTC</span>
        </div>

        <button className="w-full h-16 btn-black font-bold text-lg tracking-[0.2em]">INITIATE YIELD</button>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-4 p-5 border-2 border-black bg-muted/50">
          <ShieldCheck size={20} className="mt-1 shrink-0" strokeWidth={3} />
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-1">Fixed Assurance</p>
            <p className="text-[11px] text-black/60 leading-relaxed font-medium">Your principal is secured by BTCFixed's institutional liquidity reserve. No lock-ups, no hidden fees.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staking;
