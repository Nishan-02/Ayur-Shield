import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Check, ArrowRight, Brain, Wind, Flame, Mountain } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const DOSHAS = [
    {
        id: 'Vata',
        name: 'Vata',
        element: 'Air + Ether',
        icon: Wind,
        desc: 'Creative, energetic, but prone to anxiety and dry skin.',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10 border-blue-500/20'
    },
    {
        id: 'Pitta',
        name: 'Pitta',
        element: 'Fire + Water',
        icon: Flame,
        desc: 'Intelligent, focused, but prone to anger and acidity.',
        color: 'text-orange-400',
        bg: 'bg-orange-500/10 border-orange-500/20'
    },
    {
        id: 'Kapha',
        name: 'Kapha',
        element: 'Earth + Water',
        icon: Mountain,
        desc: 'Calm, loyal, but prone to lethargy and weight gain.',
        color: 'text-green-400',
        bg: 'bg-green-500/10 border-green-500/20'
    }
];

const SYMPTOMS = [
    "Anxiety / Restlessness",
    "Poor Sleep",
    "Acidity / Heat",
    "Irritability",
    "Low Energy",
    "Lethargy",
    "Bloating / Gas",
    "Dry Skin",
    "Heavy Feeling",
    "Joint Pain"
];

export default function Assessment({ onComplete }) {
    const [step, setStep] = useState(1);
    const [selectedDosha, setSelectedDosha] = useState(null);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);

    const toggleSymptom = (symptom) => {
        if (selectedSymptoms.includes(symptom)) {
            setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
        } else {
            setSelectedSymptoms([...selectedSymptoms, symptom]);
        }
    };

    const handleFinish = () => {
        if (onComplete) {
            onComplete({
                dosha: selectedDosha,
                symptoms: selectedSymptoms
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-teal-400">
                    Health Assessment
                </h2>
                <p className="text-stone-400">Identify your current state for personalized guidance.</p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                {/* Progress Bar */}
                <div className="flex gap-2 mb-8 justify-center">
                    <div className={cn("h-1 w-16 rounded-full transition-colors", step >= 1 ? "bg-emerald-500" : "bg-stone-800")} />
                    <div className={cn("h-1 w-16 rounded-full transition-colors", step >= 2 ? "bg-emerald-500" : "bg-stone-800")} />
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-xl font-semibold text-center text-stone-200">
                                1. What is your dominant Body Type (Prakriti)?
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                {DOSHAS.map((d) => (
                                    <button
                                        key={d.id}
                                        onClick={() => setSelectedDosha(d.id)}
                                        className={cn(
                                            "p-6 rounded-2xl border text-left transition-all relative overflow-hidden group",
                                            selectedDosha === d.id ? "ring-2 ring-emerald-500 border-transparent bg-stone-800" : "hover:bg-stone-800/50 border-stone-700 bg-stone-900/50"
                                        )}
                                    >
                                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors", d.bg)}>
                                            <d.icon className={cn("w-6 h-6", d.color)} />
                                        </div>
                                        <h4 className="font-bold text-lg mb-1 text-stone-200 group-hover:text-emerald-400 transition-colors">{d.name}</h4>
                                        <p className="text-xs font-mono text-stone-500 mb-2 uppercase">{d.element}</p>
                                        <p className="text-sm text-stone-400 leading-relaxed">{d.desc}</p>

                                        {selectedDosha === d.id && (
                                            <div className="absolute top-4 right-4 text-emerald-500">
                                                <Check className="w-5 h-5" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-end mt-8">
                                <button
                                    disabled={!selectedDosha}
                                    onClick={() => setStep(2)}
                                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Next Step <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-xl font-semibold text-center text-stone-200">
                                2. Select your current symptoms (Vikriti)
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {SYMPTOMS.map((sym, i) => (
                                    <button
                                        key={i}
                                        onClick={() => toggleSymptom(sym)}
                                        className={cn(
                                            "p-4 rounded-xl border text-sm font-medium transition-all text-left flex items-start justify-between gap-2 group",
                                            selectedSymptoms.includes(sym)
                                                ? "bg-emerald-500/20 border-emerald-500/50 text-white"
                                                : "bg-stone-900/50 border-stone-700 text-stone-400 hover:border-emerald-500/30 hover:text-stone-300"
                                        )}
                                    >
                                        <span>{sym}</span>
                                        {selectedSymptoms.includes(sym) && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between mt-8">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-3 text-stone-400 hover:text-white font-medium transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    disabled={selectedSymptoms.length === 0}
                                    onClick={handleFinish}
                                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <Brain className="w-5 h-5" />
                                    Consult Chatbot
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
