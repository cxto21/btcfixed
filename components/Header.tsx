import React, { useState } from 'react';
import { EyeOff, Moon, Sun, LogOut, Copy, Check } from 'lucide-react';
import type { TabType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { truncateAddress } from '../config/wallets';

interface HeaderProps {
  isPrivacyMode: boolean;
  setIsPrivacyMode: (v: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
  activeTab: TabType;
}

const Header: React.FC<HeaderProps> = ({
  activeTab,
  isPrivacyMode,
  setIsPrivacyMode,
  isDarkMode,
  setIsDarkMode,
}) => {
  const { address, disconnect } = useAuth();
  const [copied, setCopied] = useState(false);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'TERMINAL';
      case 'bridge':    return 'SWAP';
      case 'staking':   return 'GROW';
      case 'lending':   return 'VAULT';
      case 'verify':    return 'ANONYMOUS';
      case 'activity':  return 'HISTORY';
      default:          return 'APP';
    }
  };

  const handleCopyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <header className="px-6 pt-12 pb-4 sticky top-0 bg-white/95 dark:bg-black/95 backdrop-blur-md z-50 border-b-2 border-black dark:border-white transition-colors duration-300">
      <div className="flex items-end justify-between">
        {/* Left — logo + title */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1280px-Bitcoin.svg.png"
              alt="BTC"
              className="w-5 h-5"
            />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 dark:text-white/70">
              BTC<span className="font-medium">Fixed</span>
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter uppercase dark:text-white">
            {getTitle()}
          </h1>
        </div>

        {/* Right — controls */}
        <div className="flex items-center gap-1.5 relative z-10">
          {/* Dark mode */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 border-2 border-black dark:border-white text-black dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Privacy mode */}
          <button
            onClick={() => setIsPrivacyMode(!isPrivacyMode)}
            className={`p-2.5 transition-all border-2 ${
              isPrivacyMode
                ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                : 'border-black text-black dark:border-white dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
            aria-label="Toggle privacy mode"
          >
            <EyeOff size={18} strokeWidth={isPrivacyMode ? 3 : 2} />
          </button>

          {/* Disconnect */}
          <button
            onClick={disconnect}
            className="p-2.5 border-2 border-black dark:border-white text-black dark:text-white hover:bg-red-50 dark:hover:bg-red-950 hover:border-red-500 hover:text-red-600 transition-all"
            aria-label="Disconnect wallet"
            title="Disconnect wallet"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Wallet address bar */}
      {address && (
        <button
          onClick={handleCopyAddress}
          className="mt-2 flex items-center gap-1.5 text-[9px] font-mono font-bold text-black/30 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
          title="Copy full address"
        >
          {copied ? (
            <>
              <Check size={9} className="text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={9} />
              <span>{truncateAddress(address)}</span>
            </>
          )}
        </button>
      )}
    </header>
  );
};

export default Header;