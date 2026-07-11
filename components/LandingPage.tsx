import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Shield, Lock, Zap, Globe, Users, ArrowRight, ChevronDown, ChevronUp, Code } from 'lucide-react';
import { ACTIVE_NETWORK_CONFIG } from '../config/networks';

const DropdownNavItem: React.FC<{ label: string; items: {name: string; id: string; href?: string}[] }> = ({ label, items }) => {
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
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 font-label-caps text-label-caps"
      >
        {label}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 glass-effect rounded-xl p-4 shadow-2xl min-w-48 z-50">
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.href || `/features#${item.id}`}
                className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-caps text-label-caps py-2 px-3 rounded-lg hover:bg-white/5"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const features = [
  {
    icon: Zap,
    title: 'Earn Yield',
    description: 'Stake STRK and earn up to 5.25% APR through StarkZap validators.',
  },
  {
    icon: ArrowRight,
    title: 'Swap Tokens',
    description: 'Instant token swaps via AVNU DEX aggregator with the best rates.',
  },
  {
    icon: Globe,
    title: 'Supply & Borrow',
    description: 'Deposit assets to Vesu Prime pool or borrow against your holdings.',
  },
  {
    icon: Shield,
    title: 'Privacy Mode',
    description: 'Optional ZK-powered privacy features for your transactions.',
  },
];

const stats = [
  { label: 'APR (Staking)', value: '5.25%' },
  { label: 'DEX', value: 'AVNU' },
  { label: 'Lending', value: 'Vesu' },
  { label: 'Network', value: 'Starknet' },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-on-background relative overflow-hidden">
      {/* ── Background Blur Orbs ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -left-1/4 top-0 w-[800px] h-[800px] blur-[120px] opacity-20 bg-primary/40 rounded-full animate-pulse" />
        {/* Large "B" watermark — positioned upper area behind the hero */}
        <img
          alt=""
          className="absolute left-1/2 top-[5%] -translate-x-1/2 w-full max-w-4xl h-auto opacity-10 mix-blend-screen select-none pointer-events-none"
          src="/B-Background.png"
        />
        <div className="absolute -right-20 bottom-0 w-[600px] h-[600px] blur-[100px] opacity-10 bg-primary/30 rounded-full" />
      </div>

      {/* ── Floating Navigation ── */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-80px)] max-w-[1100px]">
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
                { name: 'Multi-Sign', id: 'multi-sign' },
                { name: 'Private Lend', id: 'private-lend' },
                { name: 'Private Transfer', id: 'private-transfer' },
                { name: 'Private Swap', id: 'private-swap' },
                { name: 'Private Borrow', id: 'private-borrow' },
                { name: 'Shielded Send', id: 'shielded-send' },
                { name: 'Shielded Swap', id: 'shielded-swap' },
                { name: 'Yield Staking', id: 'yield-staking' },
              ]}
            />
            <DropdownNavItem
              label="Technology"
              items={[
                { name: 'Documentation', id: 'docs', href: '/docs' },
                { name: 'Starknet', id: 'starknet', href: '/docs' },
                { name: 'Security', id: 'security', href: '/docs' },
              ]}
            />
            <DropdownNavItem
              label="Community"
              items={[
                { name: 'Telegram', id: 'telegram', href: '/community' },
                { name: 'Twitter', id: 'twitter', href: '/community' },
                { name: 'About Us', id: 'about', href: '/about' },
              ]}
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

      {/* ── Hero Section ── */}
      <main className="relative z-10 min-h-screen flex flex-col justify-center items-center py-20 px-6 md:px-40">
        <section className="max-w-4xl mx-auto relative z-10 text-center flex flex-col items-center">
          {/* Title */}
          <div className="mb-6">
            <img
              src="/BTCFixed-Logotype.png"
              alt="BTCFixed"
              className="h-40 md:h-52 w-auto object-contain mx-auto mb-2"
            />
            <div className="w-48 h-2.5 bg-primary mx-auto rounded-full" />
          </div>

          {/* Subtitle */}
          <p className="font-headline-md text-headline-md max-w-2xl text-on-surface-variant mb-10">
            Built for true BTC lovers staying ahead simply and securely: Private Lend, Private Transfer, Private Swap, Private Borrow, Shielded Send, Shielded Swap.
          </p>

          {/* CTA + Open Source in same row */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => navigate('/app')}
              className="bg-primary text-on-primary font-label-caps text-label-caps px-8 py-3 rounded-full font-bold hover:opacity-80 active:scale-95 transition-all shadow-lg shadow-primary/20 text-lg"
            >
              GET STARTED
            </button>

            <a
              href="https://github.com/cxto21/btcfixed"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#21262d] border border-[#30363d] hover:border-[#8b949e] transition-colors group"
            >
              <svg viewBox="0 0 16 16" width="16" height="16" fill="#8b949e" className="group-hover:fill-white transition-colors">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              <span className="font-label-caps text-[11px] text-[#8b949e] group-hover:text-white transition-colors tracking-wider">
                Open Source on GitHub
              </span>
            </a>
          </div>
        </section>

        {/* ── Stats Bar ── */}
        <section id="stats" className="w-full max-w-4xl mx-auto mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-effect rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-primary font-display-hero">{stat.value}</p>
                <p className="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="w-full max-w-4xl mx-auto mt-20 space-y-6">
          <h2 className="text-headline-lg font-display-hero text-on-background text-center mb-8">Why BTCFixed?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="glass-effect rounded-2xl p-6 hover-lift">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-headline-md font-bold text-on-surface mb-1">{feature.title}</h3>
                      <p className="text-sm text-on-surface-variant">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="w-full max-w-4xl mx-auto mt-20 mb-10">
          <div className="heavy-glass rounded-2xl p-8 text-center">
            <h3 className="text-headline-md font-display-hero text-on-surface mb-3">Ready to Start?</h3>
            <p className="text-on-surface-variant mb-6">Connect your wallet and explore Bitcoin DeFi on Starknet.</p>
            <button
              onClick={() => navigate('/app')}
              className="bg-primary text-on-primary font-label-caps text-label-caps px-8 py-3 rounded-full font-bold hover:opacity-80 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              LAUNCH APP
            </button>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 bg-background">
        <div className="max-w-[1280px] mx-auto px-10 py-12 border-t border-outline-variant/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-2">
                <img
                  src="/BTCFixed-Logotype.png"
                  alt="BTCFixed"
                  className="h-6 w-auto object-contain"
                />
              </div>
              <p className="font-body-md text-mono-data text-outline">© 2026 BTCFixed. Secure Bitcoin DeFi on Starknet.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <a className="text-outline font-label-caps text-label-caps hover:text-primary transition-colors" href="/docs">Docs</a>
              <a className="text-outline font-label-caps text-label-caps hover:text-primary transition-colors" href="https://x.com/btcfixed" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a className="text-outline font-label-caps text-label-caps hover:text-primary transition-colors" href="https://t.me/btcfixed" target="_blank" rel="noopener noreferrer">Telegram</a>
              <a className="text-outline font-label-caps text-label-caps hover:text-primary transition-colors" href="/community">Community</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
