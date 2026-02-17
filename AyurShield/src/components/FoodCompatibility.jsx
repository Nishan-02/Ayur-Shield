import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Incompatible combinations (Viruddha Ahara)
const BAD_COMBINATIONS = [
    { foods: ['milk', 'banana'], reason: "Creates toxins (Amavisha) and congestion.", type: "danger" },
    { foods: ['milk', 'fish'], reason: "Causes skin diseases and allergies.", type: "danger" },
    { foods: ['milk', 'sour'], reason: "Curdles in stomach, causes acidity.", type: "warning" },
    { foods: ['honey', 'ghee'], reason: "Toxic if consumed in equal quantities by weight.", type: "danger" },
    { foods: ['eggs', 'milk'], reason: "Heavy to digest, clogs channels.", type: "warning" },
    { foods: ['yogurt', 'fruit'], reason: "Fermentation issues, metabolic imbalance.", type: "warning" },
    { foods: ['nightshades', 'cheese'], reason: "Inflammatory combination.", type: "warning" }
];

export default function FoodCompatibility() {
    const [foodA, setFoodA] = useState('');
    const [foodB, setFoodB] = useState('');
    const [result, setResult] = useState(null);

    const checkCompatibility = () => {
        if (!foodA || !foodB) return;

        const f1 = foodA.toLowerCase();
        const f2 = foodB.toLowerCase();

        // Find match
        const match = BAD_COMBINATIONS.find(combo =>
            (combo.foods.includes(f1) || combo.foods.some(f => f1.includes(f))) &&
            (combo.foods.includes(f2) || combo.foods.some(f => f2.includes(f)))
        );

        if (match) {
            setResult({
                status: match.type === 'danger' ? 'INCOMPATIBLE' : 'CAUTION',
                detail: match.reason,
                color: match.type === 'danger' ? 'text-red-400' : 'text-amber-400',
                bg: match.type === 'danger' ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'
            });
        } else {
            setResult({
                status: 'COMPATIBLE',
                detail: "No classic Ayurvedic incompatibility found.",
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10 border-emerald-500/30'
            });
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-amber-400">
                    Viruddha Ahara Checker
                </h2>
                <p className="text-stone-400">Check food combinations for toxicity risks.</p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-stone-800">
                <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
                    <div className="w-full relative">
                        <Utensils className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 w-4 h-4" />
                        <input
                            type="text"
                            value={foodA}
                            onChange={(e) => setFoodA(e.target.value)}
                            placeholder="First Food Item (e.g. Milk)"
                            className="input-field pl-10 w-full bg-stone-900/50 border border-stone-700 rounded-xl px-4 py-3 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                    </div>
                    <span className="text-stone-500 font-bold">+</span>
                    <div className="w-full relative">
                        <Utensils className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 w-4 h-4" />
                        <input
                            type="text"
                            value={foodB}
                            onChange={(e) => setFoodB(e.target.value)}
                            placeholder="Second Food Item (e.g. Fish)"
                            className="input-field pl-10 w-full bg-stone-900/50 border border-stone-700 rounded-xl px-4 py-3 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                    </div>
                </div>

                <button
                    onClick={checkCompatibility}
                    className="w-full bg-stone-700 hover:bg-stone-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    <Search className="w-5 h-5" /> Check Compatibility
                </button>

                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mt-8"
                        >
                            <div className={cn("p-6 rounded-2xl border flex items-start gap-4", result.bg)}>
                                <div className={cn("p-2 rounded-full bg-black/20 shrink-0", result.color)}>
                                    {result.status === 'COMPATIBLE' ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h3 className={cn("text-lg font-bold mb-1", result.color)}>
                                        {result.status}
                                    </h3>
                                    <p className="text-stone-300">{result.detail}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
