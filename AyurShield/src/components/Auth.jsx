import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function Auth({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call and validation
        setTimeout(() => {
            if (!form.email || !form.password) {
                setError("Please fill in all fields.");
                setLoading(false);
                return;
            }

            if (!isLogin && form.password !== form.confirmPassword) {
                setError("Passwords do not match.");
                setLoading(false);
                return;
            }

            if (!isLogin && !form.name) {
                setError("Name is required.");
                setLoading(false);
                return;
            }

            // Success
            // Mock User Object
            const userData = {
                name: form.name || "Seeker",
                email: form.email
            };
            onLogin(userData);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden text-stone-200 font-sans">
            {/* Background handled by Layout now */}

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md mx-4"
            >
                <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl shadow-black/50 relative overflow-hidden backdrop-blur-xl bg-stone-900/40">
                    {/* Decorative Top Gradient */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600"></div>

                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4"
                        >
                            <Leaf className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-white mb-2">AyurShield</h1>
                        <p className="text-stone-400">
                            {isLogin ? "Welcome back, Seeker." : "Begin your wellness journey."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 w-5 h-5 group-focus-within:text-emerald-400 transition-colors" />
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Full Name"
                                            value={form.name}
                                            onChange={handleChange}
                                            className="w-full bg-stone-950/50 border border-stone-800 rounded-xl px-12 py-3.5 text-stone-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-stone-600"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 w-5 h-5 group-focus-within:text-emerald-400 transition-colors" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full bg-stone-950/50 border border-stone-800 rounded-xl px-12 py-3.5 text-stone-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-stone-600"
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 w-5 h-5 group-focus-within:text-emerald-400 transition-colors" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full bg-stone-950/50 border border-stone-800 rounded-xl px-12 py-3.5 text-stone-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-stone-600"
                            />
                        </div>

                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="relative group mt-5">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 w-5 h-5 group-focus-within:text-emerald-400 transition-colors" />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full bg-stone-950/50 border border-stone-800 rounded-xl px-12 py-3.5 text-stone-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-stone-600"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-400 text-sm text-center font-medium bg-red-500/10 py-2 rounded-lg border border-red-500/20"
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? "Sign In" : "Create Account"}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-stone-500 text-sm">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                                className="ml-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                            >
                                {isLogin ? "Sign Up" : "Log In"}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-stone-600 text-xs mt-6 flex items-center justify-center gap-2">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    Protected by Ayurvedic Wisdom
                </p>

            </motion.div>
        </div>
    );
}
