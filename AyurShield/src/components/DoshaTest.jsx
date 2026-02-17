import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Activity, ArrowRight, RefreshCw } from 'lucide-react';

const QUESTIONS = [
    {
        id: 1,
        text: "How would you describe your body frame?",
        options: [
            { text: "Thin, lean, hard to gain weight", type: "Vata" },
            { text: "Medium, athletic, easy to build muscle", type: "Pitta" },
            { text: "Large, sturdy, easy to gain weight", type: "Kapha" }
        ]
    },
    {
        id: 2,
        text: "How is your skin usually?",
        options: [
            { text: "Dry, rough, cold to touch", type: "Vata" },
            { text: "Sensitive, oily, warm, prone to acne", type: "Pitta" },
            { text: "Soft, smooth, cool, moist", type: "Kapha" }
        ]
    },
    {
        id: 3,
        text: "How do you react to stress?",
        options: [
            { text: "Anxious, fearful, can't sleep", type: "Vata" },
            { text: "Irritable, angry, critical", type: "Pitta" },
            { text: "Withdrawn, calm, stubborn", type: "Kapha" }
        ]
    },
    {
        id: 4,
        text: "How is your sleep pattern?",
        options: [
            { text: "Light, interrupted, often dream-filled", type: "Vata" },
            { text: "Sound, medium duration, feel rested", type: "Pitta" },
            { text: "Deep, heavy, hard to wake up", type: "Kapha" }
        ]
    },
    {
        id: 5,
        text: "What kind of weather do you dislike most?",
        options: [
            { text: "Cold and windy", type: "Vata" },
            { text: "Hot and humid", type: "Pitta" },
            { text: "Cold and damp", type: "Kapha" }
        ]
    }
];

export default function DoshaTest({ onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [scores, setScores] = useState({ Vata: 0, Pitta: 0, Kapha: 0 });
    const [result, setResult] = useState(null);

    const handleOptionSelect = (type) => {
        const newScores = { ...scores, [type]: scores[type] + 1 };
        setScores(newScores);

        if (currentStep < QUESTIONS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            calculateResult(newScores);
        }
    };

    const calculateResult = (finalScores) => {
        // Find highest score
        const maxScore = Math.max(finalScores.Vata, finalScores.Pitta, finalScores.Kapha);
        // There could be ties, but grabbing the first one for simplicity or joining them
        const dominantTypes = Object.keys(finalScores).filter(k => finalScores[k] === maxScore);
        const dominantDosha = dominantTypes.join('-');
        setResult(dominantDosha);
        if (onComplete) onComplete(dominantDosha);
    };

    const resetTest = () => {
        setCurrentStep(0);
        setScores({ Vata: 0, Pitta: 0, Kapha: 0 });
        setResult(null);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-200 to-amber-400">
                    Prakriti Analysis (Dosha Test)
                </h2>
                <p className="text-stone-400">Discover your unique body constitution.</p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-stone-800">
                {!result ? (
                    <div className="space-y-8">
                        {/* Progress Bar */}
                        <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-orange-500 to-amber-500 h-full transition-all duration-300"
                                style={{ width: `${((currentStep) / QUESTIONS.length) * 100}%` }}
                            />
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-stone-200">
                                <span className="text-stone-500 mr-2">Q{currentStep + 1}.</span>
                                {QUESTIONS[currentStep].text}
                            </h3>

                            <div className="grid gap-4">
                                {QUESTIONS[currentStep].options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(option.type)}
                                        className="flex justify-between items-center p-4 rounded-xl bg-stone-800/50 border border-stone-700 hover:bg-stone-700/50 hover:border-orange-500/30 transition-all text-left group"
                                    >
                                        <span className="text-stone-300 group-hover:text-white transition-colors">
                                            {option.text}
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-stone-600 group-hover:text-orange-400 transition-colors opacity-0 group-hover:opacity-100" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-8 py-8">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-block p-6 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 mb-4 h-32 w-32 flex items-center justify-center mx-auto"
                        >
                            <Activity className="w-16 h-16 text-orange-400" />
                        </motion.div>

                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-white">Your Dominant Dosha is</h3>
                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-amber-400 to-yellow-200">
                                {result.toUpperCase()}
                            </div>
                            <p className="max-w-md mx-auto text-stone-400">
                                Your constitution reflects a {result} dominance. Focus on foods and activities that balance this energy.
                            </p>
                        </div>

                        <button
                            onClick={resetTest}
                            className="flex items-center gap-2 mx-auto px-6 py-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retake Test
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
