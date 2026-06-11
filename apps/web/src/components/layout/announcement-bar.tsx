'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AnnouncementBar() {
    const [text, setText] = useState<string>("");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const closed = localStorage.getItem('announcement-closed');
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const result = await res.json();
                    if (result.success && result.data) {
                        const announcementText = result.data.announcement_text || "🚚 মিরসরাইতে ফ্রি ডেলিভারি! | Free Delivery for Mirsharai";
                        const showAnnouncement = result.data.show_announcement !== false;
                        
                        setText(announcementText);
                        if (!closed && showAnnouncement) {
                            setIsVisible(true);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to load announcement bar settings:", err);
            }
        };
        fetchSettings();
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('announcement-closed', 'true');
    };

    if (!isVisible || !text) return null;

    const renderContent = () => {
        const parts = text.split('|').map(p => p.trim()).filter(Boolean);
        return parts.map((part, index) => {
            // Highlight coupon codes or codes like BIGBAZAR10 if present
            const isCouponPart = part.toLowerCase().includes('code');
            if (isCouponPart) {
                const subParts = part.split(/(BIGBAZAR10)/i);
                return (
                    <span key={index} className="flex items-center gap-4">
                        <span>
                            {subParts.map((sub, sIdx) => 
                                sub.toUpperCase() === 'BIGBAZAR10' 
                                    ? <span key={sIdx} className="text-indigo-400 font-bold">{sub}</span>
                                    : sub
                            )}
                        </span>
                        {index < parts.length - 1 && <span className="w-1 h-1 bg-white/30 rounded-full" />}
                    </span>
                );
            }

            return (
                <span key={index} className="flex items-center gap-4">
                    <span>{part}</span>
                    {index < parts.length - 1 && <span className="w-1 h-1 bg-white/30 rounded-full" />}
                </span>
            );
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-[#E11D48] text-white relative overflow-hidden z-[60]"
                >
                    <div className="flex items-center justify-center py-2 px-12 group cursor-pointer">
                        <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-4 text-white">
                                {renderContent()}
                            </p>
                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-4 text-white" aria-hidden="true">
                                {renderContent()}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={handleClose}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Close Announcement"
                    >
                        <X className="h-3 w-3 text-white/60 hover:text-white" />
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
