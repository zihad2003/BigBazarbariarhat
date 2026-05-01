'use client';

import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function AccessoriesPage() {
    return (
        <main className="min-h-[80vh] flex flex-col items-center justify-center p-8 bg-gray-50 text-center relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-destructive/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-foreground/5 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-2xl relative z-10 space-y-8 bg-white/70 backdrop-blur-md p-12 md:p-16 shadow-xl border border-white"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="w-20 h-20 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-6"
                >
                    <Clock className="w-10 h-10 text-destructive" />
                </motion.div>

                <div>
                    <h1 className="text-4xl md:text-5xl font-playfair font-black text-foreground uppercase tracking-[0.2em] mb-4">
                        Coming Soon
                    </h1>
                    <div className="h-1 w-24 bg-destructive mx-auto rounded-full" />
                </div>

                <p className="text-muted-foreground leading-relaxed text-lg max-w-lg mx-auto">
                    We're carefully curating our exclusive <span className="text-foreground font-bold">Accessories Collection</span>.
                    The perfect finishing touches for every outfit are almost here.
                </p>

                <div className="pt-8">
                    <Link href="/">
                        <Button className="bg-foreground text-white hover:bg-destructive hover:shadow-lg hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest font-bold px-8 h-12 rounded-none">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Return to Shop
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </main>
    )
}
