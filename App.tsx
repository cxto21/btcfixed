import React, { useState, useEffect, useRef } from 'react';
import SplashScreen from './components/SplashScreen';
import AuthScreen from './components/AuthScreen';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Bridge from './components/Bridge';
import Staking from './components/Staking';
import Lending from './components/Lending';
import Verification from './components/Verification';
import ActivityHistory from './components/ActivityHistory';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import type { TabType } from './types';

// Inner shell – rendered only when wallet is connected
const AppShell: React.FC = () => {
  const { isConnected } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isPrivacyMode, setIsPrivacyMode] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [suggestedAmount, setSuggestedAmount] = useState<string | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  // Scroll to top on tab switch
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [activeTab]);

  // Apply dark mode class to <html>
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
    setActiveTab('staking');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            isPrivacyMode={isPrivacyMode}
            onEarnYield={handleEarnYield}
            onSeeAllActivity={() => setActiveTab('activity')}
          />
        );
      case 'bridge':
        return <Bridge />;
      case 'staking':
        return (
          <Staking
            suggestedAmount={suggestedAmount}
            clearSuggestedAmount={() => setSuggestedAmount(null)}
          />
        );
      case 'lending':
        return <Lending />;
      case 'verify':
        return <Verification />;
      case 'activity':
        return (
          <ActivityHistory
            isPrivacyMode={isPrivacyMode}
            onBack={() => setActiveTab('dashboard')}
          />
        );
      default:
        return (
          <Dashboard
            isPrivacyMode={isPrivacyMode}
            onEarnYield={handleEarnYield}
            onSeeAllActivity={() => setActiveTab('activity')}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#111] text-black dark:text-white max-w-md mx-auto relative overflow-x-hidden transition-colors duration-300">
      <Header
        isPrivacyMode={isPrivacyMode}
        setIsPrivacyMode={setIsPrivacyMode}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        activeTab={activeTab}
      />

      <main ref={mainRef} className="flex-1 pb-24 pt-4 px-5 overflow-y-auto">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

// Root – wraps everything in AuthProvider
const App: React.FC = () => (
  <AuthProvider>
    <AppShell />
  </AuthProvider>
);

export default App;