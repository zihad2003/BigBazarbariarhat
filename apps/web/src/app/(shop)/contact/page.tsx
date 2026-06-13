'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe, Loader2 } from 'lucide-react';
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
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setSubmitted(true);
    };

    return (
        <div className="bg-white min-h-screen font-sans">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                
                {/* Header */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-8 bg-neutral-300" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Get In Touch</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-playfair font-bold text-neutral-900 tracking-tight leading-tight">Contact Us</h1>
                    <p className="text-neutral-500 mt-4 max-w-lg text-sm leading-relaxed">
                        Have a question about an order, need styling help, or want to collaborate? We&apos;d love to hear from you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    
                    {/* Contact Info */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-neutral-900 text-white rounded-xl p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[4rem] -mr-8 -mt-8" />
                            
                            <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-10">Store Information</h3>
                            
                            <div className="space-y-8 relative z-10">
                                <div className="flex items-start gap-5">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/60 shrink-0">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Our Store</p>
                                        <p className="text-sm font-semibold tracking-tight">Bariarhat Central Plaza<br />Mirsharai, Chittagong</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/60 shrink-0">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Email</p>
                                        <p className="text-sm font-semibold tracking-tight">infobigbazar01@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/60 shrink-0">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Phone</p>
                                        <p className="text-sm font-semibold tracking-tight">01857045449</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-white border border-neutral-100 rounded-xl flex flex-col items-center text-center group hover:border-neutral-300 transition-all">
                                <Globe className="h-5 w-5 text-neutral-300 group-hover:text-neutral-900 mb-3 transition-colors" />
                                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">Social Media</span>
                                <span className="text-xs font-bold text-neutral-900 mt-1.5 uppercase tracking-tight">@BIGBAZAR_BD</span>
                            </div>
                            <div className="p-6 bg-white border border-neutral-100 rounded-xl flex flex-col items-center text-center group hover:border-neutral-300 transition-all">
                                <MessageSquare className="h-5 w-5 text-neutral-300 group-hover:text-neutral-900 mb-3 transition-colors" />
                                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">Customer Support</span>
                                <span className="text-xs font-bold text-neutral-900 mt-1.5 uppercase tracking-tight">LIVE CHAT 24/7</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-neutral-50 rounded-xl p-8 lg:p-12 border border-neutral-100">
                            {submitted ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-16"
                                >
                                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Send className="h-8 w-8" />
                                    </div>
                                    <h2 className="text-2xl font-playfair font-bold text-neutral-900 mb-3">Message Sent!</h2>
                                    <p className="text-neutral-500 text-sm mb-8">We&apos;ll get back to you within 24 hours.</p>
                                    <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-xl h-11 px-6 text-[10px] font-black uppercase tracking-widest border-neutral-200">
                                        Send Another Message
                                    </Button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Full Name</label>
                                            <Input 
                                                required
                                                placeholder="Enter your name"
                                                className="h-12 rounded-xl bg-white border-neutral-200 focus:border-neutral-900 transition-all text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Email Address</label>
                                            <Input 
                                                required
                                                type="email"
                                                placeholder="your@email.com"
                                                className="h-12 rounded-xl bg-white border-neutral-200 focus:border-neutral-900 transition-all text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Subject</label>
                                        <select className="w-full h-12 px-4 rounded-xl bg-white border border-neutral-200 focus:border-neutral-900 transition-all text-sm appearance-none">
                                            <option>Order Inquiry</option>
                                            <option>Shipping & Delivery</option>
                                            <option>Returns & Exchange</option>
                                            <option>Partnership</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Message</label>
                                        <Textarea 
                                            required
                                            rows={5}
                                            placeholder="How can we help you?"
                                            className="rounded-xl bg-white border-neutral-200 focus:border-neutral-900 transition-all text-sm p-4 resize-none"
                                        />
                                    </div>
                                    <Button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-14 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] group"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Send Message <Send className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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