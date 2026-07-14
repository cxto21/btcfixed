import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { EyeOff, Eye, Moon, Sun, LogOut, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DesktopLayoutProps {
  children: React.ReactNode;
  isPrivacyMode: boolean;
  setIsPrivacyMode: (v: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
}

const DropdownNavItem: React.FC<{
  label: string;
  items: { name: string; href: string }[];
}> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 font-label-caps text-label-caps"
      >
        {label}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 rounded-xl p-4 shadow-2xl min-w-48 z-50 border border-white/10" style={{ background: 'rgba(20, 20, 20, 0.92)', backdropFilter: 'blur(20px)' }}>
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-caps text-label-caps py-2 px-3 rounded-lg hover:bg-white/5"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  children,
  isPrivacyMode,
  setIsPrivacyMode,
  isDarkMode,
  setIsDarkMode,
}) => {
  const { isConnected, displayName, address, disconnect } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="relative min-h-screen bg-background text-on-background overflow-x-hidden">
      {/* Background Blur Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-1/4 top-0 w-[800px] h-[800px] blur-[120px] opacity-20 bg-primary/40 rounded-full animate-pulse" />
        {/* Large "B" watermark — positioned upper area behind the app */}
        <img
          alt=""
          className="absolute left-1/2 top-[5%] -translate-x-1/2 w-full max-w-4xl h-auto opacity-10 mix-blend-screen select-none pointer-events-none"
          src="/BTCFixed-Logotype.png"
        />
        <div className="absolute -right-20 bottom-0 w-[600px] h-[600px] blur-[100px] opacity-10 bg-primary/30 rounded-full" />
      </div>

      {/* Floating Navigation */}
      <header className="floating-nav">
        <div className="glass-effect rounded-full px-6 py-2 flex justify-between items-center shadow-2xl">
          <div className="flex items-center gap-3">
            <NavLink to="/" className="flex items-center justify-center hover:opacity-80 transition-opacity">
              <div className="h-8 overflow-hidden flex items-center justify-center">
                <img
                  src="/BTCFixed-Logotype.png"
                  alt="BTCFixed"
                  className="h-36 w-auto object-contain"
                />
              </div>
            </NavLink>
          </div>

          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
            <DropdownNavItem
              label="Features"
              items={[
                { name: 'Multi-Sign', href: '/features#multi-sign' },
                { name: 'Private Lend', href: '/features#private-lend' },
                { name: 'Private Transfer', href: '/features#private-transfer' },
                { name: 'Private Swap', href: '/features#private-swap' },
                { name: 'Private Borrow', href: '/features#private-borrow' },
                { name: 'Shielded Send', href: '/features#shielded-send' },
                { name: 'Shielded Swap', href: '/features#shielded-swap' },
                { name: 'Yield Staking', href: '/features#yield-staking' },
              ]}
            />
            <DropdownNavItem
              label="Technology"
              items={[
                { name: 'Documentation', href: '/docs' },
                { name: 'Starknet', href: '/docs' },
                { name: 'Security', href: '/docs' },
              ]}
            />
            <DropdownNavItem
              label="Community"
              items={[
                { name: 'Telegram', href: 'https://t.me/+umoVSGsajrY2M2Vh' },
                { name: 'Twitter', href: '/community' },
                { name: 'About Us', href: '/about' },
              ]}
            />
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-tertiary/10 px-3 py-1 rounded-full border border-tertiary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary mr-2 animate-pulse" />
              <span className="font-label-caps text-[10px] text-tertiary tracking-widest">TESTNET</span>
            </div>

            <button
              onClick={() => setIsPrivacyMode(!isPrivacyMode)}
              className={`p-2 rounded-full transition-all ${
                isPrivacyMode
                  ? 'text-primary bg-primary/10'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
              title={isPrivacyMode ? 'Privacy on' : 'Privacy off'}
            >
              {isPrivacyMode ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full text-on-surface-variant hover:text-primary transition-all"
              title={isDarkMode ? 'Light mode' : 'Dark mode'}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {isConnected ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-2 glass-effect px-3 py-1.5 rounded-full">
                  <img
                    src="/BTCFixed-Logotype.png"
                    alt="BTCFixed"
                    className="h-5 w-auto object-contain"
                  />
                  <span className="font-label-caps text-[11px] text-on-surface">
                    {displayName ?? (address ? truncateAddress(address) : 'Connected')}
                  </span>
                </div>
                <button
                  onClick={disconnect}
                  className="p-2 rounded-full text-on-surface-variant hover:text-error transition-all"
                  title="Disconnect"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/app')}
                className="bg-primary text-on-primary font-label-caps text-label-caps px-5 py-2 rounded-full font-bold hover:opacity-80 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                CONNECT
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-on-surface-variant hover:text-primary transition-all"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-2 glass-effect rounded-2xl p-4 space-y-1 shadow-2xl">
            <NavLink to="/features" onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl font-label-caps text-label-caps text-on-surface-variant hover:bg-white/5 hover:text-primary transition-all">
              Features
            </NavLink>
            <NavLink to="/docs" onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl font-label-caps text-label-caps text-on-surface-variant hover:bg-white/5 hover:text-primary transition-all">
              Technology
            </NavLink>
            <NavLink to="/community" onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl font-label-caps text-label-caps text-on-surface-variant hover:bg-white/5 hover:text-primary transition-all">
              Community
            </NavLink>
          </div>
        )}
      </header>

      {/* Main Content — two-column desktop layout */}
      <main className="relative z-10 min-h-screen flex items-center justify-center py-24 px-6 md:px-12 lg:px-20">
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          {/* Left: App content */}
          <div className="flex-1 w-full max-w-2xl">
            {children}
          </div>

          {/* Right: Branding panel (desktop only) */}
          <div className="hidden lg:flex flex-col items-center justify-center w-80 flex-shrink-0">
            <div className="glass-effect rounded-2xl p-8 text-center space-y-6">
              <img
                src="/BTCFixed-Logotype.png"
                alt="BTCFixed"
                className="h-28 w-auto object-contain mx-auto"
              />
              <div className="space-y-3">
                <p className="font-headline-md text-on-surface text-lg">
                  Bitcoin DeFi on Starknet
                </p>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Earn yield, swap, lend, and borrow — all without giving up your keys.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-effect rounded-xl p-3 text-center">
                  <p className="text-primary font-bold font-display-hero text-lg">5.25%</p>
                  <p className="text-[9px] font-label-caps text-on-surface-variant uppercase tracking-widest">APR</p>
                </div>
                <div className="glass-effect rounded-xl p-3 text-center">
                  <p className="text-primary font-bold font-display-hero text-lg">ZK</p>
                  <p className="text-[9px] font-label-caps text-on-surface-variant uppercase tracking-widest">Privacy</p>
                </div>
              </div>
              <div className="pt-2 border-t border-outline-variant/10">
                <a
                  href="/features"
                  className="text-primary font-label-caps text-[11px] uppercase tracking-wider hover:underline"
                >
                  Explore Features →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-background">
        <div className="max-w-[1280px] mx-auto px-10 py-12 border-t border-outline-variant/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
              <img
                src="/BTCFixed-Logotype.png"
                alt="BTCFixed"
                className="h-6 w-auto object-contain"
              />
              <p className="font-body-md text-mono-data text-outline">© 2026 BTCFixed. Secure Bitcoin DeFi on Starknet.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <NavLink to="/docs" className="text-outline font-label-caps text-label-caps hover:text-primary transition-colors">
                Docs
              </NavLink>
              <a href="https://x.com/btcfixed" target="_blank" rel="noopener noreferrer" className="text-outline font-label-caps text-label-caps hover:text-primary transition-colors">
                Twitter
              </a>
              <a href="https://t.me/+umoVSGsajrY2M2Vh" target="_blank" rel="noopener noreferrer" className="text-outline font-label-caps text-label-caps hover:text-primary transition-colors">
                Telegram
              </a>
              <NavLink to="/community" className="text-outline font-label-caps text-label-caps hover:text-primary transition-colors">
                Community
              </NavLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DesktopLayout;
