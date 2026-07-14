import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { Shield, Lock, Zap, Globe, Users, ArrowRight, ChevronDown, ChevronUp, Code } from 'lucide-react';
import { ACTIVE_NETWORK_CONFIG } from '../config/networks';

const DropdownNavItem: React.FC<{ 
  label: string; 
  items: { name: string; id?: string; href?: string }[]; 
  isActive?: boolean;
  onClick?: () => void;
}> = ({ label, items, isActive, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  return (
    <div className="relative" ref={dropdownRef}>
          <button
        onClick={() => {
          setIsOpen(!isOpen);
          onClick?.();
        }}
        className={`${isActive ? 'text-primary font-bold' : 'text-on-surface-variant font-medium'} flex items-center gap-1 hover:text-primary transition-colors duration-200 font-label-caps text-label-caps`}
      >
        {label}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 rounded-xl p-4 shadow-2xl min-w-48 z-50 border border-white/10" style={{ background: 'rgba(20, 20, 20, 0.92)', backdropFilter: 'blur(20px)' }}>
          <div className="flex flex-col gap-2">
            {items.map((item) => {
              const href = item.href;
              return (
                <a
                  key={item.id || item.name}
                  href={href || '/features#' + item.id}
                  className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-caps text-label-caps py-2 px-3 rounded-lg hover:bg-white/5"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const PublicNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  // Check if a path is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);
  
  const featuresItems = [
    { name: 'Multi-Sign', id: 'multi-sign' },
    { name: 'Private Lend', id: 'private-lend' },
    { name: 'Private Transfer', id: 'private-transfer' },
    { name: 'Private Swap', id: 'private-swap' },
    { name: 'Private Borrow', id: 'private-borrow' },
    { name: 'Shielded Send', id: 'shielded-send' },
    { name: 'Shielded Swap', id: 'shielded-swap' },
    { name: 'Yield Staking', id: 'yield-staking' },
  ];
  
  const technologyItems = [
    { name: 'Documentation', id: 'docs', href: '/docs' },
    { name: 'Starknet', id: 'starknet', href: '/docs' },
    { name: 'Security', id: 'security', href: '/docs' },
  ];
  
  const communityItems = [
    { name: 'Telegram', id: 'telegram', href: 'https://t.me/+umoVSGsajrY2M2Vh' },
    { name: 'Twitter', id: 'twitter', href: '/community' },
    { name: 'About Us', id: 'about', href: '/about' },
  ];
  
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-80px)] max-w-[1100px]">
      <div className="glass-effect rounded-full px-6 py-2 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-3">
          <NavLink to="/" className="flex items-center justify-center hover:opacity-80 transition-opacity">
            <div className="h-8 overflow-hidden flex items-center justify-center">
              <img
                src="/hero-bg-v2.png"
                alt="BTCFixed"
                className="h-36 w-auto object-contain"
              />
            </div>
          </NavLink>
        </div>
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
          <DropdownNavItem
            label="Features"
            items={featuresItems}
            isActive={isActive('/features')}
          />
          <DropdownNavItem
            label="Technology"
            items={technologyItems}
            isActive={isActive('/docs')}
          />
          <DropdownNavItem
            label="Community"
            items={communityItems}
            isActive={isActive('/community') || isActive('/about')}
          />
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-tertiary/10 px-3 py-1 rounded-full border border-tertiary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary mr-2 animate-pulse" />
            <span className="font-label-caps text-[10px] text-tertiary tracking-widest">
              {ACTIVE_NETWORK_CONFIG.isTestnet ? 'TESTNET' : 'MAINNET'}
            </span>
          </div>
          <button
            onClick={() => navigate('/app')}
            className="bg-primary text-on-primary font-label-caps text-label-caps px-5 py-2 rounded-full font-bold hover:opacity-80 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            CONNECT
          </button>
        </div>
      </div>
    </header>
  );
};

export default PublicNav;
export { DropdownNavItem };
