
import React from 'react';
import { Plus, EyeOff, Target } from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  isPrivacyMode: boolean;
  setIsPrivacyMode: (v: boolean) => void;
  activeTab: TabType;
}

const Header: React.FC<HeaderProps> = ({ activeTab, isPrivacyMode, setIsPrivacyMode }) => {
  const getTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'TERMINAL';
      case 'bridge': return 'INGRESS';
      case 'staking': return 'FIXED YIELD';
      case 'lending': return 'CREDIT';
      case 'verify': return 'SPV PROOF';
      default: return 'APP';
    }
  };

  return (
    <header className="px-6 pt-12 pb-6 sticky top-0 bg-white/90 backdrop-blur-md z-50 flex items-end justify-between border-b-2 border-black">
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <Target size={12} className="text-black" strokeWidth={3} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">BTCFIXED L2</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tighter">{getTitle()}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => setIsPrivacyMode(!isPrivacyMode)}
          className={`p-2.5 rounded-none transition-all border-2 ${isPrivacyMode ? 'bg-black text-white border-black' : 'border-black text-black'}`}
        >
          <EyeOff size={18} strokeWidth={isPrivacyMode ? 3 : 2} />
        </button>
        <button className="p-2.5 bg-black text-white rounded-none border-2 border-black">
          <Plus size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
