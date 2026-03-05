import React from 'react';
import { Shield, Fingerprint, Key } from 'lucide-react';

interface AuthScreenProps {
  onAuth: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuth }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col px-10 pt-24 pb-12 max-w-md mx-auto overflow-hidden relative">
      {/* Background Decor - Smaller BTC logo at 35% opacity, top-right corner */}
      <div className="absolute top-[-30px] right-[-30px] opacity-[0.35] pointer-events-none">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1280px-Bitcoin.svg.png" 
          alt="Bitcoin Logo" 
          className="w-[220px] h-[220px]"
        />
      </div>
      
      <div className="mb-20 animate-modern relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1280px-Bitcoin.svg.png" 
            alt="BTC" 
            className="w-10 h-10"
          />
          <div className="h-6 w-[2px] bg-black/10 mx-2"></div>
        </div>
        
        <h1 className="text-[88px] leading-[0.75] font-bold tracking-tight mb-8">
          BTC<br/><span className="font-medium opacity-80">Fixed</span>
        </h1>
        
        <div className="h-2 w-20 bg-[#F7931A] mb-8"></div>
        
        <p className="text-black/60 font-medium text-xl leading-tight max-w-[280px]">
          Smart HODLing. <br/>Borrow, don't sell your cheap coins.
        </p>
      </div>

      <div className="mt-auto space-y-4 animate-modern" style={{ animationDelay: '0.1s' }}>
        <button 
          onClick={onAuth}
          className="w-full h-16 bg-black text-white flex items-center justify-between px-6 group neo-shadow-orange"
        >
          <span className="text-lg font-bold tracking-tighter uppercase">ACCESS TERMINAL</span>
          <Fingerprint size={24} className="group-hover:scale-110 transition-transform text-[#F7931A]" />
        </button>
        
        <button 
          onClick={onAuth}
          className="w-full h-16 border-2 border-black flex items-center justify-between px-6 font-bold tracking-tighter hover:bg-zinc-50 transition-colors bg-white/80 backdrop-blur-sm"
        >
          <span className="uppercase">CONNECT WALLET</span>
          <Key size={20} />
        </button>

        <div className="pt-12 flex flex-col gap-6">
          <div className="flex items-start gap-3 p-4 bg-[#F7931A]/10 border-l-4 border-[#F7931A] backdrop-blur-sm">
            <Shield size={16} className="mt-1 shrink-0 text-[#F7931A]" />
            <p className="text-[11px] text-black font-bold leading-relaxed">
              Experience the Bitcoin Standard in DeFi. No liquidations on fixed-rate vaults. Total transparency with on-chain SPV proofs powered by Starknet.
            </p>
          </div>
          <p className="text-[10px] text-black/40 font-black uppercase tracking-[0.2em] text-center">
            Secured by Bitcoin Proof-of-Work
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;