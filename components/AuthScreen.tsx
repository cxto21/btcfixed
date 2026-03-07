import React, { useEffect, useState } from 'react';
import { AlertCircle, ExternalLink, Loader2, Mail, Shield, Wallet, Zap } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import { useAuth } from '../contexts/AuthContext';
import { setPrivyLogout } from '../contexts/AuthContext';
import { detectAvailableWallets, WALLET_METADATA, type WalletId, type WalletInfo } from '../config/wallets';
import { ACTIVE_NETWORK, ACTIVE_NETWORK_CONFIG } from '../config/networks';

// Argent X and Braavos SVG icons (inline to avoid external icon deps)
const ArgentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#FF875B" />
    <path d="M24 8L35.2 38H28.4L24 25.2L19.6 38H12.8L24 8Z" fill="white" />
  </svg>
);

const BraavosIcon = () => (
  <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#F5C842" />
    <circle cx="24" cy="24" r="10" fill="#222" />
    <circle cx="24" cy="24" r="5" fill="#F5C842" />
  </svg>
);

// Cartridge Controller icon — the "C" logo style
const CartridgeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#FBCB4A" />
    <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#1a1a1a">C</text>
  </svg>
);

const WalletIcon = () => (
  <Wallet size={24} className="text-white" />
);

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
      className={`w-full h-16 flex items-center justify-between px-6 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity ${
        accent
          ? 'bg-[#FBCB4A] text-black border-2 border-black neo-shadow-orange'
          : 'bg-black text-white neo-shadow-orange'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <div className="text-left">
          <span className={`text-base font-bold tracking-tighter uppercase block ${accent ? 'text-black' : 'text-white'}`}>
            {wallet.name}
          </span>
          {wallet.id === 'cartridge' && (
            <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">
              Email · Google · Discord · Passkey
            </span>
          )}
        </div>
      </div>
      {isLoading ? (
        <Loader2 size={20} className={`animate-spin ${accent ? 'text-black/60' : 'text-[#F7931A]'}`} />
      ) : (
        <span className={`text-[10px] font-black tracking-widest uppercase ${accent ? 'text-black/60' : 'text-[#F7931A]'}`}>
          {wallet.id === 'cartridge' ? <Zap size={16} /> : 'Connect →'}
        </span>
      )}
    </button>
  );
}

function InstallLink({ wallet }: { wallet: WalletInfo }) {
  return (
    <a
      href={wallet.installUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full h-14 border-2 border-white/20 flex items-center justify-between px-6 font-bold tracking-tighter text-white/40 hover:border-white hover:text-white transition-colors"
    >
      <span className="text-sm uppercase">{wallet.name} — Install</span>
      <ExternalLink size={16} />
    </a>
  );
}

const AuthScreen: React.FC = () => {
  const { connect, connectWithAddress, isLoading, error } = useAuth();
  const [detected, setDetected] = useState<WalletInfo[]>([]);
  const [connecting, setConnecting] = useState<WalletId | null>(null);

  // Privy hooks
  const privy = usePrivy();
  const privyAvailable = privy.ready;

  // When Privy authenticates, sync address into our AuthContext
  useEffect(() => {
    if (!privy.authenticated || !privy.user) return;
    const user = privy.user as unknown as Record<string, unknown>;

    // Extract a human-readable display name from Privy user
    const email = user.email as { address?: string } | undefined;
    const google = user.google as { email?: string; name?: string } | undefined;
    const twitter = user.twitter as { username?: string } | undefined;
    const apple = user.apple as { email?: string } | undefined;
    const displayName =
      google?.name ??
      google?.email ??
      email?.address ??
      twitter?.username ??
      apple?.email ??
      null;

    // Try to find a Starknet embedded wallet from linkedAccounts
    const linkedAccounts = (user as unknown as { linkedAccounts?: Array<{ type: string; chainType?: string; address?: string }> }).linkedAccounts;
    const starknetWallet = linkedAccounts?.find(
      (a) => a.type === 'wallet' && a.chainType === 'starknet' && a.address,
    );
    // Fallback: any embedded wallet (EVM), then user.wallet, then DID
    const embeddedWallet = linkedAccounts?.find(
      (a) => a.type === 'wallet' && a.address,
    );
    const wallet = user.wallet as { address?: string } | undefined;
    const address = starknetWallet?.address ?? embeddedWallet?.address ?? wallet?.address ?? (user.id as string);

    connectWithAddress('privy', address, displayName ?? undefined);
  }, [privy.authenticated, privy.user, connectWithAddress]);

  // Detect injected wallets after a short delay so extensions can inject
  useEffect(() => {
    const t = setTimeout(() => setDetected(detectAvailableWallets()), 600);
    return () => clearTimeout(t);
  }, []);

  const handleConnect = async (walletId: WalletId) => {
    setConnecting(walletId);
    try {
      await connect(walletId);
    } finally {
      setConnecting(null);
    }
  };

  const detectedIds = new Set(detected.map((w) => w.id));

  // Wallets to offer for install (not detected, excluding cartridge which is always available)
  const notInstalled = (['argentX', 'braavos'] as WalletId[]).filter(
    (id) => !detectedIds.has(id),
  ).map((id) => WALLET_METADATA[id]);

  return (
    <div className="min-h-screen bg-[#111] flex flex-col px-10 pt-24 pb-12 max-w-md mx-auto overflow-hidden relative">
      {/* Background BTC watermark */}
      <div className="absolute top-[-30px] right-[-30px] opacity-[0.35] pointer-events-none">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1280px-Bitcoin.svg.png"
          alt=""
          className="w-[220px] h-[220px]"
        />
      </div>

      {/* Branding */}
      <div className="mb-16 animate-modern relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1280px-Bitcoin.svg.png"
            alt="BTC"
            className="w-10 h-10"
          />
          <div className="h-6 w-[2px] bg-black/10 mx-2" />
          {ACTIVE_NETWORK_CONFIG.isTestnet ? (
            <span className="text-[9px] font-black uppercase tracking-widest bg-amber-400 text-black px-2 py-0.5">
              TESTNET
            </span>
          ) : (
            <span className="text-[9px] font-black uppercase tracking-widest bg-green-500 text-white px-2 py-0.5">
              MAINNET
            </span>
          )}
        </div>

        <h1 className="text-[88px] leading-[0.75] font-bold tracking-tight mb-8">
          BTC<br />
          <span className="font-medium opacity-80">Fixed</span>
        </h1>

        <div className="h-2 w-20 bg-[#F7931A] mb-8" />

        <p className="text-white/60 font-medium text-xl leading-tight max-w-[280px]">
          Smart HODLing.<br />Borrow, don't sell your cheap coins.
        </p>
      </div>

      {/* Wallet connection section */}
      <div className="mt-auto space-y-3 animate-modern" style={{ animationDelay: '0.1s' }}>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">
          Connect your Starknet wallet
        </p>

        {/* ── Cartridge Controller: always available, no extension needed ── */}
        <WalletButton
          wallet={WALLET_METADATA.cartridge}
          onClick={() => handleConnect('cartridge')}
          isLoading={connecting === 'cartridge' && isLoading}
          accent
        />

        {/* ── Privy: email / social login ── */}
        {privyAvailable && (
          <button
            onClick={() => privy.login()}
            className="w-full h-16 flex items-center justify-between px-6 bg-[#6851FF] text-white transition-opacity hover:opacity-90"
          >
            <div className="flex items-center gap-3">
              <Mail size={24} />
              <div className="text-left">
                <span className="text-base font-bold tracking-tighter uppercase block">
                  Privy
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                  Email · Google · Twitter · Apple
                </span>
              </div>
            </div>
            <span className="text-[10px] font-black tracking-widest uppercase opacity-60">
              Login →
            </span>
          </button>
        )}

        {/* Separator */}
        {(detected.length > 0 || notInstalled.length > 0) && (
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">or extension wallet</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
        )}

        {/* Detected injected wallets */}
        {detected.map((wallet) => (
          <WalletButton
            key={wallet.id}
            wallet={wallet}
            onClick={() => handleConnect(wallet.id)}
            isLoading={connecting === wallet.id && isLoading}
          />
        ))}

        {/* Not installed wallets – show install links */}
        {notInstalled.map((wallet) => (
          <InstallLink key={wallet.id} wallet={wallet} />
        ))}

        {/* Error message */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-500/50 text-red-300 mt-2">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <p className="text-[11px] font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-8 flex flex-col gap-4">
          <div className="flex items-start gap-3 p-4 bg-[#F7931A]/10 border-l-4 border-[#F7931A]">
            <Shield size={16} className="mt-1 shrink-0 text-[#F7931A]" />
            <p className="text-[11px] text-white/80 font-bold leading-relaxed">
              Bitcoin DeFi on Starknet. No liquidations on fixed-rate vaults.
              Full transparency with on-chain proofs.
            </p>
          </div>
          <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] text-center">
            Powered by Starknet · {ACTIVE_NETWORK.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
