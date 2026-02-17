import React, { useState } from 'react';
import { Pill, Leaf, Activity, AlertTriangle, CheckCircle, User, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const DRUG_INTERACTIONS = {
    warfarin: {
        ginger: { risk: "High", msg: "Increases bleeding risk significantly." },
        garlic: { risk: "Moderate", msg: "May prolong bleeding time." },
        turmeric: { risk: "Moderate", msg: "Enhances anti-coagulant effect." }
    },
    aspirin: {
        ginkgo: { risk: "High", msg: "Increased bleeding tendency." }
    },
    sertraline: {
        ashwagandha: { risk: "High", msg: "Potential drowsiness & serotonin increase." }
    }
};

export default function SafetyScanner({ dosha }) {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [medInput, setMedInput] = useState('');
    const [herbInput, setHerbInput] = useState('');

    const handleAnalyze = () => {
        if (!medInput || !herbInput) return;

        setAnalyzing(true);
        setResult(null);

        setTimeout(() => {
            // 1. Drug Check
            const drugLower = medInput.toLowerCase();
            const herbLower = herbInput.toLowerCase();
            let interaction = null;

            // Scan interactions
            for (const [drug, herbs] of Object.entries(DRUG_INTERACTIONS)) {
                if (drugLower.includes(drug)) {
                    for (const [herb, details] of Object.entries(herbs)) {
                        if (herbLower.includes(herb)) {
                            interaction = details;
                        }
                    }
                }
            }

            // 2. Season Check (Hardcoded Mangaluru Summer i.e., Pitta season)
            // Ideally this should come from the global season state, but keeping logic local for now as per extraction
            const isHeatingHerb = ['ginger', 'pepper', 'garlic'].some(h => herbLower.includes(h));
            const seasonCheck = {
                status: isHeatingHerb ? 'Warning' : 'Safe',
                msg: isHeatingHerb ? 'Season is Hot (Pitta). Herb is heating.' : 'Herb suitable for season.',
            };

            // 3. Body Check (Dosha)
            const bodyCheck = {
                status: dosha.includes('Pitta') && isHeatingHerb ? 'Warning' : 'Safe',
                msg: dosha.includes('Pitta') && isHeatingHerb ? `Your Pitta is high. Avoid heating herbs.` : `Compatible with your ${dosha} state.`
            };

            // Final Decision
            const isDanger = interaction?.risk === 'High' || (seasonCheck.status === 'Warning' && bodyCheck.status === 'Warning');

            setResult({
                status: isDanger ? 'DANGER' : (interaction ? 'WARNING' : 'SAFE'),
                mainMessage: interaction ? interaction.msg : "No comprehensive negative interaction found.",
                drugInteraction: interaction ? `❌ ${interaction.msg}` : "✅ No known drug conflict.",
                seasonCheck: seasonCheck.status === 'Warning' ? `⚠️ ${seasonCheck.msg}` : `✅ ${seasonCheck.msg}`,
                bodyCheck: bodyCheck.status === 'Warning' ? `⚠️ ${bodyCheck.msg}` : `✅ ${bodyCheck.msg}`,
            });

            setAnalyzing(false);
        }, 1500);
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-teal-400">
                    Safety & Interaction Scanner
                </h2>
                <p className="text-stone-400">Verify compatibility between modern meds, herbs, and your body.</p>
            </div>

            {/* Input Section */}
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-emerald-500/10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>

                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-stone-400 ml-1">Modern Medicine</label>
                        <div className="relative group">
                            <Pill className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-purple-400 transition-colors" />
                            <input
                                type="text"
                                value={medInput}
                                onChange={(e) => setMedInput(e.target.value)}
                                placeholder="e.g. Warfarin, Sertraline"
                                className="input-field pl-12 focus:ring-purple-500/50 w-full bg-stone-900/50 border border-stone-700 rounded-xl px-4 py-3 text-stone-200 focus:outline-none focus:ring-2 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-center text-stone-600">
                        <Activity className="w-6 h-6 rotate-90 md:rotate-0" />
                    </div>

                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-stone-400 ml-1">Ayurvedic Herb</label>
                        <div className="relative group">
                            <Leaf className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-emerald-400 transition-colors" />
                            <input
                                type="text"
                                value={herbInput}
                                onChange={(e) => setHerbInput(e.target.value)}
                                placeholder="e.g. Ashwagandha, Ginger"
                                className="input-field pl-12 w-full bg-stone-900/50 border border-stone-700 rounded-xl px-4 py-3 text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-emerald-900/40 active:scale-95 transition-all text-lg tracking-wide disabled:opacity-70 flex items-center justify-center gap-3"
                >
                    {analyzing ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ANALYZING VITAL SIGNS...
                        </>
                    ) : (
                        <>
                            ANALYZE COMPATIBILITY
                        </>
                    )}
                </button>
            </div>

            {/* Result Section */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={cn(
                            "p-1 rounded-3xl bg-gradient-to-b",
                            result.status === 'DANGER' ? 'from-red-500/50 to-red-900/10' :
                                result.status === 'WARNING' ? 'from-amber-500/50 to-amber-900/10' :
                                    'from-emerald-500/50 to-emerald-900/10'
                        )}
                    >
                        <div className="bg-stone-900/95 backdrop-blur-xl rounded-[22px] p-8 border border-white/5">

                            {/* Header */}
                            <div className="flex items-start gap-6 mb-8 border-b border-white/5 pb-6">
                                <div className={cn(
                                    "p-4 rounded-2xl shrink-0",
                                    result.status === 'DANGER' ? "bg-red-500/20 text-red-400" :
                                        result.status === 'WARNING' ? "bg-amber-500/20 text-amber-400" :
                                            "bg-emerald-500/20 text-emerald-400"
                                )}>
                                    {result.status === 'DANGER' ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
                                </div>
                                <div>
                                    <h2 className={cn(
                                        "text-3xl font-black tracking-tight mb-2",
                                        result.status === 'DANGER' ? "text-red-400" :
                                            result.status === 'WARNING' ? "text-amber-400" :
                                                "text-emerald-400"
                                    )}>
                                        {result.status === 'DANGER' ? 'CRITICAL INTERACTION' : result.status === 'WARNING' ? 'CAUTION ADVISED' : 'SAFE TO COMBINE'}
                                    </h2>
                                    <p className="text-stone-400 text-lg leading-relaxed">{result.mainMessage}</p>
                                </div>
                            </div>

                            {/* The 3-Layer Analysis Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                {/* Layer 1: Drug Interaction */}
                                <div className="bg-stone-800/50 p-5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 mb-3 text-stone-500 text-xs font-bold uppercase tracking-widest">
                                        <Pill className="w-4 h-4" /> Drug Safety
                                    </div>
                                    <p className={cn("font-medium",
                                        result.status === 'DANGER' ? "text-red-400" : "text-stone-300"
                                    )}>
                                        {result.drugInteraction}
                                    </p>
                                </div>

                                {/* Layer 2: Seasonal Safety */}
                                <div className="bg-stone-800/50 p-5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 mb-3 text-stone-500 text-xs font-bold uppercase tracking-widest">
                                        <Sun className="w-4 h-4" /> Eco/Season Factor
                                    </div>
                                    <p className="font-medium text-stone-300">
                                        {result.seasonCheck}
                                    </p>
                                </div>

                                {/* Layer 3: Body Safety */}
                                <div className="bg-stone-800/50 p-5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 mb-3 text-stone-500 text-xs font-bold uppercase tracking-widest">
                                        <User className="w-4 h-4" /> Body Constitution
                                    </div>
                                    <p className="font-medium text-stone-300">
                                        {result.bodyCheck}
                                    </p>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
