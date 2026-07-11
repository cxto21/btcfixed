import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import AuthScreen from './components/AuthScreen';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import DesktopLayout from './components/DesktopLayout';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Bridge from './components/Bridge';
import Staking from './components/Staking';
import Lending from './components/Lending';
import Verification from './components/Verification';
import ActivityHistory from './components/ActivityHistory';
import Community from './components/Community';
import Docs from './components/Docs';
import About from './components/About';
import Features from './components/Features';
import { AuthProvider, useAuth, setPrivyLogout } from './contexts/AuthContext';
import { usePrivy } from '@privy-io/react-auth';
import type { TabType } from './types';

function PrivyLogoutBridge() {
  const { logout } = usePrivy();
  React.useEffect(() => {
    setPrivyLogout(logout);
    return () => setPrivyLogout(null);
  }, [logout]);
  return null;
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isDesktop;
}

const pathToTab: Record<string, TabType> = {
  '/app': 'dashboard',
  '/app/swap': 'bridge',
  '/app/earn': 'staking',
  '/app/vault': 'lending',
  '/app/identity': 'verify',
  '/app/activity': 'activity',
};

// App shell - only rendered inside /app
const AppShell: React.FC = () => {
  const { isConnected } = useAuth();
  const isDesktop = useIsDesktop();
  const location = useLocation();
  const navigate = useNavigate();

  const hasSavedSession = !!localStorage.getItem('btcfixed_wallet_v1');
  const [showSplash, setShowSplash] = useState(!hasSavedSession);
  const [isPrivacyMode, setIsPrivacyMode] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [suggestedAmount, setSuggestedAmount] = useState<string | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const activeTab: TabType = pathToTab[location.pathname] ?? 'dashboard';

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!isConnected) {
    return <AuthScreen />;
  }

  const handleEarnYield = (amount: string) => {
    setSuggestedAmount(amount);
    navigate('/app/earn');
  };

  const renderPage = () => {
    switch (location.pathname) {
      case '/app/swap':    return <Bridge />;
      case '/app/earn':    return <Staking suggestedAmount={suggestedAmount} clearSuggestedAmount={() => setSuggestedAmount(null)} />;
      case '/app/vault':   return <Lending />;
      case '/app/identity': return <Verification />;
      case '/app/activity': return <ActivityHistory isPrivacyMode={isPrivacyMode} onBack={() => navigate('/app')} />;
      case '/community':   return <Community />;
      case '/docs':        return <Docs />;
      case '/about':       return <About />;
      default:             return (
        <Dashboard
          isPrivacyMode={isPrivacyMode}
          setIsPrivacyMode={setIsPrivacyMode}
          onEarnYield={handleEarnYield}
          onSeeAllActivity={() => navigate('/app/activity')}
        />
      );
    }
  };

  if (isDesktop) {
    return (
      <DesktopLayout
        isPrivacyMode={isPrivacyMode}
        setIsPrivacyMode={setIsPrivacyMode}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      >
        <div ref={mainRef} className="w-full max-w-4xl mx-auto animate-modern">
          {renderPage()}
        </div>
      </DesktopLayout>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#131313] text-black dark:text-on-background max-w-md mx-auto relative overflow-x-hidden transition-colors duration-300">
      <Header
        isPrivacyMode={isPrivacyMode}
        setIsPrivacyMode={setIsPrivacyMode}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        activeTab={activeTab}
      />
      <main ref={mainRef} className="flex-1 pb-24 pt-4 px-5 overflow-y-auto">
        {renderPage()}
      </main>
      <BottomNav />
    </div>
  );
};

// Root routes - landing, community, docs, about (no login required)
const RootRoutes: React.FC = () => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/community" element={<Community />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/about" element={<About />} />
      <Route path="/features" element={<Features />} />
      <Route path="/app/*" element={<AppShell />} />
    </Routes>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <PrivyLogoutBridge />
      <RootRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
