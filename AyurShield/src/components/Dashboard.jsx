import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Activity, Sun, Utensils, Heart } from 'lucide-react';

export default function Dashboard({ onNavigate, user }) {
    const features = [
        {
            id: 'assessment', // Special ID
            title: 'Health Assessment',
            desc: 'Start your personalized diagnosis.',
            icon: Activity,
            color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:border-emerald-500/70',
            action: true
        },
        {
            id: 'scanner',
            title: 'Safety Scanner',
            desc: 'Check drug-herb interactions & safety.',
            icon: Activity,
            color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/50'
        },
        {
            id: 'dosha',
            title: 'Dosha Test',
            desc: 'Discover your body type (Prakriti).',
            icon: Heart,
            color: 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:border-orange-500/50'
        },
        {
            id: 'seasonal',
            title: 'Seasonal Guide',
            desc: 'Daily routine based on the season.',
            icon: Sun,
            color: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:border-blue-500/50'
        },
        {
            id: 'food',
            title: 'Food Checker',
            desc: 'Identify toxic food combinations.',
            icon: Utensils,
            color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:border-yellow-500/50'
        }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-fade-in-up">
            {/* Hero / Profile Section */}
            <div className="text-center space-y-6 py-10 relative">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-block p-1 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 mb-2"
                >
                    <div className="p-4 rounded-full bg-stone-900/50 backdrop-blur-sm">
                        <Leaf className="w-12 h-12 text-emerald-400" />
                    </div>
                </motion.div>

                <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-200 to-emerald-100 tracking-tight">
                    Welcome, {user?.name || 'Seeker'} 🌿
                </h1>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                {features.map((feature) => (
                    <button
                        key={feature.id}
                        onClick={() => onNavigate(feature.id)}
                        className={`p-8 rounded-3xl border text-left transition-all duration-300 hover:scale-[1.02] active:scale-95 group ${feature.color} ${feature.action ? 'border-2 shadow-lg shadow-emerald-900/20' : ''}`}
                    >
                        <div className={`mb-6 p-4 rounded-2xl w-fit ${feature.action ? 'bg-emerald-500 text-stone-900' : 'bg-black/20'}`}>
                            <feature.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-emerald-400 transition-colors">{feature.title}</h3>
                        <p className="text-[var(--text-secondary)] group-hover:text-stone-300 transition-colors">{feature.desc}</p>
                        {feature.action && (
                            <div className="mt-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-200">
                                Start Now <span className="text-xl">→</span>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
