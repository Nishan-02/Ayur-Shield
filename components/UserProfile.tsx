
import React from 'react';
import { User } from '../types';

interface UserProfileProps {
  user: User;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Health Profile</h2>
          <p className="text-slate-500 mt-1">Manage your personalized Ayurvedic clinical data.</p>
        </div>
        <button 
          onClick={onLogout}
          className="bg-rose-50 text-rose-600 px-6 py-2 rounded-xl font-bold border border-rose-100 hover:bg-rose-100 transition-colors"
        >
          Logout Session
        </button>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* User Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full mb-4 border-4 border-white shadow-md overflow-hidden">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{user.name}</h3>
          <p className="text-slate-400 text-sm">{user.email}</p>
          
          <div className="mt-6 w-full p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Primary Dosha</span>
            <p className="text-lg font-bold text-emerald-900 mt-1">{user.dosha}</p>
          </div>
        </div>

        {/* Clinical Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Current Medications</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {user.medications.map((med, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-200 transition-all">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">💊</div>
                  <span className="font-bold text-slate-700">{med}</span>
                </div>
              ))}
              <button className="flex items-center gap-4 p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-500 hover:border-emerald-200 transition-all text-sm font-bold">
                <span className="w-10 h-10 flex items-center justify-center">+</span>
                Add Medication
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Recent Interaction Reports</h4>
            <div className="space-y-3">
              {[
                { label: 'Ginger + Warfarin', date: 'Oct 12, 2023', status: 'Conflict' },
                { label: 'Tulsi + Amlodipine', date: 'Oct 08, 2023', status: 'Safe' }
              ].map((report, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <span className="text-lg">📄</span>
                    <div>
                      <p className="font-bold text-slate-800">{report.label}</p>
                      <p className="text-xs text-slate-400">{report.date}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${report.status === 'Safe' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
