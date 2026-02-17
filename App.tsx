
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InteractionChecker from './components/InteractionChecker';
import SeasonalAdvisory from './components/SeasonalAdvisory';
import HerbExplorer from './components/HerbExplorer';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import FoodAnalyzer from './components/FoodAnalyzer';
import { User } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} user={user} />;
      case 'checker':
        return <InteractionChecker />;
      case 'food':
        return <FoodAnalyzer user={user} />;
      case 'advisory':
        return <SeasonalAdvisory />;
      case 'explorer':
        return <HerbExplorer />;
      case 'profile':
        return <UserProfile user={user} onLogout={handleLogout} />;
      default:
        return <Dashboard onNavigate={setActiveTab} user={user} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user}>
      {renderContent()}
    </Layout>
  );
};

export default App;
