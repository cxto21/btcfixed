
import React from 'react';
import { CircleDot, MoveDown, Landmark } from 'lucide-react';

const Minting: React.FC = () => {
  return (
    <div className="space-y-12 animate-modern">
      <div className="space-y-2 text-center">
        <h2 className="text-4xl font-bold tracking-tighter uppercase">Issue fUSD</h2>
        <p className="text-black/40 text-sm font-medium uppercase tracking-widest">Bitcoin-Backed Stablecoin</p>
      </div>

      <div className="p-8 border-2 border-black space-y-10 bg-white relative">
        <div className="absolute top-0 right-0 p-4 opacity-5">
            <Landmark size={64} />
        </div>
        
        <div className="space-y-3 relative z-10">
          <div className="flex justify-between items-end">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Lock Collateral</p>
            <span className="text-[10px] font-bold opacity-40">142.50 BTC AVAILABLE</span>
          </div>
          <div className="flex items-center justify-between border-b-2 border-black pb-4">
            <input type="number" placeholder="0.00" className="text-4xl font-bold bg-transparent outline-none w-full tracking-tighter" />
            <span className="text-xl font-bold ml-4">BTC</span>
          </div>
        </div>

        <div className="flex justify-center relative">
          <div className="h-12 w-12 border-2 border-black rounded-none flex items-center justify-center bg-white z-10">
            <MoveDown size={20} />
          </div>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-black/10"></div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Issue Amount</p>
          <div className="flex items-center justify-between border-b-2 border-black pb-4">
            <span className="text-4xl font-bold tracking-tighter opacity-20">0.00</span>
            <span className="text-xl font-bold ml-4">fUSD</span>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Collateral Ratio</span>
            <span className="text-xs font-black px-2 py-0.5 border-2 border-black bg-black text-white">280% SECURE</span>
          </div>
          <div className="h-2 w-full bg-black/5 border border-black/10">
            <div className="h-full w-[80%] bg-black"></div>
          </div>
        </div>

        <button className="w-full h-16 btn-black font-bold text-lg tracking-[0.2em] flex items-center justify-center gap-3">
          <CircleDot size={20} />
          MINT ASSETS
        </button>
      </div>

      <div className="bg-black p-6 text-white text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.15em] leading-relaxed">
            Fixed USD (fUSD) is an over-collateralized stablecoin maintained by the BTCFixed treasury at a minimum 150% ratio.
        </p>
      </div>
    </div>
  );
};

export default Minting;
