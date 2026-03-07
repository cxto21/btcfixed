
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

  return (
    <div className="fixed inset-0 bg-[#111] z-[100] flex justify-center overflow-hidden selection:bg-white selection:text-black">
      {/* Mobile-constrained container */}
      <div className="w-full max-w-md bg-[#111] relative flex flex-col shadow-2xl">
        
        {/* Background Decor - Official Logo as watermark, top-right, smaller, 35% opacity */}
        <div className="absolute top-[-30px] right-[-30px] opacity-[0.35] pointer-events-none">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1280px-Bitcoin.svg.png" 
            alt="BTC" 
            className="w-[220px] h-[220px]"
          />
        </div>

        <div className="relative z-10 flex justify-between items-center p-8 pt-12">
          <div className="flex items-center gap-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1280px-Bitcoin.svg.png" 
              alt="BTC" 
              className="w-10 h-10"
            />
            <span className="text-2xl font-black tracking-tight text-white">
              BTC<span className="font-medium">Fixed</span>
            </span>
          </div>
          <button 
            onClick={onFinish}
            className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
          >
            Skip
          </button>
        </div>

        <div className={`flex-1 flex flex-col justify-center px-8 transition-all duration-300 relative z-10 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-[2px] w-12 bg-[#F7931A]" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40">
                {activeFeature.label}
              </span>
            </div>

            <div className="relative">
              <h2 className="text-[52px] font-bold leading-[0.9] tracking-tighter text-white whitespace-pre-line mb-8 drop-shadow-sm">
                {activeFeature.title}
              </h2>
            </div>

            <p className="text-xl font-medium text-white leading-[1.2] max-w-[300px]">
              {activeFeature.desc}
            </p>
          </div>
        </div>

        <div className="p-8 pb-12 space-y-10 relative z-10">
          <div className="flex items-end gap-1.5 h-8">
            {FEATURES.map((_, i) => (
              <div 
                key={i} 
                className={`transition-all duration-700 ${i === current ? 'w-12 bg-[#F7931A] h-2' : 'w-2 bg-white/10 h-2'}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleNext}
              className="flex-1 h-20 bg-black text-white flex items-center justify-between px-8 text-lg font-bold tracking-tighter group transition-all neo-shadow-orange"
            >
              <span>{current === FEATURES.length - 1 ? 'GET STARTED' : 'CONTINUE'}</span>
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="w-20 h-20 border-2 border-white flex items-center justify-center bg-white/10 backdrop-blur-sm">
              <span className="text-sm font-black italic text-white">0{current + 1}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
