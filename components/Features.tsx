import React from 'react';
import { Shield, Lock, Zap, Globe, Wallet, TrendingUp, ArrowRight, CheckCircle, Users } from 'lucide-react';
import PublicNav from './PublicNav';

const Features: React.FC = () => {
  const features = [
    {
      id: 'multi-sign',
      icon: Shield,
      title: 'Multi-Sign',
      description: 'Multi-signature security for Bitcoin transactions',
    },
    {
      id: 'private-lend',
      icon: Lock,
      title: 'Private Lend',
      description: 'Lend your BTC privately without exposing your position',
    },
    {
      id: 'private-transfer',
      icon: Wallet,
      title: 'Private Transfer',
      description: 'Transfer Bitcoin with full privacy',
    },
    {
      id: 'private-swap',
      icon: ArrowRight,
      title: 'Private Swap',
      description: 'Swap tokens without revealing your identity',
    },
    {
      id: 'private-borrow',
      icon: TrendingUp,
      title: 'Private Borrow',
      description: 'Borrow against your BTC privately',
    },
    {
      id: 'shielded-send',
      icon: CheckCircle,
      title: 'Shielded Send',
      description: 'Send shielded transactions on Starknet',
    },
    {
      id: 'shielded-swap',
      icon: Globe,
      title: 'Shielded Swap',
      description: 'Swap with shielded privacy',
    },
    {
      id: 'yield-staking',
      icon: Users,
      title: 'Yield Staking',
      description: 'Earn 5.25% APR through StarkZap validators',
    },
  ];

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
            Discover the comprehensive suite of private DeFi solutions built for Bitcoin on Starknet.
          </p>
        </section>

        {/* ── Features Grid ── */}
        <section className="w-full max-w-6xl mx-auto mt-20 space-y-8">
          <h2 className="text-headline-lg font-display-hero text-on-background text-center mb-12">All BTCFixed Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  id={feature.id}
                  className="glass-effect rounded-2xl p-6 hover-lift scroll-mt-24"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-headline-md font-bold text-on-surface mb-2">{feature.title}</h3>
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
            <a
              href="/app"
              className="bg-primary text-on-primary font-label-caps text-label-caps px-8 py-3 rounded-full font-bold hover:opacity-80 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              LAUNCH APP
            </a>
          </div>
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

export default Features;