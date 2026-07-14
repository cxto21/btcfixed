import React from 'react';
import { Shield, Zap, Lock, Globe, Users, Code, ExternalLink } from 'lucide-react';
import PublicNav from './PublicNav';

const stats = [
  { label: 'Total Value Locked', value: '$2.4M+', change: '+12% this week' },
  { label: 'Active Users', value: '1,200+', change: 'Growing daily' },
  { label: 'APR (Staking)', value: '5.25%', change: 'StarkZap validators' },
  { label: 'Supported Chains', value: 'Starknet', change: 'L2 on Ethereum' },
];

const values = [
  {
    icon: Shield,
    title: 'Non-Custodial',
    description: 'Your keys, your crypto. We never hold your funds or have access to your wallet.',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Optional privacy mode with ZK-powered features. Your financial data stays yours.',
  },
  {
    icon: Zap,
    title: 'Instant Settlement',
    description: 'Starknet L2 provides sub-second finality and minimal gas fees.',
  },
  {
    icon: Globe,
    title: 'Open Source',
    description: 'Transparent and auditable code. Community-driven development.',
  },
];

const team = [
  {
    name: 'BTCFixed Team',
    role: 'Core Contributors',
    description: 'Building the future of Bitcoin DeFi on Starknet.',
  },
];

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-on-background relative overflow-hidden">
      {/* ── Background Blur Orbs ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -left-1/4 top-0 w-[800px] h-[800px] blur-[120px] opacity-20 bg-primary/40 rounded-full animate-pulse" />
        {/* Large "B" watermark — positioned upper area behind the hero */}
        <img
          alt=""
          className="absolute left-1/2 top-[5%] -translate-x-1/2 w-full max-w-4xl h-auto opacity-10 mix-blend-screen select-none pointer-events-none"
          src="/BTCFixed-Logotype.png?v=2"
        />
        <div className="absolute -right-20 bottom-0 w-[600px] h-[600px] blur-[100px] opacity-10 bg-primary/30 rounded-full" />
      </div>

      {/* ── Floating Navigation ── */}
      <PublicNav />

      {/* ── Hero Section ── */}
      <main className="relative z-10 min-h-screen flex flex-col justify-center items-center py-20 px-6 md:px-40">
        <section className="max-w-4xl mx-auto relative z-10 text-center flex flex-col items-center">
          {/* Title */}
          <div className="mb-12">
            <img
              src="/BTCFixed-Logotype.png?v=2"
              alt="BTCFixed"
              className="h-32 md:h-40 w-auto object-contain mx-auto mb-6"
            />
            <div className="w-48 h-2.5 bg-primary mx-auto rounded-full" />
          </div>

          {/* Subtitle */}
          <p className="font-headline-md text-headline-md max-w-2xl text-on-surface-variant mb-12">
            Bitcoin DeFi, simplified
          </p>
        </section>

        {/* ── Stats Bar ── */}
        <section className="w-full max-w-4xl mx-auto mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-effect rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-primary font-display-hero">{stat.value}</p>
                <p className="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-widest mt-1">{stat.label}</p>
                <p className="text-[10px] font-label-caps text-on-surface-variant mt-1">{stat.change}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Mission ── */}
        <section className="w-full max-w-4xl mx-auto mt-8">
          <div className="glass-effect rounded-2xl p-6 md:p-8 hover-lift">
            <h2 className="text-headline-md font-display-hero text-on-surface mb-4">Our Mission</h2>
            <p className="text-base text-on-surface-variant leading-relaxed">
              BTCFixed is building the institutional-grade Bitcoin DeFi layer on Starknet. We believe every Bitcoin holder
              should be able to earn yield, access liquidity, and participate in DeFi — without selling their BTC or
              compromising on security.
            </p>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="w-full max-w-4xl mx-auto mt-8">
          <h2 className="text-headline-md font-display-hero text-on-background text-center mb-8">What We Stand For</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="glass-effect rounded-2xl p-6 hover-lift"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-headline-md font-bold text-on-surface mb-2">{value.title}</h3>
                      <p className="text-sm text-on-surface-variant">{value.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Technology ── */}
        <section className="w-full max-w-4xl mx-auto mt-8">
          <div className="glass-effect rounded-2xl p-6 md:p-8 hover-lift">
            <h2 className="text-headline-md font-display-hero text-on-surface mb-6">Built On</h2>
            <div className="space-y-4">
              {[
                { name: 'Starknet', description: 'Zero-knowledge rollup for scalable, secure DeFi' },
                { name: 'StarkZap', description: 'Staking SDK for STRK delegation' },
                { name: 'AVNU', description: 'DEX aggregator for best swap rates' },
                { name: 'Vesu', description: 'Lending protocol for supply and borrow' },
                { name: 'Cartridge', description: 'Wallet with social login support' },
              ].map((tech) => (
                <div key={tech.name} className="flex items-center justify-between py-3 border-b border-outline-variant/20 last:border-0">
                  <div>
                    <p className="font-headline-md font-bold text-on-surface">{tech.name}</p>
                    <p className="text-sm text-on-surface-variant">{tech.description}</p>
                  </div>
                  <ExternalLink size={16} className="text-on-surface-variant" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section className="w-full max-w-4xl mx-auto mt-8">
          <div className="glass-effect rounded-2xl p-6 md:p-8 hover-lift">
            <h2 className="text-headline-md font-display-hero text-on-surface mb-6">Team</h2>
            {team.map((member) => (
              <div key={member.name} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">R</span>
                </div>
                <div>
                  <p className="font-headline-md font-bold text-on-surface">{member.name}</p>
                  <p className="text-sm text-primary">{member.role}</p>
                  <p className="text-base text-on-surface-variant mt-1">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="w-full max-w-4xl mx-auto mt-20 mb-10">
          <div className="heavy-glass rounded-2xl p-8 text-center">
            <h3 className="text-headline-md font-display-hero text-on-surface mb-4">Ready to Start?</h3>
            <p className="text-on-surface-variant mb-8 text-base">Connect your wallet and explore Bitcoin DeFi on Starknet.</p>
            <a
              href="/"
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
                src="/BTCFixed-Logotype.png?v=2"
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

export default About;
