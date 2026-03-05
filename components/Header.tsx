import React from 'react';
import { Plus, EyeOff, Moon, Sun } from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  isPrivacyMode: boolean;
  setIsPrivacyMode: (v: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
  activeTab: TabType;
}

const Header: React.FC<HeaderProps> = ({ activeTab, isPrivacyMode, setIsPrivacyMode, isDarkMode, setIsDarkMode }) => {
  const getTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'TERMINAL';
      case 'bridge': return 'SWAP';
      case 'staking': return 'GROW';
      case 'lending': return 'VAULT';
      case 'verify': return 'ANONYMOUS';
      case 'activity': return 'HISTORY';
      default: return 'APP';
    }
  };

  return (
    <header className="px-6 pt-12 pb-6 sticky top-0 bg-white/95 dark:bg-black/95 backdrop-blur-md z-50 flex items-end justify-between border-b-2 border-black dark:border-white transition-colors duration-300">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1280px-Bitcoin.svg.png" 
            alt="BTC" 
            className="w-5 h-5"
          />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 dark:text-white/70">
              BTC<span className="font-medium">Fixed</span>
            </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tighter uppercase dark:text-white">{getTitle()}</h1>
      </div>

      <div className="flex items-center gap-2 relative z-10">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2.5 border-2 border-black dark:border-white text-black dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button 
          onClick={() => setIsPrivacyMode(!isPrivacyMode)}
          className={`p-2.5 rounded-none transition-all border-2 ${isPrivacyMode ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'border-black text-black dark:border-white dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
          aria-label="Toggle Privacy Mode"
        >
          <EyeOff size={18} strokeWidth={isPrivacyMode ? 3 : 2} />
        </button>
        <button className="p-2.5 bg-[#F7931A] text-white rounded-none border-2 border-black dark:border-white">
          <Plus size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;