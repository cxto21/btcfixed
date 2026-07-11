import React from 'react';
import { MessageCircle, Send, Phone, Users, Globe, Shield } from 'lucide-react';
import { ACTIVE_NETWORK_CONFIG } from '../config/networks';
import PublicNav from './PublicNav';

const communityLinks = [
  {
    name: 'Telegram',
    description: 'Join our Telegram community for real-time discussions, announcements, and support.',
    url: 'https://t.me/btcfixed',
    icon: Send,
    color: '#229ED9',
    bgColor: 'bg-[#229ED9]/10',
    textColor: 'text-[#229ED9]',
  },
  {
    name: 'X (Twitter)',
    description: 'Follow us on X for the latest updates, news, and crypto insights.',
    url: 'https://x.com/btcfixed',
    icon: MessageCircle,
    color: '#000000',
    bgColor: 'bg-black/10 dark:bg-white/10',
    textColor: 'text-black dark:text-white',
  },
  {
    name: 'WhatsApp',
    description: 'Connect with the community on WhatsApp for quick updates and chat.',
    url: 'https://chat.whatsapp.com/btcfixed',
    icon: Phone,
    color: '#25D366',
    bgColor: 'bg-[#25D366]/10',
    textColor: 'text-[#25D366]',
  },
];

const features = [
  {
    icon: Globe,
    title: 'Global Community',
    description: 'Connect with Bitcoin DeFi enthusiasts from around the world.',
  },
  {
    icon: Shield,
    title: 'Security First',
    description: 'Discuss security practices and stay safe in the DeFi space.',
  },
  {
    icon: Users,
    title: 'Governance',
    description: 'Participate in community decisions and shape the future of BTCFixed.',
  },
];

const Community: React.FC = () => {
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
            Be part of the Bitcoin DeFi revolution on Starknet. Connect, learn, and grow with our community.
          </p>
        </section>

        {/* ── Community Links ── */}
        <section className="w-full max-w-6xl mx-auto mt-20">
          <h2 className="text-headline-lg font-display-hero text-on-background text-center mb-12">Connect With Us</h2>
          <div className="grid gap-6">
            {communityLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-effect rounded-2xl p-6 hover-lift group"
                >
                  <div className="flex items-start gap-6">
                    <div className={`w-12 h-12 rounded-xl ${link.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon size={24} style={{ color: link.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-headline-md font-bold text-on-surface">{link.name}</h3>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-primary transition-colors">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                          <polyline points="15,3 21,3 21,9"/>
                          <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                      </div>
                      <p className="text-base text-on-surface-variant">{link.description}</p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* ── Features ── */}
        <section className="w-full max-w-6xl mx-auto mt-20">
          <h2 className="text-headline-lg font-display-hero text-on-background text-center mb-12">Why Join?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass-effect rounded-2xl p-6 hover-lift"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-headline-md font-bold text-on-surface mb-2">{feature.title}</h3>
                      <p className="text-base text-on-surface-variant">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="w-full max-w-4xl mx-auto mt-20 mb-10">
          <div className="heavy-glass rounded-2xl p-8 text-center">
            <h3 className="text-headline-md font-display-hero text-on-surface mb-4">Ready to Get Started?</h3>
            <p className="text-on-surface-variant mb-6 text-base">Connect your wallet and start earning yield on your Bitcoin today.</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-on-primary font-label-caps text-label-caps px-8 py-3 rounded-full font-bold hover:opacity-80 active:scale-95 transition-all shadow-lg"
            >
              Launch App
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
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
              <a href="https://t.me/btcfixed" target="_blank" rel="noopener noreferrer" className="text-outline font-label-caps text-label-caps hover:text-primary transition-colors">Telegram</a>
              <a href="/community" className="text-outline font-label-caps text-label-caps hover:text-primary transition-colors">Community</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Community;
