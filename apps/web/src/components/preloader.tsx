'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [imageSrc, setImageSrc] = useState('/logo.png');

    useEffect(() => {
        // Prevent scrolling and interaction while preloading
        if (isLoading) {
            document.body.style.overflow = 'hidden';
        }

        // Timer to dismiss preloader
        const timer = setTimeout(() => {
            setIsLoading(false);
            document.body.style.overflow = 'unset';
        }, 2800); // Extended slightly for full animation

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = 'unset';
        };
    }, [isLoading]);

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    key="preloader"
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        y: -50,
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
                    }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden"
                >
                    {/* Background Ambient Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 pointer-events-none" />

                    <div className="relative flex flex-col items-center justify-center z-10">
                        {/* Logo Container with Animation */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                y: 0,
                                transition: {
                                    duration: 1.0,
                                    ease: [0.25, 0.1, 0.25, 1.0]
                                }
                            }}
                            className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center mb-8"
                        >
                            {/* 
                                IMPORTANT: The user wants to use a specific image file.
                                Please ensure 'logo.png' is placed in 'apps/web/public/logo.png'
                            */}
                            <Image
                                src={imageSrc}
                                alt="Big Bazar Logo"
                                fill
                                className="object-contain drop-shadow-2xl"
                                priority
                                unoptimized
                                onError={() => {
                                    if (imageSrc !== '/logo.svg') {
                                        console.warn("Logo image not found. Falling back to SVG.");
                                        setImageSrc('/logo.svg');
                                    }
                                }}
                            />

                            {/* Shimmer/Glint Effect Overlay */}
                            <motion.div
                                initial={{ x: '-100%', opacity: 0 }}
                                animate={{ x: '100%', opacity: [0, 0.5, 0] }}
                                transition={{
                                    repeat: Infinity,
                                    repeatDelay: 2,
                                    duration: 1.5,
                                    ease: "linear"
                                }}
                                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 z-20 pointer-events-none mix-blend-overlay"
                            />
                        </motion.div>

                        {/* Tagline Animation */}
                        <div className="overflow-hidden h-8 flex items-center">
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ delay: 0.8, duration: 0.6, ease: "circOut" }}
                            >
                                <span className="text-xs md:text-sm font-black tracking-[0.6em] text-gray-900 uppercase font-sans">
                                    Premium Essentials
                                </span>
                            </motion.div>
                        </div>

                        {/* Loading Bar */}
                        <motion.div
                            initial={{ scaleX: 0, originX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 2.5, ease: "easeInOut" }}
                            className="mt-8 w-48 h-1 bg-red-600 rounded-full"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
