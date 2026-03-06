import React from 'react';
import { Lock, ShieldAlert } from 'lucide-react';

const Verification: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 animate-modern">
      <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
        <ShieldAlert size={36} className="text-gray-300 dark:text-gray-600" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold dark:text-white">Anonymous Transactions</h2>
        <span className="inline-block px-3 py-1 text-xs font-semibold bg-[#F7931A]/10 text-[#F7931A] rounded-full">
          Coming Soon
        </span>
      </div>
      <p className="text-sm text-gray-400 text-center max-w-[260px] leading-relaxed">
        Private send &amp; receive using ZK-SNARKs. No link between source and destination addresses on the public ledger.
      </p>
      <div className="flex items-center gap-2 text-xs text-gray-300 dark:text-gray-600">
        <Lock size={14} />
        <span>End-to-end encrypted</span>
      </div>
    </div>
  );
};

export default Verification;
