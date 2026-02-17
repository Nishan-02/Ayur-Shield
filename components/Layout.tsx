
import React from 'react';
import { User } from '../types';
import AyurBot from './AyurBot';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user?: User | null;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'checker', label: 'Interaction Checker', icon: '🛡️' },
    { id: 'food', label: 'Food Analysis', icon: '🥗' },
    { id: 'advisory', label: 'Seasonal Advisory', icon: '🌿' },
    { id: 'explorer', label: 'Herb Explorer', icon: '🔍' },
    { id: 'profile', label: 'My Health Profile', icon: '👤' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-ayur-cream">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-ayur-white border-r border-ayur-sage p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-ayur-primary rounded-xl flex items-center justify-center text-ayur-white text-xl">
            🛡️
          </div>
          <h1 className="text-xl font-bold text-ayur-charcoal tracking-tight">Ayur-Shield</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id
                  ? 'bg-ayur-sage text-ayur-primary-dark font-semibold'
                  : 'text-ayur-charcoal hover:bg-ayur-cream'
                }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {user && (
          <div
            className={`mt-auto p-4 rounded-2xl border transition-all cursor-pointer ${activeTab === 'profile' ? 'bg-ayur-sage border-ayur-primary' : 'bg-ayur-cream border-ayur-sage hover:bg-ayur-sage'
              }`}
            onClick={() => setActiveTab('profile')}
          >
            <div className="flex items-center gap-3">
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl bg-ayur-white p-1" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-ayur-charcoal truncate">{user.name}</p>
                <p className="text-[10px] text-ayur-primary font-bold uppercase tracking-widest">{user.dosha}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Nav */}
      <div className="md:hidden bg-ayur-white border-b border-ayur-sage p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ayur-primary rounded-lg flex items-center justify-center text-ayur-white text-sm">
              🛡️
            </div>
            <h1 className="text-lg font-bold text-ayur-charcoal">Ayur-Shield</h1>
          </div>
          <div className="flex gap-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xl ${activeTab === tab.id ? 'opacity-100' : 'opacity-40'}`}
              >
                {tab.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Floating AyurBot */}
      <AyurBot user={user || undefined} />
    </div>
  );
};

export default Layout;
