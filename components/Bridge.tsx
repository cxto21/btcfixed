
import React, { useState } from 'react';
import { ArrowDown, Zap, ShieldCheck, Database, Loader2 } from 'lucide-react';

const Bridge: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleIngress = () => {
    setIsVerifying(true);
    setTimeout(() => setIsVerifying(false), 3000);
  };

  return (
    <div className="space-y-12 animate-modern">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tighter uppercase">BTC Ingress</h2>
        <p className="text-black/40 text-sm font-medium uppercase tracking-widest">Bridging via Starknet ZK-Proofs</p>
      </div>

      <div className="space-y-[2px] bg-black border-2 border-black">
        <div className="p-8 bg-white space-y-8">
          {/* Source Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Source: Bitcoin Mainnet</p>
                <Database size={12} className="opacity-20" />
            </div>
            <div className="flex items-center justify-between">
              <input type="number" placeholder="0.00" className="text-4xl font-bold bg-transparent outline-none w-full tracking-tighter" />
              <div className="flex items-center gap-2 border-l-2 border-black pl-4 ml-4">
                <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-[10px] font-black">B</div>
                <span className="text-xl font-bold">BTC</span>
              </div>
            </div>
          </div>

          {/* Central Verification Node */}
          <div className="flex justify-center -my-2 relative z-10">
            <div className={`w-14 h-14 bg-black text-white flex items-center justify-center border-4 border-white transition-transform ${isVerifying ? 'rotate-180' : ''}`}>
              {isVerifying ? <Loader2 size={28} className="animate-spin" /> : <ArrowDown size={28} strokeWidth={3} />}
            </div>
          </div>

          {/* Destination Output */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Destination: BTCFixed L2</p>
              <div className="px-1.5 py-0.5 bg-black text-white text-[8px] font-black tracking-widest uppercase">Verified</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold tracking-tighter opacity-40">0.00</span>
              <div className="flex items-center gap-2 border-l-2 border-black pl-4 ml-4 opacity-40">
                <div className="w-6 h-6 border-2 border-black flex items-center justify-center text-[10px] font-black">F</div>
                <span className="text-xl font-bold">fyBTC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Verification Message */}
        <div className={`p-5 transition-colors ${isVerifying ? 'bg-zinc-800 text-white' : 'bg-black text-white'} flex items-center gap-3`}>
          {isVerifying ? (
             <>
               <Loader2 size={18} className="animate-spin" />
               <p className="text-[10px] font-mono uppercase tracking-widest leading-tight">
                 Generating SPV Proof... Validating Bitcoin Block headers on Starknet...
               </p>
             </>
          ) : (
            <>
              <ShieldCheck size={18} className="text-white" />
              <p className="text-[10px] font-black uppercase tracking-widest leading-tight">
                Institutional security model powered by ZK-STARKs. Trustless finality.
              </p>
            </>
          )}
        </div>
      </div>

      <button 
        onClick={handleIngress}
        disabled={isVerifying}
        className="w-full h-16 btn-black text-lg font-bold tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50"
      >
        {isVerifying ? 'VERIFYING...' : 'INITIATE INGRESS'}
      </button>

      {/* Technical Metadata Table */}
      <div className="bg-zinc-50 border border-black/10 p-4 space-y-2 font-mono">
        <div className="flex justify-between items-center text-[9px] font-bold">
            <span className="opacity-40">STARKNET BRIDGE:</span>
            <span>0x682...f91a</span>
        </div>
        <div className="flex justify-between items-center text-[9px] font-bold">
            <span className="opacity-40">BTC VERIFICATION:</span>
            <span>SPV VIA SDK-X</span>
        </div>
        <div className="flex justify-between items-center text-[9px] font-bold">
            <span className="opacity-40">CONFIRMATIONS:</span>
            <span>2 MAINNET</span>
        </div>
      </div>
    </div>
  );
};

export default Bridge;
