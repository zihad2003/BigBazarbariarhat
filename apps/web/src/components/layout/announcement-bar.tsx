'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AnnouncementBar() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const closed = localStorage.getItem('announcement-closed');
        if (!closed) setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('announcement-closed', 'true');
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-black text-white relative overflow-hidden z-[60]"
                >
                    <div className="flex items-center justify-center py-3 px-12 group cursor-pointer">
                        <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4">
                                Free delivery on orders above ৳1000 <span className="w-1 h-1 bg-white/30 rounded-full" /> 
                                Use code <span className="text-indigo-400">BIGBAZAR10</span> for 10% off <span className="w-1 h-1 bg-white/30 rounded-full" />
                                Exclusive Member Rewards Now Active
                            </p>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4" aria-hidden="true">
                                Free delivery on orders above ৳1000 <span className="w-1 h-1 bg-white/30 rounded-full" /> 
                                Use code <span className="text-indigo-400">BIGBAZAR10</span> for 10% off <span className="w-1 h-1 bg-white/30 rounded-full" />
                                Exclusive Member Rewards Now Active
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={handleClose}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Close Announcement"
                    >
                        <X className="h-3 w-3 text-white/50 hover:text-white" />
                    </button>
                    
                    <style jsx>{`
                        @keyframes marquee {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                        .animate-marquee {
                            animation: marquee 20s linear infinite;
                        }
                        .animate-marquee:hover {
                            animation-play-state: paused;
                        }
                    `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
