import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import images
import bg1 from '../assets/bg-1.png';
import bg2 from '../assets/bg-2.jpg';
import bg3 from '../assets/bg-3.jpg';

const IMAGES = [bg1, bg2, bg3];

export default function BackgroundLayout({ children, theme }) {
    const [index, setIndex] = useState(0);

    // Auto-rotate images every 8 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % IMAGES.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-stone-950 text-stone-200 selection:bg-emerald-500/30 font-sans">

            {/* --- Image Slideshow (Ken Burns Effect) --- */}
            <div className="fixed inset-0 z-0 bg-stone-900">
                <AnimatePresence mode="popLayout">
                    <motion.img
                        key={index}
                        src={IMAGES[index]}
                        alt="Background"
                        initial={{ opacity: 0, scale: 1.1, x: '0%' }}
                        animate={{
                            opacity: 1,
                            scale: 1.15,
                            x: index % 2 === 0 ? ['0%', '2%'] : ['0%', '-2%']
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            opacity: { duration: 1.5 },
                            scale: { duration: 10, ease: "linear" },
                            x: { duration: 10, ease: "linear" }
                        }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </AnimatePresence>

                {/* Movement Animation Layer (Removed - handled in img) */}

                {/* Minimal Overlay for Text Contrast Only (Adjust based on theme) */}
                <div className={theme === 'dark' ? "absolute inset-0 bg-stone-950/20" : "absolute inset-0 bg-white/10"} />
                <div className={theme === 'dark'
                    ? "absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-stone-950/40"
                    : "absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-white/40"}
                />
            </div>

            {/* --- Ambient Gradients (Significantly Reduced for Clarity) --- */}
            <div className="fixed inset-0 z-0 mix-blend-soft-light opacity-40 pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-emerald-900/40 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.6, 0.4] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-amber-900/30 rounded-full blur-[100px]"
                />
            </div>

            {/* --- Floating "Prana" Particles --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-amber-200/10 blur-sm"
                        initial={{
                            x: Math.random() * 100 + "vw",
                            y: Math.random() * 100 + "vh",
                            scale: Math.random() * 0.5 + 0.5
                        }}
                        animate={{
                            y: [null, Math.random() * -100],
                            opacity: [0, 0.8, 0]
                        }}
                        transition={{
                            duration: Math.random() * 15 + 15,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 10
                        }}
                        style={{ width: Math.random() * 4 + 2, height: Math.random() * 4 + 2 }}
                    />
                ))}
            </div>

            {/* --- Content Overlay --- */}
            <div className="relative z-10">
                {children}
            </div>

        </div>
    );
}
