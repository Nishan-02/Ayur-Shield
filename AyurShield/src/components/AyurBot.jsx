import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Sparkles, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const REMEDIES = {
    fever: "Drink extensive Tulsi & Ginger tea. Avoid cold water.",
    cold: "Steam inhalation with Eucalyptus oil. Drink warm turmeric milk.",
    headache: "Apply sandalwood paste. Practice Pranayama.",
    pitta: "Consume cooling foods like cucumber, coconut water, and mint.",
    vata: "Keep warm. Eat cooked, moist foods like soups and stews.",
    kapha: "Eat light, dry, and spicy foods. Avoid dairy and sweets.",
    bloated: "Chew on fennel seeds (Saunf) or drink warm cumin water.",
    anxiety: "Try 'Nadi Shodhana' (Alternate Nostril Breathing) and massage feet with sesame oil.",
    sleep: "Drink warm milk with nutmeg before bed. Avoid screens 1 hour before sleep.",
};

export default function AyurBot({ user, assessment }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: `Namaste ${user?.name || 'Seeker'}! I am AyurBot. How can I help your health today?` }
    ]);
    const [input, setInput] = useState('');
    const [mode, setMode] = useState('general'); // 'general', 'mental-health'
    const messagesEndRef = useRef(null);
    const hasGreetedRef = useRef(false);

    // Initial personalized greeting if assessment is available
    useEffect(() => {
        if (assessment && !hasGreetedRef.current && isOpen) {
            const { dosha, symptoms } = assessment;
            if (dosha && symptoms.length > 0) {
                const symptomStr = symptoms.slice(0, 2).join(" and ");
                setMessages(prev => [...prev, {
                    role: 'bot',
                    text: `I noticed your ${dosha} constitution and recent ${symptomStr}. Would you like specific advice for these?`
                }]);
                hasGreetedRef.current = true;
            }
        }
    }, [assessment, isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');

        setTimeout(() => {
            let botResponse = "I recommend consulting a specialist for that specific issue.";
            const lowerInput = userMsg.toLowerCase();

            // 1. Personalized Context Check
            if (lowerInput.includes('yes') || lowerInput.includes('advice') || lowerInput.includes('help')) {
                if (assessment?.dosha === 'Vata') {
                    botResponse = "Since you are Vata dominant, focus on warmth, routine, and stability. Avoid cold, dry foods. Try warm soups and sesame oil massage.";
                } else if (assessment?.dosha === 'Pitta') {
                    botResponse = "For your Pitta nature, cooling is essential. Avoid spicy, sour, and salty foods. Sweet fruits, coconut water, and meditation will help balance your fire.";
                } else if (assessment?.dosha === 'Kapha') {
                    botResponse = "To balance Kapha, you need stimulation. Spicy, bitter, and astringent foods are good. Daily exercise and waking up early are crucial for you.";
                }
            }
            // 2. Mental Health Mode Logic
            else if (mode === 'mental-health') {
                if (lowerInput.includes('stress') || lowerInput.includes('anxious')) {
                    botResponse = "I hear you. For Vata-type anxiety, grounding is key. Let's try 4-7-8 breathing together. Inhale... Hold... Exhale...";
                } else if (lowerInput.includes('sad') || lowerInput.includes('depressed')) {
                    botResponse = "Kapha-type heaviness can be lifted with movement. Try a brisk walk or 'Kapalbhati' pranayama to energize your mind.";
                } else if (lowerInput.includes('angry') || lowerInput.includes('irritated')) {
                    botResponse = "Pitta-type heat in the mind needs cooling. Visualize a calm, moonlit lake. Drink cool water.";
                } else {
                    botResponse = "Tell me more about how you're feeling. I'm here to listen.";
                }
            }
            // 3. General Logic
            else {
                if (lowerInput.includes('bloated')) botResponse = REMEDIES.bloated;
                else if (lowerInput.includes('fever')) botResponse = REMEDIES.fever;
                else if (lowerInput.includes('cold')) botResponse = REMEDIES.cold;
                else if (lowerInput.includes('headache')) botResponse = REMEDIES.headache;
                else if (lowerInput.includes('sleep') || lowerInput.includes('insomnia')) botResponse = REMEDIES.sleep;
                else if (lowerInput.includes('diet') || lowerInput.includes('food')) {
                    botResponse = "In Ayurveda, diet depends on your Dosha. " + (assessment?.dosha ? `For your ${assessment.dosha} type, favor ${assessment.dosha === 'Vata' ? 'warm, oily' : assessment.dosha === 'Pitta' ? 'cool, sweet' : 'warm, dry'} foods.` : "What is your body type?");
                }
                else if (lowerInput.includes('mental') || lowerInput.includes('mind')) {
                    botResponse = "Would you like to switch to 'Mental Health Mode' for specialized guidance?";
                    setMode('mental-health');
                }
            }

            setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-20 right-0 w-80 md:w-96 h-[500px] bg-stone-900 border border-emerald-900/50 rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className={cn(
                            "p-4 border-b flex justify-between items-center backdrop-blur-md transition-colors",
                            mode === 'mental-health' ? "bg-indigo-900/40 border-indigo-900/30" : "bg-emerald-900/30 border-emerald-900/30"
                        )}>
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center",
                                    mode === 'mental-health' ? "bg-indigo-600" : "bg-emerald-800"
                                )}>
                                    {mode === 'mental-health' ? <Brain className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-emerald-200" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-emerald-100">{mode === 'mental-health' ? 'Mind Soothe' : 'AyurBot'}</h3>
                                    <p className="text-xs text-emerald-400">{mode === 'mental-health' ? 'Mental Wellness Guide' : 'Personal Ayurvedic Doctor'}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setMode(mode === 'general' ? 'mental-health' : 'general')}
                                    className="text-emerald-400 hover:text-white"
                                    title="Toggle Mental Health Mode"
                                >
                                    <Sparkles className="w-5 h-5" />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                            {messages.map((msg, i) => (
                                <div key={i} className={cn(
                                    "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed",
                                    msg.role === 'user'
                                        ? "ml-auto bg-emerald-600 text-white rounded-tr-sm"
                                        : "bg-stone-800 text-stone-200 rounded-tl-sm border border-stone-700"
                                )}>
                                    {msg.text}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-stone-900 border-t border-stone-800 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={mode === 'mental-health' ? "How is your mood?" : "Describe symptoms..."}
                                className="flex-1 bg-stone-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-emerald-500 text-white placeholder-stone-500"
                            />
                            <button
                                onClick={handleSend}
                                className="p-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50 flex items-center justify-center transition-all transform hover:scale-110 active:scale-95"
            >
                {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
            </button>
        </div>
    );
}
