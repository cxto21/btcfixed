
import React, { useState } from 'react';
import { ShieldAlert, Send, Download, Lock, EyeOff, CheckCircle2 } from 'lucide-react';

const Verification: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'send' | 'receive'>('send');

  const handleAction = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 3000);
  };

  return (
    <div className="space-y-12 animate-modern">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tighter uppercase dark:text-white">ANONYMOUS</h2>
        <p className="text-black/40 dark:text-white/70 text-sm font-medium uppercase tracking-widest">Zero-Knowledge Privacy Layer</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex border-2 border-black dark:border-white bg-white dark:bg-black p-1">
        <button
          onClick={() => setMode('send')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 text-[10px] font-black tracking-widest transition-all ${mode === 'send' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-black/40 dark:text-white/40 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
        >
          <Send size={14} /> SEND
        </button>
        <button
          onClick={() => setMode('receive')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 text-[10px] font-black tracking-widest transition-all ${mode === 'receive' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-black/40 dark:text-white/40 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
        >
          <Download size={14} /> RECEIVE
        </button>
      </div>

      <div className="p-8 border-2 border-black dark:border-white space-y-8 bg-white dark:bg-black relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
        <div className="absolute -right-8 -top-8 opacity-[0.03] dark:opacity-[0.1] dark:text-white">
            <EyeOff size={200} />
        </div>

        <div className="space-y-6 relative z-10">
          <div className="flex justify-between items-center border-b-2 border-black dark:border-white pb-4">
            <div>
              <p className="text-[10px] font-black opacity-30 dark:opacity-70 uppercase tracking-widest mb-1 dark:text-white">Privacy Protocol</p>
              <p className="font-mono text-xs font-bold dark:text-white">ZK-SNARKs v2.0</p>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-black dark:bg-white text-white dark:text-black text-[8px] font-black uppercase tracking-widest">
              <Lock size={10} /> Encrypted
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-30 dark:text-white">
                {mode === 'send' ? 'Recipient Stealth Address' : 'Your Stealth Address'}
              </label>
              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 border-2 border-black dark:border-white font-mono text-[10px] font-bold dark:text-white">
                <span className="truncate mr-4">
                  {mode === 'send' ? 'Enter address...' : '0x_stealth_8k2j...9m1p'}
                </span>
                <ShieldAlert size={14} className="text-[#F7931A]" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-30 dark:text-white">Amount</label>
              <div className="flex items-center justify-between">
                <input type="number" placeholder="0.00" className="text-3xl font-bold bg-transparent outline-none w-full tracking-tighter dark:text-white" />
                <span className="text-xl font-bold dark:text-white">BTC</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleAction}
          disabled={isProcessing}
          className="w-full h-16 bg-black dark:bg-white text-white dark:text-black font-black text-lg tracking-[0.2em] flex items-center justify-center gap-3 neo-shadow-orange disabled:opacity-50"
        >
          {isProcessing ? 'PROCESSING...' : mode === 'send' ? 'ANONYMOUS SEND' : 'GENERATE RECEIPT'}
        </button>
      </div>

      <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border-2 border-dashed border-black/10 dark:border-white/30">
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle2 size={16} className="text-green-600" />
          <p className="text-[10px] font-black uppercase tracking-widest dark:text-white">Privacy Guaranteed</p>
        </div>
        <p className="text-[10px] text-black/40 dark:text-white/60 leading-relaxed">
          Transactions are mixed using a decentralized relay network. No link between source and destination addresses is recorded on the public ledger.
        </p>
      </div>
    </div>
  );
};

export default Verification;
