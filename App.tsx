import React, { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import SplashScreen from './components/SplashScreen';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Bridge from './components/Bridge';
import Staking from './components/Staking';
import Lending from './components/Lending';
import Verification from './components/Verification';
import ActivityHistory from './components/ActivityHistory';
import { TabType } from './types';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isPrivacyMode, setIsPrivacyMode] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [suggestedAmount, setSuggestedAmount] = useState<string | null>(null);
  const mainRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!isAuthenticated) {
    return <AuthScreen onAuth={() => setIsAuthenticated(true)} />;
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
        return <Staking suggestedAmount={suggestedAmount} clearSuggestedAmount={() => setSuggestedAmount(null)} />;
      case 'lending': 
        return <Lending />;
      case 'verify': 
        return <Verification />;
      case 'activity':
        return <ActivityHistory isPrivacyMode={isPrivacyMode} onBack={() => setActiveTab('dashboard')} />;
      default: 
        return <Dashboard isPrivacyMode={isPrivacyMode} onEarnYield={handleEarnYield} onSeeAllActivity={() => setActiveTab('activity')} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-black dark:text-white max-w-md mx-auto relative overflow-x-hidden transition-colors duration-300">
      <Header 
        isPrivacyMode={isPrivacyMode} 
        setIsPrivacyMode={setIsPrivacyMode}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        activeTab={activeTab}
      />

      <main ref={mainRef} className="flex-1 pb-24 pt-6 px-5 overflow-y-auto">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;