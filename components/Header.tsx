import React, { useState } from 'react';
import { EyeOff, Eye, Moon, Sun, LogOut, Copy, Check } from 'lucide-react';
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
  const { address, displayName, disconnect } = useAuth();
  const [copied, setCopied] = useState(false);

  const isValidAddress = !!address;

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return displayName ?? (address ? truncateAddress(address) : 'Home');
      case 'bridge':    return 'Swap';
      case 'staking':   return 'Earn';
      case 'lending':   return 'Vault';
      case 'verify':    return 'Identity';
      case 'activity':  return 'History';
      default:          return 'App';
    }
  };

  const handleCopyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <header className="px-5 pt-12 pb-3 sticky top-0 bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl z-50 transition-colors duration-300">
      <div className="flex items-center justify-between">
        {/* Left — logo + wallet chip */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#F7931A] flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">₿</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight dark:text-white leading-tight">
              {getTitle()}
            </h1>
            {isValidAddress && (
              <button
                onClick={handleCopyAddress}
                className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Copy full address"
              >
                {copied ? (
                  <>
                    <Check size={10} className="text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={10} />
                    <span className="font-mono">{truncateAddress(address)}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right — controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setIsPrivacyMode(!isPrivacyMode)}
            className={`p-2 rounded-full transition-all ${
              isPrivacyMode
                ? 'text-[#F7931A] bg-[#F7931A]/10'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
            aria-label="Toggle privacy mode"
          >
            {isPrivacyMode ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

          <button
            onClick={disconnect}
            className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
            aria-label="Disconnect wallet"
            title="Disconnect wallet"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;