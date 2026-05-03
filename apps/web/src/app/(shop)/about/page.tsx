'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles, ShieldCheck, Truck, Globe, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <div className="bg-[#fafafa] min-h-screen font-sans antialiased">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-black text-white">
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
                    {/* Abstract Grid Pattern */}
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                </div>
                
                <div className="relative z-10 text-center space-y-8 px-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-3 mb-4"
                    >
                        <div className="h-px w-12 bg-indigo-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400">Our Origin Protocol</span>
                        <div className="h-px w-12 bg-indigo-500" />
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none"
                    >
                        Engineering<br />Aesthetics
                    </motion.h1>
                </div>
            </section>

            {/* Core Narrative */}
            <section className="max-w-4xl mx-auto px-6 py-24 lg:py-40">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
                    <div className="md:col-span-4">
                        <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] sticky top-32">The Manifest</h2>
                    </div>
                    <div className="md:col-span-8 space-y-12">
                        <p className="text-3xl font-black text-gray-900 tracking-tight leading-tight uppercase italic">
                            "Big Bazar Bariarhat is not a marketplace. It is a curation protocol for the modern professional."
                        </p>
                        <div className="space-y-8 text-gray-500 text-lg font-medium leading-relaxed">
                            <p>
                                Founded at the intersection of industrial efficiency and artisanal craft, we've spent years refining our acquisition matrix. Our mission is to eliminate the noise of modern consumerism and provide only the essential artifacts for a life well-lived.
                            </p>
                            <p>
                                Every item in our collection undergoes a rigorous vetting process. From the tensile strength of our textiles to the ergonomic precision of our home decor, quality is not a feature—it is the baseline.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Matrix */}
            <section className="bg-white border-y border-gray-100 py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { icon: ShieldCheck, title: 'Uncompromising Quality', desc: 'Artifacts engineered to withstand the test of time and trend.' },
                            { icon: Sparkles, title: 'Curated Excellence', desc: 'A selection protocol that prioritizes utility and aesthetic balance.' },
                            { icon: Globe, title: 'Logistical Precision', desc: 'A global transit matrix ensuring secure and rapid acquisition.' },
                        ].map((item, i) => (
                            <div key={i} className="p-10 rounded-[3rem] bg-gray-50 border border-gray-50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-900 shadow-xl shadow-black/5 mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                    <item.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4">{item.title}</h3>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer Call to Action */}
            <section className="py-24 text-center">
                <div className="max-w-2xl mx-auto px-6">
                    <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-12">Experience the Protocol</h2>
                    <Link href="/shop">
                        <Button className="h-20 px-12 bg-black text-white hover:bg-gray-800 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-black/20 group">
                            Explore Collection <ArrowLeft className="h-5 w-5 ml-4 rotate-180 transition-transform group-hover:translate-x-2" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}