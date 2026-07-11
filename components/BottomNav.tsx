import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, RefreshCw, TrendingUp, Briefcase, ShieldAlert } from 'lucide-react';

const tabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/swap', icon: RefreshCw, label: 'Swap' },
  { path: '/earn', icon: TrendingUp, label: 'Earn' },
  { path: '/vault', icon: Briefcase, label: 'Vault' },
  { path: '/identity', icon: ShieldAlert, label: 'ID' },
];

const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 dark:bg-[#131313]/80 backdrop-blur-xl border-t border-gray-200 dark:border-outline-variant/20 px-2 pb-5 pt-2 flex justify-around z-50 items-center transition-colors duration-300">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-primary/10 text-primary' : 'text-on-surface-variant'}`}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {tab.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BottomNav;
