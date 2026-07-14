import React, { useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { EyeOff, Eye, Moon, Sun, LogOut, Copy, Check, Menu, X, Users, FileText, Info } from 'lucide-react';
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
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isValidAddress = !!address;

  const getTitle = () => {
    switch (location.pathname) {
      case '/':         return displayName ?? (address ? truncateAddress(address) : 'Home');
      case '/swap':     return 'Swap';
      case '/earn':     return 'Earn';
      case '/vault':    return 'Vault';
      case '/identity': return 'Identity';
      case '/activity': return 'History';
      case '/community': return 'Community';
      case '/docs':     return 'Docs';
      case '/about':    return 'About';
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
    <>
      <header className="px-5 pt-12 pb-3 sticky top-0 bg-white/80 dark:bg-[#131313]/80 backdrop-blur-xl z-50 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NavLink to="/" className="flex items-center justify-center hover:opacity-90 transition-opacity">
              <img
                src="/hero-bg-v2.png"
                alt="BTCFixed"
                className="h-16 w-auto object-contain"
              />
            </NavLink>
            <div>
              <h1 className="text-lg font-bold tracking-tight dark:text-on-background leading-tight">
                {getTitle()}
              </h1>
              {isValidAddress && location.pathname === '/' && (
                <button
                  onClick={handleCopyAddress}
                  className="flex items-center gap-1 text-[11px] text-on-surface-variant hover:text-on-surface transition-colors"
                  title="Copy full address"
                >
                  {copied ? (
                    <>
                      <Check size={10} className="text-secondary" />
                      <span className="text-secondary">Copied!</span>
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

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setIsPrivacyMode(!isPrivacyMode)}
              className={`p-2 rounded-full transition-all ${
                isPrivacyMode
                  ? 'text-primary bg-primary/10'
                  : 'text-on-surface-variant hover:text-primary hover:bg-primary/10'
              }`}
              aria-label="Toggle privacy mode"
            >
              {isPrivacyMode ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all"
              aria-label="Menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <button
              onClick={disconnect}
              className="p-2 rounded-full text-on-surface-variant hover:text-error hover:bg-error/10 transition-all"
              aria-label="Disconnect wallet"
              title="Disconnect wallet"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="sticky top-[76px] z-40 bg-white dark:bg-surface-container border-b border-gray-200 dark:border-outline-variant/20 px-5 py-3 space-y-1 shadow-lg transition-colors duration-300">
          <NavLink to="/community" onClick={() => setMenuOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-white/5 hover:text-primary'}`}>
            <Users size={18} /> Community
          </NavLink>
          <NavLink to="/docs" onClick={() => setMenuOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-white/5 hover:text-primary'}`}>
            <FileText size={18} /> Docs
          </NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-white/5 hover:text-primary'}`}>
            <Info size={18} /> About
          </NavLink>
        </div>
      )}
    </>
  );
};

export default Header;
