import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AlertCircle, ExternalLink, Loader2, Mail, Shield, Wallet, Zap, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import { useAuth } from '../contexts/AuthContext';
import { detectAvailableWallets, WALLET_METADATA, type WalletId, type WalletInfo } from '../config/wallets';
import { ACTIVE_NETWORK_CONFIG } from '../config/networks';

const ArgentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#EE3424" />
    <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="22" fontWeight="bold" fill="white" fontStyle="italic">A</text>
  </svg>
);

const BraavosIcon = () => (
  <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="24" fill="white" />
    <circle cx="24" cy="24" r="16" fill="#222" />
    <circle cx="24" cy="24" r="8" fill="#F5C842" />
  </svg>
);

const CartridgeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#FBCB4A" />
    <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#1a1a1a">C</text>
  </svg>
);

const WalletIcon = () => <Wallet size={24} className="text-white" />;

function WalletButton({
  wallet,
  onClick,
  isLoading,
  accent = false,
}: {
  wallet: WalletInfo;
  onClick: () => void;
  isLoading: boolean;
  accent?: boolean;
}) {
  const icon =
    wallet.id === 'cartridge' ? <CartridgeIcon /> :
    wallet.id === 'argentX' ? <ArgentIcon /> :
    wallet.id === 'braavos' ? <BraavosIcon /> :
    <WalletIcon />;

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`w-full group cursor-pointer transition-all hover-lift rounded-xl ${
        accent
          ? 'glass-effect p-6 flex justify-between items-center'
          : 'glass-effect p-6 flex justify-between items-center'
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">{icon}</div>
          <span className="font-headline-md font-bold text-on-surface uppercase tracking-tight">
            {wallet.name}
          </span>
          {wallet.id === 'cartridge' && (
            <span className="bg-primary/20 text-primary text-[9px] px-1.5 py-0.5 rounded font-bold">SOCIAL</span>
          )}
        </div>
        {wallet.id === 'cartridge' && (
          <p className="text-[10px] text-outline uppercase tracking-wider font-medium ml-[36px]">
            Email · Google · Discord · Passkey
          </p>
        )}
      </div>
      {isLoading ? (
        <Loader2 size={20} className="animate-spin text-primary" />
      ) : (
        <Zap size={20} className="text-primary group-hover:scale-110 transition-transform" />
      )}
    </button>
  );
}

function InstallLink({ wallet }: { wallet: WalletInfo }) {
  const icon =
    wallet.id === 'argentX' ? <ArgentIcon /> :
    wallet.id === 'braavos' ? <BraavosIcon /> :
    <WalletIcon />;

  return (
    <a
      href={wallet.installUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-3 p-4 glass-effect hover:bg-white/5 transition-all rounded-xl group"
    >
      <div className="flex-shrink-0">{icon}</div>
      <span className="font-label-caps text-[11px] font-bold text-on-surface uppercase">{wallet.name}</span>
    </a>
  );
}

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
        <div className="absolute top-full left-0 mt-2 rounded-xl p-4 shadow-2xl min-w-48 z-50 border border-white/10" style={{ background: 'rgba(20, 20, 20, 0.92)', backdropFilter: 'blur(20px)' }}>
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

const AuthScreen: React.FC = () => {
  const { connect, connectWithAddress, isLoading, error } = useAuth();
  const [detected, setDetected] = useState<WalletInfo[]>([]);
  const [connecting, setConnecting] = useState<WalletId | null>(null);

  const privy = usePrivy();
  const privyAvailable = privy.ready;

  useEffect(() => {
    if (!privy.authenticated || !privy.user) return;
    const user = privy.user as unknown as Record<string, unknown>;
    const email = user.email as { address?: string } | undefined;
    const google = user.google as { email?: string; name?: string } | undefined;
    const twitter = user.twitter as { username?: string } | undefined;
    const apple = user.apple as { email?: string } | undefined;
    const displayName = google?.name ?? google?.email ?? email?.address ?? twitter?.username ?? apple?.email ?? null;
    const linkedAccounts = (user as unknown as { linkedAccounts?: Array<{ type: string; chainType?: string; address?: string }> }).linkedAccounts;
    const starknetWallet = linkedAccounts?.find((a) => a.type === 'wallet' && a.chainType === 'starknet' && a.address);
    const embeddedWallet = linkedAccounts?.find((a) => a.type === 'wallet' && a.address);
    const wallet = user.wallet as { address?: string } | undefined;
    const address = starknetWallet?.address ?? embeddedWallet?.address ?? wallet?.address ?? (user.id as string);
    connectWithAddress('privy', address, displayName ?? undefined);
  }, [privy.authenticated, privy.user, connectWithAddress]);

  // Detect wallets with retry mechanism
  useEffect(() => {
    let mounted = true;
    
    const detectWallets = () => {
      const wallets = detectAvailableWallets();
      if (mounted && wallets.length > 0) {
        setDetected(wallets);
      }
    };
    
    // Try immediately
    detectWallets();
    
    // Retry with delays
    const timers = [
      setTimeout(detectWallets, 500),
      setTimeout(detectWallets, 1500),
      setTimeout(detectWallets, 3000),
    ];
    
    return () => {
      mounted = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  const handleConnect = async (walletId: WalletId) => {
    setConnecting(walletId);
    try {
      await connect(walletId);
    } catch {
      // Error is already set in AuthContext state — nothing more needed here
    } finally {
      setConnecting(null);
    }
  };

  const detectedIds = new Set(detected.map((w) => w.id));
  const notInstalled = (['argentX', 'braavos'] as WalletId[])
    .filter((id) => !detectedIds.has(id))
    .map((id) => WALLET_METADATA[id]);

  return (
    <div className="min-h-screen bg-background text-on-background relative overflow-hidden">
      {/* ── Background Blur Orbs ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -left-1/4 top-0 w-[800px] h-[800px] blur-[120px] opacity-20 bg-primary/40 rounded-full animate-pulse" />
        {/* Large "B" watermark — positioned upper area behind the form */}
        <img
          alt=""
          className="absolute left-1/2 top-[5%] -translate-x-1/2 w-full max-w-4xl h-auto opacity-10 mix-blend-screen select-none pointer-events-none"
          src="/hero-bg-v2.png"
        />
        <div className="absolute -right-20 bottom-0 w-[600px] h-[600px] blur-[100px] opacity-10 bg-primary/30 rounded-full" />
      </div>

      {/* ── Floating Navigation (desktop only) ── */}
      <header className="hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-80px)] max-w-[1100px]">
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
                { name: 'Telegram', id: 'telegram', href: 'https://t.me/+umoVSGsajrY2M2Vh' },
                { name: 'Twitter', id: 'twitter', href: '/community' },
                { name: 'About Us', id: 'about', href: '/about' },
              ]}
            />
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-tertiary/10 px-3 py-1 rounded-full border border-tertiary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary mr-2 animate-pulse" />
              <span className="font-label-caps text-[10px] text-tertiary tracking-widest">
                {ACTIVE_NETWORK_CONFIG.isTestnet ? 'TESTNET' : 'MAINNET'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <main className="relative z-10 min-h-screen flex items-center justify-center py-20 px-6 md:px-12 lg:px-20">
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">

          {/* Left: Branding (desktop) / Centered hero (mobile) */}
          <div className="flex-1 w-full max-w-xl text-center lg:text-left">
            <img
              src="/hero-bg-v2.png"
              alt="BTCFixed"
              className="h-40 md:h-48 w-auto object-contain mx-auto lg:mx-0 mb-8"
            />
            <div className="w-48 h-2.5 bg-primary rounded-full mx-auto lg:mx-0 mb-8" />

            <p className="font-headline-md text-headline-md max-w-lg text-on-surface-variant mb-10 leading-relaxed">
              Built for true BTC lovers staying ahead simply and securely: Private Lend, Private Transfer, Private Swap, Private Borrow, Shielded Send, Shielded Swap.
            </p>

            {/* Desktop-only feature highlights */}
            <div className="hidden lg:grid grid-cols-2 gap-4 max-w-md">
              <div className="glass-effect rounded-xl p-4 text-left">
                <p className="text-primary font-bold text-lg">5.25%</p>
                <p className="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-widest">APR Staking</p>
              </div>
              <div className="glass-effect rounded-xl p-4 text-left">
                <p className="text-primary font-bold text-lg">ZK</p>
                <p className="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-widest">Privacy</p>
              </div>
              <div className="glass-effect rounded-xl p-4 text-left">
                <p className="text-primary font-bold text-lg">BTC</p>
                <p className="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-widest">Native Assets</p>
              </div>
              <div className="glass-effect rounded-xl p-4 text-left">
                <p className="text-primary font-bold text-lg">Starknet</p>
                <p className="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-widest">L2 Network</p>
              </div>
            </div>
          </div>

          {/* Right: Connection Card */}
          <div className="w-full max-w-lg lg:w-[480px] flex-shrink-0">
            <div className="heavy-glass p-10 rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] space-y-8">
              <div className="space-y-2">
              <h2 className="font-label-caps text-label-caps text-outline tracking-[0.2em] uppercase text-center">
                Select Wallet Connection
              </h2>
              <div className="h-px w-12 bg-outline/20 mx-auto mt-4" />
            </div>

            <div className="space-y-4 text-left">
              {/* Cartridge */}
              <WalletButton
                wallet={WALLET_METADATA.cartridge}
                onClick={() => handleConnect('cartridge')}
                isLoading={connecting === 'cartridge' && isLoading}
                accent
              />

              {/* Privy */}
              {privyAvailable && (
                <button
                  onClick={() => privy.login()}
                  className="w-full glass-effect p-6 rounded-xl group cursor-pointer hover:bg-white/5 transition-all hover-lift flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail size={20} className="text-primary" />
                      <span className="font-headline-md font-bold text-on-surface uppercase tracking-tight">Private</span>
                    </div>
                    <p className="text-[10px] text-outline uppercase tracking-wider font-medium ml-[28px]">
                      Email · Twitter · Apple
                    </p>
                  </div>
                  <span className="text-outline group-hover:text-primary transition-colors">
                    <ExternalLink size={20} />
                  </span>
                </button>
              )}

              {/* Separator */}
              {(detected.length > 0 || notInstalled.length > 0) && (
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-outline-variant/20" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-surface-container px-4 font-label-caps text-[9px] text-outline uppercase tracking-[0.3em]">
                      OR EXTENSION
                    </span>
                  </div>
                </div>
              )}

              {/* Detected wallets */}
              {detected.map((wallet) => (
                <WalletButton
                  key={wallet.id}
                  wallet={wallet}
                  onClick={() => handleConnect(wallet.id)}
                  isLoading={connecting === wallet.id && isLoading}
                />
              ))}

              {/* Install links - 2-column grid like new_design */}
              {notInstalled.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {notInstalled.map((wallet) => (
                    <InstallLink key={wallet.id} wallet={wallet} />
                  ))}
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-error-container/30 border border-error/50 rounded-xl text-error">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <p className="text-[11px] font-medium leading-relaxed">{error}</p>
              </div>
            )}

            {/* Audited / Secure badges */}
            <div className="flex items-center justify-center gap-6 pt-4 text-outline/60">
              <div className="flex items-center gap-1.5">
                <Shield size={14} />
                <span className="text-[10px] font-medium uppercase tracking-widest">Audited</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock size={14} />
                <span className="text-[10px] font-medium uppercase tracking-widest">Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 bg-background">
        <div className="max-w-[1280px] mx-auto px-10 py-12 border-t border-outline-variant/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
              <img
                src="/hero-bg-v2.png"
                alt="BTCFixed"
                className="h-6 w-auto object-contain"
              />
              <p className="font-body-md text-mono-data text-outline">© 2026 BTCFixed. Secure Bitcoin DeFi on Starknet.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <a className="text-outline font-label-caps text-label-caps hover:text-primary transition-colors" href="/docs">Docs</a>
              <a className="text-outline font-label-caps text-label-caps hover:text-primary transition-colors" href="https://x.com/btcfixed" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a className="text-outline font-label-caps text-label-caps hover:text-primary transition-colors" href="https://t.me/+umoVSGsajrY2M2Vh" target="_blank" rel="noopener noreferrer">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthScreen;
