
import React, { useState } from 'react';
import { MEDICINES, HERBS } from '../constants';
import { InteractionStatus, InteractionResult } from '../types';
import { getAIInteractionAnalysis } from '../services/geminiService';

const InteractionChecker: React.FC = () => {
  const [selectedMedId, setSelectedMedId] = useState('');
  const [selectedHerbId, setSelectedHerbId] = useState('');
  const [result, setResult] = useState<InteractionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!selectedMedId || !selectedHerbId) return;

    setLoading(true);
    const medicine = MEDICINES.find(m => m.id === selectedMedId)!;
    const herb = HERBS.find(h => h.id === selectedHerbId)!;

    let status = InteractionStatus.SAFE;
    let message = "No known primary interaction found based on current database tags.";

    // Check tag-based conflicts
    const hasConflict = herb.conflicts_with_tags.some(tag => medicine.tags.includes(tag));

    if (hasConflict) {
      status = InteractionStatus.CONFLICT;
      message = herb.warning_msg;
    } else if (herb.conflicts_with_tags.length > 0) {
      // If there are specific caution rules not explicitly met by tags, but related
      status = InteractionStatus.CAUTION;
      message = "Exercise caution. While no direct tag match was found, this herb has recorded sensitivities.";
    }

    // Call AI for deeper context
    const aiAnalysis = await getAIInteractionAnalysis(medicine.name, herb.name, status);
    
    setResult({
      status,
      message,
      details: aiAnalysis
    });
    setLoading(false);
  };

  const getStatusColor = (status: InteractionStatus) => {
    switch (status) {
      case InteractionStatus.SAFE: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case InteractionStatus.CAUTION: return 'bg-amber-100 text-amber-800 border-amber-200';
      case InteractionStatus.CONFLICT: return 'bg-rose-100 text-rose-800 border-rose-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Drug-Herb Interaction Checker</h2>
        <p className="text-slate-500 mt-2">Verify compatibility using our clinical database and Gemini AI analysis.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Modern Medicine</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              value={selectedMedId}
              onChange={(e) => setSelectedMedId(e.target.value)}
            >
              <option value="">Select a medicine...</option>
              {MEDICINES.map(m => <option key={m.id} value={m.id}>{m.name} ({m.category})</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Ayurvedic Herb</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              value={selectedHerbId}
              onChange={(e) => setSelectedHerbId(e.target.value)}
            >
              <option value="">Select an Ayurvedic herb...</option>
              {HERBS.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>

          <button
            onClick={handleCheck}
            disabled={!selectedMedId || !selectedHerbId || loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-200"
          >
            {loading ? 'Consulting Gemini AI...' : 'Analyze Safety'}
          </button>
        </div>

        <div className="space-y-4">
          {result ? (
            <div className={`p-8 rounded-2xl border-2 transition-all ${getStatusColor(result.status)} shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold uppercase tracking-wider">{result.status}</span>
                <span className="text-2xl">{result.status === InteractionStatus.SAFE ? '✅' : result.status === InteractionStatus.CAUTION ? '⚠️' : '❌'}</span>
              </div>
              <p className="font-semibold text-lg mb-2 leading-tight">{result.message}</p>
              <div className="mt-6 pt-6 border-t border-black/10">
                <p className="text-[10px] font-bold uppercase mb-2 opacity-60 tracking-widest">Scientific Analysis (Gemini-3-Flash)</p>
                <p className="italic leading-relaxed text-sm">"{result.details}"</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
              <span className="text-4xl mb-4">🔬</span>
              <p className="text-center font-medium">Select a drug and herb combination to generate a clinical safety report.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
        <h4 className="font-bold text-emerald-800 flex items-center gap-2 mb-2">
          <span>🩺</span> Clinical Disclaimer
        </h4>
        <p className="text-emerald-700 text-xs leading-relaxed">
          This tool is for educational purposes only. Interactions can vary based on dosage, individual physiology, and existing conditions. Always consult your primary physician or a certified Ayurvedic practitioner before combining treatments.
        </p>
      </div>
    </div>
  );
};

export default InteractionChecker;
