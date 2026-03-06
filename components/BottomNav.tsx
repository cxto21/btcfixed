import React from 'react';
import { Home, RefreshCw, TrendingUp, Briefcase, ShieldAlert } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'bridge', icon: RefreshCw, label: 'Swap' },
    { id: 'staking', icon: TrendingUp, label: 'Earn' },
    { id: 'lending', icon: Briefcase, label: 'Vault' },
    { id: 'verify', icon: ShieldAlert, label: 'ID' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 px-2 pb-5 pt-2 flex justify-around z-50 items-center transition-colors duration-300">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all"
          >
            <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[#F7931A]/10 text-[#F7931A]' : 'text-gray-400 dark:text-gray-500'}`}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
            </div>
            <span className={`text-[10px] font-medium ${isActive ? 'text-[#F7931A]' : 'text-gray-400 dark:text-gray-500'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;