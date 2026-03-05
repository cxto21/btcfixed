
import React, { useState } from 'react';
import { RefreshCw, Zap, ShieldCheck, Database, Loader2 } from 'lucide-react';

const Bridge: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [swapPair, setSwapPair] = useState({ from: 'BTC', to: 'fyBTC' });

  const handleSwap = () => {
    setIsVerifying(true);
    setTimeout(() => setIsVerifying(false), 3000);
  };

  const togglePair = () => {
    setSwapPair({ from: swapPair.to, to: swapPair.from });
  };

  return (
    <div className="space-y-12 animate-modern">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tighter uppercase dark:text-white">SWAP TERMINAL</h2>
        <p className="text-black/40 dark:text-white/70 text-sm font-medium uppercase tracking-widest">Instant Liquidity Exchange</p>
      </div>

      <div className="space-y-[2px] bg-black dark:bg-white border-2 border-black dark:border-white">
        <div className="p-8 bg-white dark:bg-black space-y-8">
          {/* Source Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 dark:opacity-70 dark:text-white">Sell: {swapPair.from}</p>
                <Database size={12} className="opacity-20 dark:opacity-50 dark:text-white" />
            </div>
            <div className="flex items-center justify-between">
              <input type="number" placeholder="0.00" className="text-4xl font-bold bg-transparent outline-none w-full tracking-tighter dark:text-white" />
              <div className="flex items-center gap-2 border-l-2 border-black dark:border-white pl-4 ml-4">
                <div className="w-6 h-6 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] font-black">{swapPair.from[0]}</div>
                <span className="text-xl font-bold dark:text-white">{swapPair.from}</span>
              </div>
            </div>
          </div>

          {/* Swap Toggle */}
          <div className="flex justify-center -my-2 relative z-10">
            <button 
              onClick={togglePair}
              className={`w-14 h-14 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center border-4 border-white dark:border-black transition-transform hover:scale-110 active:scale-95 ${isVerifying ? 'rotate-180' : ''}`}
            >
              {isVerifying ? <Loader2 size={28} className="animate-spin" /> : <RefreshCw size={28} strokeWidth={3} />}
            </button>
          </div>

          {/* Destination Output */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 dark:text-white">Buy: {swapPair.to}</p>
              <div className="px-1.5 py-0.5 bg-black dark:bg-white text-white dark:text-black text-[8px] font-black tracking-widest uppercase">Best Rate</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold tracking-tighter opacity-40 dark:opacity-70 dark:text-white">0.00</span>
              <div className="flex items-center gap-2 border-l-2 border-black dark:border-white pl-4 ml-4 opacity-40 dark:opacity-70">
                <div className="w-6 h-6 border-2 border-black dark:border-white flex items-center justify-center text-[10px] font-black dark:text-white">{swapPair.to[0]}</div>
                <span className="text-xl font-bold dark:text-white">{swapPair.to}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Verification Message */}
        <div className={`p-5 transition-colors ${isVerifying ? 'bg-zinc-800 text-white' : 'bg-black dark:bg-white text-white dark:text-black'} flex items-center gap-3`}>
          {isVerifying ? (
             <>
               <Loader2 size={18} className="animate-spin" />
               <p className="text-[10px] font-mono uppercase tracking-widest leading-tight">
                 Quoting liquidity pools... Executing atomic swap on L2...
               </p>
             </>
          ) : (
            <>
              <Zap size={18} className="text-[#F7931A]" />
              <p className="text-[10px] font-black uppercase tracking-widest leading-tight">
                Atomic Swaps powered by Starknet. Zero slippage for institutional orders.
              </p>
            </>
          )}
        </div>
      </div>

      <button 
        onClick={handleSwap}
        disabled={isVerifying}
        className="w-full h-16 btn-black dark:bg-white dark:text-black text-lg font-bold tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50"
      >
        {isVerifying ? 'SWAPPING...' : 'EXECUTE SWAP'}
      </button>

      {/* Technical Metadata Table */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-black/10 dark:border-white/20 p-4 space-y-2 font-mono">
        <div className="flex justify-between items-center text-[9px] font-bold dark:text-white">
            <span className="opacity-40 dark:opacity-70">LIQUIDITY POOL:</span>
            <span>BTC/fyBTC-V1</span>
        </div>
        <div className="flex justify-between items-center text-[9px] font-bold dark:text-white">
            <span className="opacity-40 dark:opacity-70">EXCHANGE RATE:</span>
            <span>1 BTC = 0.9998 fyBTC</span>
        </div>
        <div className="flex justify-between items-center text-[9px] font-bold dark:text-white">
            <span className="opacity-40 dark:opacity-70">NETWORK FEE:</span>
            <span>0.00001 BTC</span>
        </div>
      </div>
    </div>
  );
};

export default Bridge;
