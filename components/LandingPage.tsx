import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Shield, Lock, Zap, Globe, Users, ArrowRight, ChevronDown, ChevronUp, Code } from 'lucide-react';
import { ACTIVE_NETWORK_CONFIG } from '../config/networks';

const shimmerKeyframes = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.gh-btn-shimmer::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(192,192,192,0.15) 40%, rgba(255,255,255,0.35) 50%, rgba(192,192,192,0.15) 60%, transparent 100%);
  transform: translateX(-100%);
  pointer-events: none;
}
.gh-btn-shimmer:hover::before {
  animation: shimmer 1.2s ease-in-out;
}
.gh-btn-shimmer:hover {
  box-shadow: 0 0 20px rgba(192,192,192,0.3), 0 0 40px rgba(192,192,192,0.15);
  border-color: #c0c0c0;
}
@keyframes logo-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.logo-carousel-track {
  animation: logo-scroll 25s linear infinite;
}
.logo-carousel-track:hover {
  animation-play-state: paused;
}
.glass-card-premium {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
.orange-glow-subtle {
  box-shadow: 0 0 20px rgba(247, 147, 26, 0.15);
}
`;

const triviaQuestions = [
  {
    level: 'Level 1: The Genesis Block',
    question: 'Who is the creator of Bitcoin?',
    options: ['Satoshi Nakamoto', 'Hal Finney', 'Vitalik Buterin', 'Nick Szabo'],
    correct: 0,
  },
];

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
  { label: 'APR (STAKING)', value: '5.25%' },
  { label: 'DEX', value: 'AVNU' },
  { label: 'LENDING', value: 'Vesu' },
  { label: 'NETWORK', value: 'Starknet' },
];

const partnerLogos = [
  { name: 'Starkware', src: 'https://mintcdn.com/avnu/_JpzWk4ZjyPdn4Yr/images/companies/Starkware.png?fit=max&auto=format&n=_JpzWk4ZjyPdn4Yr&q=85&s=95e3c13aa6dc7a960f162cecedaf9278', white: true },
  { name: 'Ready', src: 'https://mintcdn.com/avnu/_JpzWk4ZjyPdn4Yr/images/companies/ready.png?fit=max&auto=format&n=_JpzWk4ZjyPdn4Yr&q=85&s=15aae26bd380f2fb085bda6b03ae3f8a', white: true },
  { name: 'Vesu', src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAABUFBMVEUAAAD///+5ubn6+vouLi6xsbGlpaW1tbXw8PARERGUlJR2dnYdHR3k5OQyMjI4ODhbW1snJycYGBhgYGBsbGxJSUlWVlYLCwvHx8c/Pz+EhISfn5+/v78WGBtPT09CNSGihxqjnSeLtDx9wU51yFl702+I4Y6U8LKW9Mvl//ZPSUZ8UwC1iBirkx+YpzOFu0Og9MLP+dthobRqscdrPAC9gBSXtD2Kz2Wb34in6aSz8bnS99F7m6W26fnBdAKgwEme0GWo3X+36JnF8K9kiZWpUgCwuUC40GLB33vM65jm/dms0t5jKADWbQjGliXErTjN0WDS3XXe6Zfl7azy89M7SU3YXwDJbQrPjyLgyFvq3IDr5JX477a6uKeKrbeXMgDkt1LR8vxJAADYhjFhc3nEVQDnrVmcnI6nwMiHMgDsv3by4J7vzYve2LvKhzR4UBNXaxXFAAACwUlEQVRoge3Z6XPSQBQA8F0CIUBCyEEIAVNrPbG12lqvClVbz1rrUWtb8UAqVqD6/3/z7S67ph3KxBnwQ2ffB+gub39JXl62w4DwBANJ/ETcSCfGHGlD4Gk09kgLPDF+PCFxiUtc4hKXuMQlLnGJn35c1/UzQ/LKnlMoH5kpFT0nNPnIsiyb/52xbXsoXvH96tTZ6XMz5y9cvHT5ik+Pp9KvCBCaarH1rj+YwYrvwthWME5xvALT+SF4qVar5a/Ozl2bnwH8+g0MZ1tQKKKxN4ekpZmrMB9WZjSMVY5n4aPksDNfWFxcuLk0O31r/vadu/eWIalEzjjQyenlgFDg3B2YStGK6PQS3Jj4/Xq9XmuAvvLg4aPVZSiLCqmimsyAKUPUHkpWjYnnAV973Fiae/L02fPVFzm6WCwjrIZQKorTQTwcrdfr6y83Gq82X795+24L2gAK6wjJJdlkNS6iaMTE11qt1vvtDzubu3sfm5+gB+GjIMeDNEISJUm+X8mFmX/ELcA/f9nY+bq712t6CBXx8YAGcjQ+0PxsMT6ODkD/tt0GvHmIGJ5IRSJBW91NGQo/QDU+vg/4/vd2Z7fX/IFYWcRzeCx0L6DPVzY2jgA/+NnudHtNcsHkhuYEZ5smVCVpmkkxBbpPXwWgjsBToE+1O/3eIV8sHmyaTl99FKEMmiW6UxuBe1jBwa9uvxnQITSIwrsir1CWXLfO06uUrfytnopH4MhQFON3p7/Fdkf2+NNtrkCaxGP3wQjo3mRWaM2RSbNMPZ+jW9rJODl0rbvFr/zIxoWDwS2L7FwGXzTozmAUTrpPPcQuH1uqaGs/HJSuKhrRyLKpgCUpaobsa8O23IEehqFeQNEoO67jWUemTK9QCKNTuud45O6UdJvdkVP0P1TiEpe4xCUucYlLXOIS/7/4RH9snejPxJMKiQ+NP1QJS6HcGpU5AAAAAElFTkSuQmCC' },
  { name: 'Ekubo', src: 'https://cdn.bankless.com/i/1716899195835021.png' },
  { name: 'STRK20', src: 'https://framerusercontent.com/images/KHsTqzcNJn981dsR0vwIJ6vDD0.png' },
  { name: 'StarkZap', src: 'https://starkzap.io/logo-icon.png', white: true },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const trivia = triviaQuestions[0];

  return (
    <div className="min-h-screen bg-background text-on-background relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: shimmerKeyframes }} />
      {/* ── Background ── */}
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        <img
          alt=""
          className="w-full h-full object-cover"
          src="/hero-bg-v2.png"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40"></div>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(247, 147, 26, 0.08) 0%, transparent 70%)' }}></div>
      </div>

      {/* ── Floating Navigation ── */}
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

      {/* ── Hero Section: Two Column Layout ── */}
      <main className="relative z-10 min-h-screen flex flex-col justify-center pt-24 pb-base">
        <div className="max-w-[1280px] mx-auto px-5 md:px-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[50vh]">
            
            {/* ── Left Column: Hero Content ── */}
            <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="w-16 h-1 bg-primary-container rounded-full shadow-[0_0_10px_rgba(247,147,26,0.3)]"></div>
              <h1 className="font-body-lg text-[18px] md:text-[20px] text-on-surface-variant leading-relaxed max-w-xl">
                Built for true BTC lovers staying ahead simply and securely: Private Lend, Private Transfer, Private Swap, Private Borrow, Shielded Send, Shielded Swap.
              </h1>
              <div className="flex flex-wrap gap-4 pt-4 md:flex-nowrap">
                <button
                  onClick={() => navigate('/app')}
                  className="bg-primary-container text-on-primary font-label-md text-label-md px-8 py-4 rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all orange-glow-subtle flex items-center gap-2 uppercase tracking-wide"
                >
                  GET STARTED
                </button>
                <a
                  href="https://github.com/cxto21/btcfixed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gh-btn-shimmer bg-white/5 backdrop-blur-md border border-white/10 text-on-surface font-label-md text-label-md px-8 py-4 rounded-lg font-bold hover:bg-white/10 active:scale-95 transition-all flex items-center gap-3"
                >
                  <svg viewBox="0 0 16 16" width="20" height="20" fill="#8b949e" className="group-hover:fill-white transition-colors">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                  <span className="text-[#8b949e] group-hover:text-white transition-colors tracking-wider">
                    Open Source on GitHub
                  </span>
                </a>
              </div>
            </div>

            {/* ── Right Column: Trivia Card ── */}
            <div className="relative flex justify-center items-center h-full min-h-[400px]">
              {/* Trivia Overlay Card */}
              <div className="relative z-10 glass-card-premium rounded-2xl p-8 w-full max-w-[480px] animate-in fade-in zoom-in-95 duration-1000 border-white/10 hover:border-primary-container/20 transition-colors duration-500">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center border border-primary-container/30">
                      <span className="text-primary-container text-[22px] font-bold">₿</span>
                    </div>
                    <span className="font-label-md text-on-surface-variant/80 uppercase tracking-widest text-[11px] font-semibold">Bitcoin Trivia</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <span className="text-primary-container text-[14px]">🏆</span>
                    <span className="font-label-sm text-on-surface text-[10px] font-bold uppercase tracking-wider">Novice</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-primary-container/90 font-headline-lg text-[16px] mb-1 font-medium tracking-wide">{trivia.level}</h3>
                    <p className="font-headline-lg text-on-surface text-[22px] leading-tight">{trivia.question}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 mt-6">
                    {trivia.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        className={`flex items-center gap-4 w-full p-4 rounded-xl border transition-all text-left group ${
                          showResult && index === trivia.correct
                            ? 'border-green-500/50 bg-green-500/10'
                            : showResult && index === selectedAnswer
                            ? 'border-red-500/50 bg-red-500/10'
                            : 'border-white/5 bg-white/5 hover:border-primary-container/40 hover:bg-primary-container/5'
                        }`}
                        disabled={showResult}
                      >
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-label-md font-bold transition-colors ${
                          showResult && index === trivia.correct
                            ? 'bg-green-500/20 text-green-400'
                            : showResult && index === selectedAnswer
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-white/5 text-on-surface-variant group-hover:text-primary-container'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="font-body-md text-on-surface/90">{option}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="pt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-label-sm text-on-surface-variant/60">Progress</span>
                      <span className="font-label-sm text-primary-container font-bold">20%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-container w-[20%] rounded-full shadow-[0_0_8px_rgba(247,147,26,0.5)]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Partners Carousel (directly below hero) ── */}
        <section className="w-full max-w-4xl mx-auto mt-8 mb-8 opacity-40">
          <p className="text-center text-[10px] font-label-sm text-on-surface-variant uppercase tracking-[0.3em] mb-6 font-bold">
            POWERED BY THE BEST
          </p>
          <div className="relative overflow-hidden">
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            <div className="logo-carousel-track flex items-center gap-16 w-max">
              {[...partnerLogos, ...partnerLogos].map((logo, i) => (
                <img
                  key={`${logo.name}-${i}`}
                  src={logo.src}
                  alt={logo.name}
                  className={`h-8 md:h-10 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity duration-300 flex-shrink-0${logo.white ? ' brightness-0 invert' : ''}`}
                  style={logo.scale ? { transform: `scale(${logo.scale})` } : undefined}
                />
              ))}
            </div>
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
                  src="/hero-bg-v2.png"
                  alt="BTCFixed"
                  className="h-6 w-auto object-contain"
                />
              </div>
              <p className="font-body-md text-mono-data text-outline">© 2026 BTCFixed. Secure Bitcoin DeFi on Starknet.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <a className="text-outline font-label-caps text-label-caps hover:text-primary transition-colors" href="/docs">Docs</a>
              <a className="text-outline font-label-caps text-label-caps hover:text-primary transition-colors" href="https://x.com/btcfixed" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a className="text-outline font-label-caps text-label-caps hover:text-primary transition-colors" href="https://t.me/+umoVSGsajrY2M2Vh" target="_blank" rel="noopener noreferrer">Telegram</a>
              <a className="text-outline font-label-caps text-label-caps hover:text-primary transition-colors" href="/community">Community</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
