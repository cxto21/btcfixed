
import React from 'react';
import { Home, Repeat, Zap, Layers, ShieldCheck } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'HUB' },
    { id: 'bridge', icon: Repeat, label: 'MOVE' },
    { id: 'staking', icon: Zap, label: 'GROW' },
    { id: 'lending', icon: Layers, label: 'VAULT' },
    { id: 'verify', icon: ShieldCheck, label: 'PROOF' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t-[1.5px] border-black px-6 py-4 flex justify-between z-50 items-center">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className="flex flex-col items-center gap-1 transition-all"
          >
            <div className={`p-1.5 transition-colors ${isActive ? 'text-black' : 'text-black/20'}`}>
              <Icon size={24} strokeWidth={isActive ? 3 : 2} />
            </div>
            <span className={`text-[9px] font-black tracking-widest ${isActive ? 'text-black' : 'text-black/20'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
