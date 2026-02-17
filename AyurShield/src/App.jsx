import React, { useState, useEffect } from 'react';
import {
  Sun, Moon, Activity, User, Heart, Clock, ArrowLeft, Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Components
import Dashboard from './components/Dashboard';
import SafetyScanner from './components/SafetyScanner';
import DoshaTest from './components/DoshaTest';
import SeasonalCharya from './components/SeasonalCharya';
import FoodCompatibility from './components/FoodCompatibility';
import AyurBot from './components/AyurBot';
import Auth from './components/Auth';
import Assessment from './components/Assessment';
import BackgroundLayout from './components/BackgroundLayout';
import Navbar from './components/Navbar';

// --- Utility for Tailwind classes ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function App() {
  // --- Global State ---
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const [user, setUser] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Matra (Body/Time) State
  const [heartRate, setHeartRate] = useState(75);
  const [timeSlot, setTimeSlot] = useState('10-2'); // 2-6, 6-10, 10-2
  const [dosha, setDosha] = useState('Pitta');

  // --- Effects ---

  // Calculate Dosha based on Time & Heart Rate
  useEffect(() => {
    let newDosha = '';
    // simplified logic
    if (timeSlot === '2-6') {
      newDosha = heartRate > 80 ? 'Vata' : 'Vata-Pitta';
    } else if (timeSlot === '6-10') {
      newDosha = (heartRate >= 70 && heartRate <= 80) ? 'Pitta' : (heartRate > 80 ? 'Pitta-Vata' : 'Pitta-Kapha');
    } else { // 10-2
      newDosha = heartRate < 70 ? 'Kapha' : 'Kapha-Pitta';
    }
    setDosha(newDosha);
  }, [heartRate, timeSlot]);

  if (!isAuthenticated) {
    return (
      <BackgroundLayout theme={theme}>
        <Auth
          onLogin={(userData) => {
            setIsAuthenticated(true);
            setUser(userData || { name: 'Seeker' });
          }}
        />
      </BackgroundLayout>
    );
  }

  return (
    <BackgroundLayout theme={theme}>
      <div className="min-h-screen relative font-sans selection:bg-emerald-500/30">

        {/* --- Top Navigation Bar --- */}
        <Navbar activeTab={activeTab} onNavigate={setActiveTab} />

        {/* --- Section A: Context Bar (Secondary Info) --- */}
        <header className="mx-4 mt-4 mb-2 px-6 py-3 bg-white/40 dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-stone-800 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 transition-colors duration-500">

          {/* Left: Weather / Time */}
          <div className="flex items-center gap-4">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-stone-200 dark:bg-stone-800 text-amber-600 dark:text-amber-400 transition-all hover:scale-110"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <span className="font-semibold hidden sm:inline">Mangaluru, 34°C</span>
            </div>
            <div className="h-6 w-px bg-stone-700 hidden md:block"></div>

            {/* Time Selector for Demo */}
            <div className="flex items-center gap-2 bg-white/50 dark:bg-stone-900/50 px-3 py-1 rounded-lg border border-stone-200 dark:border-stone-800">
              <Clock className="w-4 h-4 text-stone-500 dark:text-stone-400" />
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="bg-transparent border-none text-sm focus:ring-0 text-stone-600 dark:text-stone-300 cursor-pointer outline-none"
              >
                <option value="2-6">Vata Time (2-6)</option>
                <option value="6-10">Pitta Time (6-10)</option>
                <option value="10-2">Kapha Time (10-2)</option>
              </select>
            </div>
          </div>

          {/* Right: Body Sensor (Matra) */}
          <div className="flex items-center gap-6 w-full md:w-auto justify-end">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400 font-mono">
                <Heart className="w-4 h-4 animate-pulse" />
                <span>{heartRate} BPM</span>
              </div>
              <input
                type="range"
                min="60" max="100"
                value={heartRate}
                onChange={(e) => setHeartRate(parseInt(e.target.value))}
                className="w-24 md:w-32 h-1 bg-stone-300 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div className={cn(
              "px-4 py-2 rounded-xl border flex items-center gap-2 transition-all duration-500",
              dosha.includes('Pitta') ? "bg-orange-100 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-400" :
                dosha.includes('Vata') ? "bg-blue-100 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400" :
                  "bg-green-100 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400"
            )}>
              <Activity className="w-5 h-5" />
              <span className="font-bold tracking-wide uppercase text-sm md:text-base">{dosha}</span>
            </div>
          </div>
        </header>

        {/* --- Main Content Area --- */}
        <main className="max-w-6xl mx-auto px-4 py-8 pb-32">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Dashboard onNavigate={setActiveTab} user={user} />
              </motion.div>
            )}
            {activeTab === 'assessment' && (
              <motion.div key="assessment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Assessment onComplete={(data) => {
                  setAssessmentData(data);
                  setDosha(data.dosha); // Auto-update global dosha
                  setActiveTab('dashboard');
                }} />
              </motion.div>
            )}
            {activeTab === 'scanner' && (
              <motion.div key="scanner" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <SafetyScanner dosha={dosha} />
              </motion.div>
            )}
            {activeTab === 'dosha' && (
              <motion.div key="dosha" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <DoshaTest onComplete={(result) => console.log("Dosha Result:", result)} />
              </motion.div>
            )}
            {activeTab === 'seasonal' && (
              <motion.div key="seasonal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <SeasonalCharya />
              </motion.div>
            )}
            {activeTab === 'food' && (
              <motion.div key="food" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <FoodCompatibility />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* --- AyurBot (Globals) --- */}
        <AyurBot user={user} assessment={assessmentData} />

      </div>
    </BackgroundLayout>
  );
}
