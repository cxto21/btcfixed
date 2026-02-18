
import React from 'react';
import { ArrowRight, Lock, Shield, Info } from 'lucide-react';

const Lending: React.FC = () => {
  return (
    <div className="space-y-12 animate-modern">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tighter uppercase">SMART CREDIT</h2>
        <p className="text-black/40 text-sm font-medium uppercase tracking-widest">Borrow cash, keep your Bitcoin</p>
      </div>

      <div className="bg-black text-white p-6 border-2 border-black space-y-2">
        <div className="flex items-center gap-2">
            <Info size={14} className="text-white" />
            <p className="text-[10px] font-black uppercase tracking-widest">Marketing Pro-Tip</p>
        </div>
        <p className="text-lg font-bold leading-tight tracking-tight">
          "The crypto way to borrow: don't sell your coins cheap. Unlock liquidity while staying long on BTC."
        </p>
      </div>

      <div className="space-y-4">
        {[
          { n: 'ELITE LOAN', ltv: '75%', apr: '2.25%', status: 'MAX POWER' },
          { n: 'PRO SAVER', ltv: '60%', apr: '1.50%', status: 'BEST VALUE' },
          { n: 'SAFETY FIRST', ltv: '35%', apr: '0.75%', status: 'ZERO RISK' },
        ].map((v, i) => (
          <div key={i} className="group border-2 border-black p-6 bg-white active:bg-black active:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h4 className="text-2xl font-black tracking-tighter uppercase">{v.n}</h4>
                <div className="mt-1 px-2 py-0.5 bg-black text-white text-[8px] font-black inline-block tracking-widest group-active:bg-white group-active:text-black uppercase">
                    {v.status}
                </div>
              </div>
              <div className="w-12 h-12 border-2 border-black flex items-center justify-center group-active:border-white">
                <ArrowRight size={24} />
              </div>
            </div>
            
            <div className="flex justify-between items-end border-t-2 border-black pt-4">
              <div>
                <p className="text-[9px] font-black opacity-30 tracking-[0.3em] mb-1 uppercase">MAX CREDIT (LTV)</p>
                <p className="text-2xl font-bold">{v.ltv}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black opacity-30 tracking-[0.3em] mb-1 uppercase">FIXED COST</p>
                <p className="text-2xl font-bold">{v.apr}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-zinc-50 border-2 border-dashed border-black/20 flex flex-col gap-4">
          <p className="text-xs font-bold text-black/40 uppercase tracking-widest">Why use BTCFixed Credit?</p>
          <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm font-bold">
                  <div className="w-1.5 h-1.5 bg-black"></div>
                  NO TAXABLE EVENT
              </li>
              <li className="flex items-center gap-2 text-sm font-bold">
                  <div className="w-1.5 h-1.5 bg-black"></div>
                  INSTANT APPROVAL
              </li>
              <li className="flex items-center gap-2 text-sm font-bold">
                  <div className="w-1.5 h-1.5 bg-black"></div>
                  KEEP YOUR BTC UPSIDE
              </li>
          </ul>
      </div>
    </div>
  );
};

export default Lending;
