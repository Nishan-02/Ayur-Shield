
import React, { useState, useRef, useEffect } from 'react';
import { getAyurBotResponse } from '../services/geminiService';
import { performHolisticAnalysis, HolisticAnalysisInput, HolisticAnalysisResult } from '../services/holisticAnalysisService';
import { User } from '../types';

interface AyurBotProps {
  user?: User;
}

const AyurBot: React.FC<AyurBotProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string; isAnalysis?: boolean; analysisData?: HolisticAnalysisResult }[]>([
    { role: 'bot', content: 'Namaste! I am AyurBot. How can I guide your wellness journey today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnalysisMode, setShowAnalysisMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Analysis form state
  const [analysisInput, setAnalysisInput] = useState({
    location: '',
    weather: '',
    season: 'Spring',
    medicineIntake: '',
    foodIntake: '',
    symptoms: '',
    activities: ''
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const history = messages.map(m => ({
      role: m.role === 'bot' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const botMsg = await getAyurBotResponse(history, userMsg);
    setMessages(prev => [...prev, { role: 'bot', content: botMsg || "I couldn't process that. Try again?" }]);
    setLoading(false);
  };

  const handleHolisticAnalysis = async () => {
    if (!user) {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: 'Please log in to access holistic analysis features.'
      }]);
      return;
    }

    setLoading(true);
    setMessages(prev => [...prev, {
      role: 'user',
      content: '🔍 Requesting comprehensive holistic analysis...'
    }]);

    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const input: HolisticAnalysisInput = {
      user,
      location: analysisInput.location || 'Not specified',
      weather: analysisInput.weather || 'Not specified',
      season: analysisInput.season,
      currentTime,
      medicineIntake: analysisInput.medicineIntake ? analysisInput.medicineIntake.split(',').map(m => m.trim()) : [],
      foodIntake: analysisInput.foodIntake ? { description: analysisInput.foodIntake } : undefined,
      symptoms: analysisInput.symptoms ? analysisInput.symptoms.split(',').map(s => s.trim()) : undefined,
      activities: analysisInput.activities ? analysisInput.activities.split(',').map(a => a.trim()) : undefined
    };

    try {
      const result = await performHolisticAnalysis(input);

      setMessages(prev => [...prev, {
        role: 'bot',
        content: '✅ Holistic Analysis Complete',
        isAnalysis: true,
        analysisData: result
      }]);

      setShowAnalysisMode(false);
      // Reset form
      setAnalysisInput({
        location: '',
        weather: '',
        season: 'Spring',
        medicineIntake: '',
        foodIntake: '',
        symptoms: '',
        activities: ''
      });
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: 'Sorry, I encountered an error during analysis. Please try again.'
      }]);
    }

    setLoading(false);
  };

  const renderAnalysisResult = (data: HolisticAnalysisResult) => {
    return (
      <div className="space-y-3 text-xs">
        {/* Overall Score */}
        <div className="bg-ayur-sage p-3 rounded-xl border border-ayur-primary">
          <div className="flex items-center justify-between">
            <span className="font-bold text-ayur-primary-dark">Overall Health Score</span>
            <span className="text-2xl font-bold text-ayur-primary">{data.overallScore}/10</span>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-ayur-sage/50 p-3 rounded-xl border border-ayur-primary/30">
          <p className="text-ayur-primary-dark font-semibold mb-1">📋 Summary</p>
          <p className="text-ayur-charcoal text-xs leading-relaxed">{data.summary}</p>
        </div>

        {/* Body Analysis */}
        <div className="bg-ayur-sage/40 p-3 rounded-xl border border-ayur-primary/40">
          <p className="text-ayur-primary-dark font-semibold mb-2">🧘 Body Analysis</p>
          <p className="text-ayur-charcoal mb-1"><strong>Dosha Balance:</strong> {data.bodyAnalysis.doshaBalance}</p>
          <p className="text-ayur-charcoal mb-2"><strong>Current State:</strong> {data.bodyAnalysis.currentState}</p>
          <ul className="list-disc list-inside text-ayur-primary-dark space-y-1">
            {data.bodyAnalysis.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>

        {/* Weather/Place Analysis */}
        <div className="bg-ayur-accent/10 p-3 rounded-xl border border-ayur-accent/40">
          <p className="text-ayur-accent font-semibold mb-2">🌤️ Weather & Location</p>
          <p className="text-ayur-charcoal mb-2"><strong>Seasonal Impact:</strong> {data.weatherPlaceAnalysis.seasonalImpact}</p>
          <p className="text-ayur-charcoal mb-1"><strong>Advisory:</strong> {data.weatherPlaceAnalysis.weatherAdvisory}</p>
          <ul className="list-disc list-inside text-ayur-accent space-y-1">
            {data.weatherPlaceAnalysis.locationRecommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>

        {/* Food Analysis */}
        <div className="bg-ayur-accent/15 p-3 rounded-xl border border-ayur-accent/50">
          <p className="text-ayur-accent font-semibold mb-2">🍽️ Food Analysis</p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-ayur-charcoal"><strong>Timing Score:</strong></span>
            <span className="font-bold text-ayur-accent">{data.foodAnalysis.timingScore}/10</span>
          </div>
          <p className="text-ayur-charcoal mb-2">{data.foodAnalysis.suitability}</p>
          {data.foodAnalysis.modifications.length > 0 && (
            <div>
              <p className="text-ayur-charcoal font-semibold mb-1">Suggested Modifications:</p>
              <ul className="list-disc list-inside text-ayur-accent space-y-1">
                {data.foodAnalysis.modifications.map((mod, i) => (
                  <li key={i}>{mod}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Medicine Analysis */}
        <div className="bg-ayur-accent/10 p-3 rounded-xl border border-ayur-accent/40">
          <p className="text-ayur-accent font-semibold mb-2">💊 Medicine Analysis</p>
          <p className="text-ayur-charcoal mb-2">{data.medicineAnalysis.overallSafety}</p>
          {data.medicineAnalysis.interactions.length > 0 && (
            <div className="space-y-2">
              {data.medicineAnalysis.interactions.map((interaction, i) => (
                <div key={i} className={`p-2 rounded-lg ${interaction.status === 'Safe' ? 'bg-ayur-sage' :
                  interaction.status === 'Caution' ? 'bg-ayur-accent/20' : 'bg-ayur-accent/30'
                  }`}>
                  <p className="font-bold">{interaction.medicine}</p>
                  <p className="text-xs">{interaction.warning}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Holistic Recommendations */}
        <div className="bg-ayur-sage/60 p-3 rounded-xl border border-ayur-primary">
          <p className="text-ayur-primary-dark font-semibold mb-2">🌿 Holistic Recommendations</p>
          <ul className="list-disc list-inside text-ayur-primary-dark space-y-1">
            {data.holisticRecommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      {isOpen ? (
        <div className="bg-ayur-white w-80 md:w-[450px] h-[600px] rounded-3xl shadow-2xl border border-ayur-sage flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          <header className="bg-gradient-to-r from-ayur-primary to-ayur-primary-dark p-4 text-ayur-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">✨</div>
              <div>
                <h3 className="font-bold">AyurBot Assistant</h3>
                <p className="text-xs text-white/80">Holistic Health Analysis</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded">✕</button>
          </header>

          {/* Mode Toggle */}
          <div className="bg-ayur-cream p-2 border-b border-ayur-sage flex gap-2">
            <button
              onClick={() => setShowAnalysisMode(false)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${!showAnalysisMode
                ? 'bg-ayur-primary text-ayur-white shadow-sm'
                : 'bg-ayur-white text-ayur-charcoal hover:bg-ayur-sage'
                }`}
            >
              💬 Chat Mode
            </button>
            <button
              onClick={() => setShowAnalysisMode(true)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${showAnalysisMode
                ? 'bg-ayur-primary text-ayur-white shadow-sm'
                : 'bg-ayur-white text-ayur-charcoal hover:bg-ayur-sage'
                }`}
            >
              🔍 Analysis Mode
            </button>
          </div>

          {showAnalysisMode ? (
            // Analysis Mode UI
            <div className="flex-1 overflow-y-auto p-4 bg-ayur-cream">
              <h4 className="font-bold text-ayur-charcoal mb-3 text-sm">Complete Health Analysis</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-ayur-primary-dark mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Mumbai, India"
                    className="w-full bg-ayur-white border border-ayur-sage rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                    value={analysisInput.location}
                    onChange={(e) => setAnalysisInput({ ...analysisInput, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ayur-primary-dark mb-1">Current Weather</label>
                  <input
                    type="text"
                    placeholder="e.g., Hot and humid"
                    className="w-full bg-ayur-white border border-ayur-sage rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                    value={analysisInput.weather}
                    onChange={(e) => setAnalysisInput({ ...analysisInput, weather: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ayur-primary-dark mb-1">Season</label>
                  <select
                    className="w-full bg-ayur-white border border-ayur-sage rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                    value={analysisInput.season}
                    onChange={(e) => setAnalysisInput({ ...analysisInput, season: e.target.value })}
                  >
                    <option>Spring</option>
                    <option>Summer</option>
                    <option>Monsoon</option>
                    <option>Autumn</option>
                    <option>Winter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ayur-primary-dark mb-1">Medicines Taken Today</label>
                  <input
                    type="text"
                    placeholder="e.g., Aspirin, Vitamin D (comma separated)"
                    className="w-full bg-ayur-white border border-ayur-sage rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                    value={analysisInput.medicineIntake}
                    onChange={(e) => setAnalysisInput({ ...analysisInput, medicineIntake: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ayur-primary-dark mb-1">Food Consumed Today</label>
                  <textarea
                    placeholder="e.g., Rice, dal, vegetables, tea"
                    className="w-full bg-ayur-white border border-ayur-sage rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                    rows={2}
                    value={analysisInput.foodIntake}
                    onChange={(e) => setAnalysisInput({ ...analysisInput, foodIntake: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ayur-primary-dark mb-1">Symptoms (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Headache, fatigue (comma separated)"
                    className="w-full bg-ayur-white border border-ayur-sage rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                    value={analysisInput.symptoms}
                    onChange={(e) => setAnalysisInput({ ...analysisInput, symptoms: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ayur-primary-dark mb-1">Activities (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Yoga, walking (comma separated)"
                    className="w-full bg-ayur-white border border-ayur-sage rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                    value={analysisInput.activities}
                    onChange={(e) => setAnalysisInput({ ...analysisInput, activities: e.target.value })}
                  />
                </div>

                <button
                  onClick={handleHolisticAnalysis}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-ayur-primary to-ayur-primary-dark text-ayur-white py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : '🔍 Perform Complete Analysis'}
                </button>
              </div>
            </div>
          ) : (
            // Chat Mode UI
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-ayur-cream">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user'
                      ? 'bg-ayur-primary text-ayur-white rounded-tr-none'
                      : 'bg-ayur-white text-ayur-charcoal shadow-sm rounded-tl-none border border-ayur-sage'
                      }`}>
                      {m.isAnalysis && m.analysisData ? renderAnalysisResult(m.analysisData) : m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-ayur-white p-3 rounded-2xl shadow-sm border border-ayur-sage flex gap-1 italic text-ayur-primary text-xs">
                      Thinking...
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-ayur-white border-t border-ayur-sage flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about herbs, lifestyle..."
                  className="flex-1 bg-ayur-cream border border-ayur-sage rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                  onClick={handleSend}
                  className="bg-ayur-primary text-ayur-white p-2 rounded-xl hover:bg-ayur-primary-dark transition-colors"
                >
                  ➔
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-br from-ayur-primary to-ayur-primary-dark text-ayur-white rounded-full shadow-xl shadow-ayur-sage flex items-center justify-center text-3xl hover:scale-110 transition-transform animate-bounce"
        >
          ✨
        </button>
      )}
    </div>
  );
};

export default AyurBot;
