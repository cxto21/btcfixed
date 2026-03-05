import React from 'react';
import { Home, RefreshCw, TrendingUp, Briefcase, ShieldAlert } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'HUB' },
    { id: 'bridge', icon: RefreshCw, label: 'SWAP' },
    { id: 'staking', icon: TrendingUp, label: 'GROW' },
    { id: 'lending', icon: Briefcase, label: 'VAULT' },
    { id: 'verify', icon: ShieldAlert, label: 'ANON' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-black border-t-2 border-black dark:border-white px-6 py-4 flex justify-between z-50 items-center transition-colors duration-300">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className="flex flex-col items-center gap-1 transition-all"
          >
            <div className={`p-1.5 transition-colors ${isActive ? 'text-[#F7931A]' : 'text-black/20 dark:text-white/50'}`}>
              <Icon size={24} strokeWidth={isActive ? 3 : 2} />
            </div>
            <span className={`text-[9px] font-black tracking-widest ${isActive ? 'text-black dark:text-white' : 'text-black/20 dark:text-white/50'}`}>
              {tab.label}
            </span>
            {isActive && <div className="w-1 h-1 bg-[#F7931A] rounded-full mt-0.5"></div>}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;