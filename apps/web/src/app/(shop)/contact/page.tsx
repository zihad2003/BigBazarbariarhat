'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Mock submission protocol
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setSubmitted(true);
    };

    return (
        <div className="bg-[#fafafa] min-h-screen font-sans">
            <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-24">
                
                {/* Header */}
                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-8 bg-black" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Communication Terminal</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-none">Initiate<br />Contact</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    
                    {/* Contact Info Matrix */}
                    <div className="lg:col-span-5 space-y-12">
                        <div className="bg-black text-white rounded-[3rem] p-12 relative overflow-hidden group shadow-2xl shadow-black/20">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-[5rem] group-hover:scale-110 transition-transform -mr-12 -mt-12" />
                            
                            <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-12">Headquarters Protocol</h3>
                            
                            <div className="space-y-10 relative z-10">
                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Location Coordinates</p>
                                        <p className="text-lg font-bold tracking-tight uppercase">Bariarhat Central Plaza<br />Chittagong, BD 4324</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Transmission Channel</p>
                                        <p className="text-lg font-bold tracking-tight uppercase">Support@bigbazar.com<br />Press@bigbazar.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Voice Frequency</p>
                                        <p className="text-lg font-bold tracking-tight uppercase">+880 1234-567890<br />+880 1876-543210</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] flex flex-col items-center text-center group hover:border-indigo-100 transition-all">
                                <Globe className="h-6 w-6 text-gray-300 group-hover:text-indigo-600 mb-4 transition-colors" />
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Social Protocol</span>
                                <span className="text-xs font-bold text-gray-900 mt-2 uppercase tracking-tight">@BIGBAZAR_BD</span>
                            </div>
                            <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] flex flex-col items-center text-center group hover:border-indigo-100 transition-all">
                                <MessageSquare className="h-6 w-6 text-gray-300 group-hover:text-indigo-600 mb-4 transition-colors" />
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Support Protocol</span>
                                <span className="text-xs font-bold text-gray-900 mt-2 uppercase tracking-tight">LIVE CHAT 24/7</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Terminal */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-[4rem] p-10 lg:p-16 border border-gray-100 shadow-sm">
                            {submitted ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-20"
                                >
                                    <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <Send className="h-10 w-10" />
                                    </div>
                                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4">Transmission Successful</h2>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-10">Our curators will respond to your frequency shortly.</p>
                                    <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-xl h-12 px-8 text-[10px] font-black uppercase tracking-widest">
                                        Initiate New Session
                                    </Button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Entity Identification</label>
                                            <Input 
                                                required
                                                placeholder="FULL NAME"
                                                className="h-16 rounded-2xl bg-gray-50 border-gray-50 focus:bg-white focus:border-indigo-100 transition-all text-sm font-black uppercase tracking-tight"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Sync Channel (Email)</label>
                                            <Input 
                                                required
                                                type="email"
                                                placeholder="CURATOR@DOMAIN.COM"
                                                className="h-16 rounded-2xl bg-gray-50 border-gray-50 focus:bg-white focus:border-indigo-100 transition-all text-sm font-black uppercase tracking-tight"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Subject Classification</label>
                                        <select className="w-full h-16 px-6 rounded-2xl bg-gray-50 border-gray-50 focus:bg-white focus:border-indigo-100 transition-all text-sm font-black uppercase tracking-tight appearance-none">
                                            <option>ACQUISITION INQUIRY</option>
                                            <option>LOGISTICAL SUPPORT</option>
                                            <option>PARTNERSHIP PROPOSAL</option>
                                            <option>OTHER PROTOCOLS</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Manifest Content</label>
                                        <Textarea 
                                            required
                                            rows={6}
                                            placeholder="DESCRIBE YOUR REQUEST IN DETAIL..."
                                            className="rounded-3xl bg-gray-50 border-gray-50 focus:bg-white focus:border-indigo-100 transition-all text-sm font-black uppercase tracking-tight p-6 resize-none"
                                        />
                                    </div>
                                    <Button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-20 bg-black text-white hover:bg-gray-800 rounded-3xl text-[12px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-black/20 group"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        ) : (
                                            <span className="flex items-center gap-3">
                                                Transmit Message <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}