
import React, { useState, useEffect } from 'react';
import { SEASONAL_DATA } from '../constants';
import { SeasonalRule } from '../types';

const SeasonalAdvisory: React.FC = () => {
  const [activeSeasonName, setActiveSeasonName] = useState<string>('Summer');

  useEffect(() => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 5) setActiveSeasonName('Summer');
    else if (month >= 6 && month <= 8) setActiveSeasonName('Monsoon');
    else setActiveSeasonName('Winter');
  }, []);

  const activeSeason = SEASONAL_DATA[activeSeasonName];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Ayurvedic Seasonal Guide</h2>
          <p className="text-slate-500 mt-2">Adjust your lifestyle and diet according to the current Ritu (Season).</p>
        </div>
        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex gap-2">
           {Object.keys(SEASONAL_DATA).map(name => (
             <button
              key={name}
              onClick={() => setActiveSeasonName(name)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeSeasonName === name 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50'
              }`}
             >
              {SEASONAL_DATA[name].icon} {name}
             </button>
           ))}
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col md:flex-row">
          <div className="md:w-1/3 bg-emerald-600 p-8 flex flex-col items-center justify-center text-white text-center">
            <span className="text-7xl mb-4">{activeSeason.icon}</span>
            <h3 className="text-2xl font-bold">{activeSeasonName}</h3>
            <div className="mt-6 px-4 py-2 bg-emerald-500/50 rounded-full border border-emerald-400/30">
              <span className="text-sm font-bold uppercase tracking-wider">Dominant: {activeSeason.dosha}</span>
            </div>
          </div>
          
          <div className="md:w-2/3 p-8 space-y-8">
             <section>
                <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Recommended for You</h4>
                <div className="flex flex-wrap gap-2">
                  {activeSeason.recommendations.map(r => (
                    <span key={r} className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100 text-sm font-bold flex items-center gap-2">
                      ✨ {r}
                    </span>
                  ))}
                </div>
             </section>

             <section>
                <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Proactive Tips</h4>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 text-sm leading-relaxed font-medium">
                  {activeSeason.warning}
                </div>
             </section>
          </div>
        </div>

        <div className="bg-rose-50/50 rounded-3xl p-8 border border-rose-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 text-lg">⚠️</div>
            <h4 className="text-rose-900 font-bold">Avoid Property: {activeSeason.avoid_properties.join(', ')}</h4>
          </div>
          <p className="text-sm text-rose-800/80 mb-6 leading-relaxed">
            Consuming items with these properties during {activeSeasonName} can aggravate the {activeSeason.dosha} dosha, leading to digestive issues and low immunity.
          </p>
          <div className="mt-auto pt-6 border-t border-rose-100">
             <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Traditional Wisdom</p>
             <p className="text-rose-900 font-bold mt-1">"Ritucharya balances internal nature with external shifts."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalAdvisory;
