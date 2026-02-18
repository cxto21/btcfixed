
import React from 'react';
import { Shield, Fingerprint, Key, BarChart3 } from 'lucide-react';

interface AuthScreenProps {
  onAuth: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuth }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col px-10 pt-24 pb-12 max-w-md mx-auto overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <BarChart3 size={200} />
      </div>
      
      <div className="mb-20 animate-modern relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={20} strokeWidth={3} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">FIXED-RATE PROTOCOL</span>
        </div>
        <h1 className="text-[56px] leading-[0.85] font-bold tracking-tighter mb-4">
          BTC<br/>FIXED
        </h1>
        <div className="h-2 w-16 bg-black mb-6"></div>
        <p className="text-black/50 font-medium text-lg leading-tight max-w-[260px]">
          Institutional yield and fixed-rate lending for the Bitcoin standard.
        </p>
      </div>

      <div className="mt-auto space-y-4 animate-modern" style={{ animationDelay: '0.1s' }}>
        <button 
          onClick={onAuth}
          className="w-full h-16 btn-black rounded-none flex items-center justify-between px-6 group"
        >
          <span className="text-lg font-bold">ENTER TERMINAL</span>
          <Fingerprint size={24} className="group-hover:scale-110 transition-transform" />
        </button>
        
        <button 
          onClick={onAuth}
          className="w-full h-16 btn-outline rounded-none flex items-center justify-between px-6 font-bold"
        >
          <span>CONNECT WALLET</span>
          <Key size={20} />
        </button>

        <div className="pt-12 flex flex-col gap-6">
          <div className="flex items-start gap-3 p-4 bg-black/[0.03] border-l-4 border-black">
            <Shield size={16} className="mt-1 shrink-0" />
            <p className="text-[11px] text-black font-bold leading-relaxed">
              BTCFixed ensures your capital is deployed with maximum efficiency. Utilizing atomic swaps and fixed-rate vaults to eliminate volatility in your yield projections.
            </p>
          </div>
          <p className="text-[10px] text-black/30 font-bold uppercase tracking-[0.2em] text-center">
            Securing the future of Bitcoin Finance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
