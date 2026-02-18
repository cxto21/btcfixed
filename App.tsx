
import React, { useState } from 'react';
import AuthScreen from './components/AuthScreen';
import SplashScreen from './components/SplashScreen';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Bridge from './components/Bridge';
import Staking from './components/Staking';
import Lending from './components/Lending';
import Verification from './components/Verification';
import { TabType } from './types';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!isAuthenticated) {
    return <AuthScreen onAuth={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard isPrivacyMode={isPrivacyMode} />;
      case 'bridge': return <Bridge />;
      case 'staking': return <Staking />;
      case 'lending': return <Lending />;
      case 'verify': return <Verification />;
      default: return <Dashboard isPrivacyMode={isPrivacyMode} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black max-w-md mx-auto relative overflow-x-hidden">
      <Header 
        isPrivacyMode={isPrivacyMode} 
        setIsPrivacyMode={setIsPrivacyMode} 
        activeTab={activeTab}
      />

      <main className="flex-1 pb-24 pt-6 px-5 overflow-y-auto">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
