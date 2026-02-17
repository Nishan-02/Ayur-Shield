import React, { useMemo } from 'react';
import { Sun, CloudRain, Snowflake, Wind, Flower2 } from 'lucide-react';

const SEASONS_DATA = {
    Winter: {
        name: 'Shishira / Hemanta',
        dosha: 'Start of Kapha',
        icon: Snowflake,
        desc: 'Cold, dewy season. Agni (digestive fire) is strong.',
        routine: [
            'Eat warm, heavy, oily foods (Ghee, Nuts).',
            'Daily oil massage (Abhyanga).',
            'Exercise vigorously (Surya Namaskar).',
            'Avoid cold drinks and light fasting.'
        ],
        color: 'text-blue-200',
        bg: 'from-blue-900/40 to-cyan-900/10'
    },
    Spring: {
        name: 'Vasanta',
        dosha: 'Kapha Aggravation',
        icon: Flower2,
        desc: 'Warmth returns. Accumulated Kapha liquefies.',
        routine: [
            'Eat light, dry, bitter/pungent foods.',
            'Honey water in the morning.',
            'Dry massage (Udvartana).',
            'Avoid day sleep and heavy dairy.'
        ],
        color: 'text-pink-200',
        bg: 'from-pink-900/40 to-rose-900/10'
    },
    Summer: {
        name: 'Greeshma',
        dosha: 'Pitta Accumulation',
        icon: Sun,
        desc: 'Intense heat. Energy is low.',
        routine: [
            'Eat sweet, cold, liquid foods (Fruits, Milk).',
            'Stay hydrated (Coconut water).',
            'Avoid spicy, sour, salty foods.',
            'Moon bathing and light clothes.'
        ],
        color: 'text-orange-200',
        bg: 'from-orange-900/40 to-amber-900/10'
    },
    Monsoon: {
        name: 'Varsha',
        dosha: 'Vata Aggravation',
        icon: CloudRain,
        desc: 'Humid and wet. Digestion is weak.',
        routine: [
            'Eat sour, salty, and oily foods moderately.',
            'Drink boiled water.',
            'Avoid leafy greens and humidity.',
            'Foot care is essential.'
        ],
        color: 'text-indigo-200',
        bg: 'from-indigo-900/40 to-blue-900/10'
    },
    Autumn: {
        name: 'Sharad',
        dosha: 'Pitta Aggravation',
        icon: Wind,
        desc: 'Sky is clear, sun is hot.',
        routine: [
            'Bitter, sweet, astringent foods.',
            'Ghee and rice are beneficial.',
            'Blood letting (Raktamokshana) is traditional.',
            'Avoid day sleep and fat.'
        ],
        color: 'text-yellow-200',
        bg: 'from-yellow-900/40 to-orange-900/10'
    }
};

export default function SeasonalCharya() {
    const currentMonth = new Date().getMonth(); // 0-11

    const currentSeason = useMemo(() => {
        // Simple logic for Northern Hemisphere/India
        if (currentMonth === 11 || currentMonth === 0 || currentMonth === 1) return 'Winter'; // Dec-Feb
        if (currentMonth === 2 || currentMonth === 3) return 'Spring'; // Mar-Apr
        if (currentMonth === 4 || currentMonth === 5) return 'Summer'; // May-Jun
        if (currentMonth === 6 || currentMonth === 7 || currentMonth === 8) return 'Monsoon'; // Jul-Sep
        return 'Autumn'; // Oct-Nov
    }, [currentMonth]);

    const data = SEASONS_DATA[currentSeason];
    const Icon = data.icon;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-blue-400">
                    Seasonal Regimen (Ritucharya)
                </h2>
                <p className="text-stone-400">Align your habits with the rhythm of nature.</p>
            </div>

            <div className={`p-8 rounded-3xl bg-gradient-to-br ${data.bg} border border-white/5 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Icon className="w-64 h-64" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                    <div className={`p-4 rounded-2xl bg-black/20 backdrop-blur-sm ${data.color}`}>
                        <Icon className="w-12 h-12" />
                    </div>

                    <div className="space-y-6 flex-1">
                        <div>
                            <h3 className={`text-4xl font-black ${data.color} mb-2`}>{currentSeason} Season</h3>
                            <p className="text-xl text-stone-300 font-serif italic">{data.name}</p>
                            <p className="text-sm text-stone-400 mt-2 uppercase tracking-wide font-bold">{data.dosha}</p>
                        </div>

                        <p className="text-stone-300 text-lg">{data.desc}</p>

                        <div className="bg-black/20 rounded-2xl p-6">
                            <h4 className="text-stone-200 font-bold mb-4 flex items-center gap-2">
                                <Sun className="w-5 h-5 text-amber-400" /> Daily Recommendations
                            </h4>
                            <ul className="space-y-3">
                                {data.routine.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-stone-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
