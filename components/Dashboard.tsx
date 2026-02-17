
import React from 'react';
import { HERBS, MEDICINES, SEASONAL_DATA } from '../constants';
import { User } from '../types';

const Dashboard: React.FC<{ onNavigate: (tab: string) => void, user: User }> = ({ onNavigate, user }) => {
  const currentSeason = SEASONAL_DATA["Summer"]; // Simplified for UI

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Welcome, {user.name.split(' ')[0]}</h2>
          <p className="text-slate-500 mt-2 text-lg">Your integrated Ayurvedic safety dashboard is ready.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => onNavigate('checker')}
            className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
          >
            <span>⚡</span> Start Safety Audit
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Active Herbals', value: HERBS.length, color: 'bg-emerald-500', icon: '🌿' },
          { label: 'High-Risk Tags', value: MEDICINES.reduce((acc, m) => acc + m.tags.length, 0), color: 'bg-rose-500', icon: '🚩' },
          { label: 'Your Dosha', value: user.dosha, color: 'bg-amber-500', icon: '👤' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-emerald-200 transition-colors">
             <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-inner group-hover:scale-110 transition-transform`}>
               {stat.icon}
             </div>
             <div>
               <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
               <p className="text-slate-900 text-xl font-bold">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Ayur-Shield Hub</h3>
          <div className="space-y-4">
             <button 
              onClick={() => onNavigate('advisory')}
              className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-emerald-50 rounded-2xl transition-all border border-transparent hover:border-emerald-100 group"
             >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-slate-100">🌦️</div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800">Seasonal Advisory</p>
                    <p className="text-sm text-slate-500">Current: {currentSeason.dosha} Balancing</p>
                  </div>
                </div>
                <span className="text-slate-300 group-hover:text-emerald-500 transition-colors">→</span>
             </button>

             <button 
              onClick={() => onNavigate('explorer')}
              className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-emerald-50 rounded-2xl transition-all border border-transparent hover:border-emerald-100 group"
             >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-slate-100">🌿</div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800">Herb Materia Medica</p>
                    <p className="text-sm text-slate-500">Profiles, properties & sanskrit names.</p>
                  </div>
                </div>
                <span className="text-slate-300 group-hover:text-emerald-500 transition-colors">→</span>
             </button>
          </div>
        </div>

        <div className="bg-emerald-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-end">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <span className="text-[12rem] font-bold">🛡️</span>
          </div>
          <div className="relative z-10">
             <span className="inline-block px-3 py-1 bg-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border border-emerald-700">Safety Insight</span>
             <h3 className="text-3xl font-bold mb-4">Summer Protocol</h3>
             <p className="text-emerald-200 text-lg leading-relaxed mb-8">
               {currentSeason.warning} Balance your internal heat with {currentSeason.recommendations[0]} and {currentSeason.recommendations[1]}.
             </p>
             <button 
              onClick={() => onNavigate('advisory')}
              className="bg-white text-emerald-900 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors"
             >
               View Full Advisory
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
