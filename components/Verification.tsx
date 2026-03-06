import React, { useState } from 'react';
import { ShieldAlert, Send, Download, Lock, CheckCircle2, Info } from 'lucide-react';

const Verification: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'send' | 'receive'>('send');

  const handleAction = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 3000);
  };

  return (
    <div className="space-y-5 animate-modern">
      {/* Mode Toggle */}
      <div className="flex bg-gray-100 dark:bg-white/5 rounded-xl p-1 gap-1">
        <button
          onClick={() => setMode('send')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-2 text-xs font-semibold rounded-lg transition-all ${mode === 'send' ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
        >
          <Send size={14} /> Send
        </button>
        <button
          onClick={() => setMode('receive')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-2 text-xs font-semibold rounded-lg transition-all ${mode === 'receive' ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
        >
          <Download size={14} /> Receive
        </button>
      </div>

      <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5 space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400 mb-1">Privacy Protocol</p>
            <p className="text-sm font-semibold dark:text-white">ZK-SNARKs v2.0</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-[10px] font-medium rounded-full">
            <Lock size={10} /> Encrypted
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-gray-400">
              {mode === 'send' ? 'Recipient Stealth Address' : 'Your Stealth Address'}
            </label>
            <div className="flex items-center justify-between p-3.5 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/10 text-sm dark:text-white">
              <span className="truncate mr-4 text-gray-400">
                {mode === 'send' ? 'Enter address...' : '0x_stealth_8k2j...9m1p'}
              </span>
              <ShieldAlert size={14} className="text-[#F7931A] shrink-0" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-400">Amount</label>
            <div className="flex items-center justify-between">
              <input type="number" placeholder="0.00" className="text-3xl font-bold bg-transparent outline-none w-full dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600" />
              <span className="text-lg font-semibold dark:text-white ml-3">BTC</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleAction}
          disabled={isProcessing}
          className="w-full h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:opacity-90"
        >
          {isProcessing ? 'Processing...' : mode === 'send' ? 'Anonymous Send' : 'Generate Receipt'}
        </button>
      </div>

      <div className="flex items-start gap-3 bg-gray-50 dark:bg-white/5 rounded-2xl p-4">
        <Info size={16} className="mt-0.5 shrink-0 text-gray-400" />
        <div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Privacy Guaranteed</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Transactions are mixed using a decentralized relay network. No link between source and destination addresses is recorded on the public ledger.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verification;
