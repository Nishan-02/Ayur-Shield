
import React, { useState, useEffect } from 'react';
import { analyzeFoodImage } from '../services/geminiService';
import { User } from '../types';

const FoodAnalyzer: React.FC<{ user: User }> = ({ user }) => {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [location, setLocation] = useState<string>("Detecting...");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation(`${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`),
        () => setLocation("Unknown Location")
      );
    }
  }, []);

  const getSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 5) return 'Summer';
    if (month >= 6 && month <= 8) return 'Monsoon';
    return 'Winter';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    const context = {
      season: getSeason(),
      time: new Date().toLocaleTimeString(),
      location: location,
      userDosha: user.dosha
    };
    const res = await analyzeFoodImage(image, mimeType, context);
    setAnalysis(res);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Food Integrity Scanner</h2>
        <p className="text-slate-500 mt-2">Upload a photo of your meal for a real-time Ayurvedic health audit.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl h-64 flex flex-col items-center justify-center overflow-hidden relative group">
            {image ? (
              <img src={`data:${mimeType};base64,${image}`} className="w-full h-full object-cover" alt="Food preview" />
            ) : (
              <div className="text-center p-6">
                <span className="text-5xl mb-4 block">📸</span>
                <p className="text-slate-400 font-medium">Click to upload meal photo</p>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Season</p>
              <p className="font-bold text-emerald-900">{getSeason()}</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Time</p>
              <p className="font-bold text-emerald-900">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>

          <button
            onClick={runAnalysis}
            disabled={!image || loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all"
          >
            {loading ? 'Analyzing Ingredients...' : 'Scan Meal Integrity'}
          </button>
        </div>

        <div className="space-y-6">
          {analysis ? (
            <div className="bg-white p-8 rounded-[2rem] border border-emerald-100 shadow-xl prose prose-slate">
              <h3 className="text-emerald-800 font-bold text-xl mb-4 flex items-center gap-2">
                <span>🛡️</span> Analysis Report
              </h3>
              <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {analysis}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 text-center">
              <span className="text-6xl mb-6">🥗</span>
              <p className="text-lg font-medium">Capture your meal to see how it aligns with your Dosha and the current environment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodAnalyzer;
