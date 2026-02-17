
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Leaf, Home, Activity, Shield, Calendar, Utensils } from 'lucide-react';

export default function Navbar({ activeTab, onNavigate }) {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { id: 'dashboard', label: 'Home', icon: Home },
        { id: 'dosha', label: 'Dosha Test', icon: Activity },
        { id: 'scanner', label: 'Herb Safety', icon: Shield },
        { id: 'seasonal', label: 'Seasonal Guide', icon: Calendar },
        { id: 'food', label: 'Food Checker', icon: Utensils },
    ];

    const handleNav = (tabId) => {
        onNavigate(tabId);
        setIsOpen(false);
    };

    return (
        <nav className="sticky top-0 z-[60] w-full bg-white/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleNav('dashboard')}
                    >
                        <div className="p-2 bg-emerald-600 rounded-lg">
                            <Leaf className="w-6 h-6 text-white fill-current" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                            AyurShield
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNav(item.id)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === item.id
                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                        : 'text-emerald-900 dark:text-stone-300 hover:bg-emerald-50 dark:hover:bg-stone-800 hover:text-emerald-700 dark:hover:text-emerald-400'
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 focus:outline-none"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border-b border-stone-200 dark:border-stone-800 overflow-hidden"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNav(item.id)}
                                    className={`block w-full text-left px-3 py-4 rounded-md text-base font-medium flex items-center gap-3 ${activeTab === item.id
                                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                                        : 'text-emerald-900 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
