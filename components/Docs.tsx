import React from 'react';
import { FileText, BookOpen, Code, Shield, Zap, ExternalLink } from 'lucide-react';
import { ACTIVE_NETWORK_CONFIG } from '../config/networks';
import PublicNav from './PublicNav';

const docSections = [
  {
    icon: BookOpen,
    title: 'Getting Started',
    description: 'Learn the basics of BTCFixed and how to connect your wallet.',
    items: ['Connect Wallet', 'Navigate the Dashboard', 'Understand Your Portfolio'],
  },
  {
    icon: Zap,
    title: 'Staking (Earn)',
    description: 'Stake your STRK tokens and earn up to 5.25% APR through StarkZap.',
    items: ['Delegate to Validators', 'Track Your Rewards', 'Unstake When Ready'],
  },
  {
    icon: Code,
    title: 'Swapping (Bridge)',
    description: 'Swap tokens instantly using AVNU DEX aggregator for the best rates.',
    items: ['Select Token Pair', 'Review Quote', 'Execute Swap'],
  },
  {
    icon: Shield,
    title: 'Lending (Vault)',
    description: 'Supply tokens to Vesu Prime pool and earn yield on your deposits.',
    items: ['Deposit Assets', 'Monitor Positions', 'Withdraw Funds'],
  },
];

const Docs: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-on-background relative overflow-hidden">
      {/* ── Background Blur Orbs ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -left-1/4 top-0 w-[800px] h-[800px] blur-[120px] opacity-20 bg-primary/40 rounded-full animate-pulse" />
        {/* Large "B" watermark — positioned upper area behind the hero */}
        <img
          alt=""
          className="absolute left-1/2 top-[5%] -translate-x-1/2 w-full max-w-4xl h-auto opacity-10 mix-blend-screen select-none pointer-events-none"
          src="/BTCFixed-Logotype.png"
        />
        <div className="absolute -right-20 bottom-0 w-[600px] h-[600px] blur-[100px] opacity-10 bg-primary/30 rounded-full" />
      </div>

      {/* ── Header ── */}
      <PublicNav />

      {/* ── Hero Section ── */}
      <main className="relative z-10 min-h-screen flex flex-col justify-center items-center py-20 px-6 md:px-40">
        <section className="max-w-4xl mx-auto relative z-10 text-center flex flex-col items-center">
          {/* Title */}
          <div className="mb-12">
            <img
              src="/BTCFixed-Logotype.png"
              alt="BTCFixed"
              className="h-32 md:h-40 w-auto object-contain mx-auto mb-6"
            />
            <div className="w-48 h-2.5 bg-primary mx-auto rounded-full" />
          </div>

          {/* Subtitle */}
          <p className="font-headline-md text-headline-md max-w-2xl text-on-surface-variant mb-12">
            Everything you need to know about using BTCFixed — Bitcoin DeFi on Starknet.
          </p>
        </section>

        {/* ── Quick Links ── */}
        <section className="w-full max-w-6xl mx-auto mt-20">
          <h2 className="text-headline-lg font-display-hero text-on-background text-center mb-12">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Whitepaper', href: '#', icon: FileText },
              { label: 'GitHub', href: 'https://github.com/btcfixed', icon: Code },
              { label: 'Audits', href: '#', icon: Shield },
              { label: 'API', href: '#', icon: BookOpen },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-effect rounded-2xl p-6 hover-lift flex flex-col items-center gap-4"
              >
                <link.icon size={24} className="text-primary" />
                <span className="text-sm font-semibold text-on-surface">{link.label}</span>
              </a>
            ))}
          </div>
        </section>

        {/* ── Doc Sections ── */}
        <section className="w-full max-w-6xl mx-auto mt-20">
          <h2 className="text-headline-lg font-display-hero text-on-background text-center mb-12">Doc Sections</h2>
          <div className="space-y-6">
            {docSections.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.title}
                  className="glass-effect rounded-2xl p-6 md:p-8 hover-lift"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-headline-md font-bold text-on-surface mb-2">{section.title}</h3>
                      <p className="text-base text-on-surface-variant mb-4">{section.description}</p>
                      <ul className="space-y-2 ml-0 md:ml-14">
                        {section.items.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-on-surface-variant">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Network Info ── */}
        <section className="w-full max-w-6xl mx-auto mt-20">
          <div className="glass-effect rounded-2xl p-6 md:p-8">
            <h3 className="text-headline-md font-display-hero text-on-surface mb-6">Network Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex justify-between py-3 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">Network</span>
                <span className="font-mono text-on-surface">Starknet Testnet</span>
              </div>
              <div className="flex justify-between py-3 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">RPC</span>
                <span className="font-mono text-xs text-on-surface">starknet.publicnode.com</span>
              </div>
              <div className="flex justify-between py-3 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">Explorer</span>
                <span className="font-mono text-xs text-on-surface">starkscan.co</span>
              </div>
              <div className="flex justify-between py-3 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">DEX</span>
                <span className="font-mono text-xs text-on-surface">AVNU</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Support ── */}
        <section className="w-full max-w-4xl mx-auto mt-20 mb-10 text-center">
          <p className="text-base text-on-surface-variant mb-4">Need help?</p>
          <a
            href="/community"
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-label-caps text-label-caps px-8 py-3 rounded-full font-bold hover:opacity-80 active:scale-95 transition-all shadow-lg"
          >
            Join our Community
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </a>
        </section>
      </main>

      {/* ── Footer ── */}
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
              <a href="/docs" className="text-outline font-label-caps text-label-caps hover:text-primary transition-colors">Docs</a>
              <a href="https://x.com/btcfixed" target="_blank" rel="noopener noreferrer" className="text-outline font-label-caps text-label-caps hover:text-primary transition-colors">Twitter</a>
              <a href="https://t.me/+umoVSGsajrY2M2Vh" target="_blank" rel="noopener noreferrer" className="text-outline font-label-caps text-label-caps hover:text-primary transition-colors">Telegram</a>
              <a href="/community" className="text-outline font-label-caps text-label-caps hover:text-primary transition-colors">Community</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Docs;
