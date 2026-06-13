'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen font-sans antialiased">
            {/* Hero Section */}
            <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden bg-neutral-900 text-white">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900" />
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                </div>
                
                <div className="relative z-10 text-center space-y-6 px-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-3"
                    >
                        <div className="h-px w-10 bg-neutral-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Our Story</span>
                        <div className="h-px w-10 bg-neutral-500" />
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl font-playfair font-bold tracking-tight leading-none"
                    >
                        About<br />Big Bazar
                    </motion.h1>
                </div>
            </section>

            {/* Core Story */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                    <div className="md:col-span-4">
                        <h2 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] sticky top-32">Our Mission</h2>
                    </div>
                    <div className="md:col-span-8 space-y-8">
                        <p className="text-2xl md:text-3xl font-playfair font-bold text-neutral-900 tracking-tight leading-snug">
                            &ldquo;Big Bazar Bariarhat is your one-stop destination for premium fashion — where quality meets affordability for the whole family.&rdquo;
                        </p>
                        <div className="space-y-6 text-neutral-500 text-base leading-relaxed">
                            <p>
                                Founded in Bariarhat, Mirsharai, we started with a simple belief: everyone deserves access to quality fashion without compromising on style or budget. From handpicked sarees and designer lehengas to contemporary menswear and kids&apos; collections, we curate the best for you.
                            </p>
                            <p>
                                Every product in our collection goes through careful selection. We work directly with artisans and manufacturers to bring you authentic craftsmanship at fair prices. Quality isn&apos;t just a promise — it&apos;s our standard.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="bg-neutral-50 border-y border-neutral-100 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: ShieldCheck, title: 'Quality Assured', desc: 'Every product is carefully inspected to ensure premium quality and durability.' },
                            { icon: Sparkles, title: 'Curated Selection', desc: 'Handpicked collections that balance tradition, style, and modern aesthetics.' },
                            { icon: Truck, title: 'Fast Delivery', desc: 'Free delivery in Mirsharai and reliable shipping across Bangladesh.' },
                        ].map((item, i) => (
                            <div key={i} className="p-8 rounded-xl bg-white border border-neutral-100 hover:border-neutral-300 transition-all group">
                                <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-900 mb-6 group-hover:bg-neutral-900 group-hover:text-white transition-all">
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-base font-bold text-neutral-900 uppercase tracking-tight mb-2">{item.title}</h3>
                                <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 text-center">
                <div className="max-w-2xl mx-auto px-6">
                    <h2 className="text-3xl font-playfair font-bold text-neutral-900 mb-4">Discover Our Collection</h2>
                    <p className="text-neutral-500 text-sm mb-8">Browse our latest arrivals and find your perfect style.</p>
                    <Link href="/products">
                        <Button className="h-14 px-10 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] group">
                            Explore Collection <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}