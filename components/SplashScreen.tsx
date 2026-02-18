
import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Layers, ShieldCheck, ChevronRight } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

const FEATURES = [
  {
    title: "INSTANT\nFREEDOM",
    desc: "Stop just holding. Move your BTC to a world of DeFi without ever giving up control of your keys.",
    icon: Cpu,
    label: "BITCOIN UNCHAINED"
  },
  {
    title: "EARN\n5.25% APR",
    desc: "The ultimate Smart HODL. Grow your Bitcoin balance daily with institutional-grade fixed yields.",
    icon: Zap,
    label: "GUARANTEED GROWTH"
  },
  {
    title: "BORROW,\nDON'T SELL",
    desc: "Need cash? Get a credit line up to 75% LTV. Keep your upside and never sell your cheap coins.",
    icon: Layers,
    label: "SMART LIQUIDITY"
  },
  {
    title: "PURE\nPROOF",
    desc: "Total transparency. No middlemen. We verify every single Satoshi directly on-chain for your peace of mind.",
    icon: ShieldCheck,
    label: "TRUSTLESS VERIFICATION"
  }
];

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [current]);

  const handleNext = () => {
    if (current < FEATURES.length - 1) {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(prev => prev + 1);
        setAnimating(false);
      }, 300);
    } else {
      onFinish();
    }
  };

  const activeFeature = FEATURES[current];
  const Icon = activeFeature.icon;

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col overflow-hidden selection:bg-black selection:text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 border-[40px] border-black rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[1px] bg-black rotate-12" />
      </div>

      <div className="relative z-10 flex justify-between items-center p-8 pt-12">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-black flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-black">BTCFIXED</span>
        </div>
        <button 
          onClick={onFinish}
          className="text-[10px] font-bold uppercase tracking-widest text-black/40"
        >
          Skip
        </button>
      </div>

      <div className={`flex-1 flex flex-col justify-center px-8 transition-all duration-300 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-black/20" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-black/40">
              {activeFeature.label}
            </span>
          </div>

          <div className="relative">
            <h2 className="text-[64px] font-bold leading-[0.8] tracking-tighter text-black whitespace-pre-line mb-8">
              {activeFeature.title}
            </h2>
          </div>

          <p className="text-xl font-medium text-black leading-[1.2] max-w-[300px]">
            {activeFeature.desc}
          </p>
        </div>
      </div>

      <div className="p-8 pb-12 space-y-10 relative z-10">
        <div className="flex items-end gap-1.5 h-8">
          {FEATURES.map((_, i) => (
            <div 
              key={i} 
              className={`transition-all duration-700 ${i === current ? 'w-12 bg-black h-1.5' : 'w-2 bg-black/10 h-1.5'}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleNext}
            className="flex-1 h-20 bg-black text-white flex items-center justify-between px-8 text-lg font-bold tracking-tighter"
          >
            <span>{current === FEATURES.length - 1 ? 'GET STARTED' : 'CONTINUE'}</span>
            <ChevronRight size={24} />
          </button>
          
          <div className="w-20 h-20 border-2 border-black flex items-center justify-center opacity-20">
            <span className="text-sm font-black italic">0{current + 1}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
