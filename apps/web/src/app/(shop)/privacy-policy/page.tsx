'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Eye, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-white min-h-screen font-sans">
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                
                {/* Header */}
                <div className="mb-14">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-8 bg-neutral-300" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Legal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold text-neutral-900 tracking-tight">Privacy Policy</h1>
                    <p className="text-neutral-400 text-xs mt-3">Last updated: June 2026</p>
                </div>

                <div className="space-y-10 bg-neutral-50 rounded-xl p-8 lg:p-12 border border-neutral-100">
                    
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center text-white">
                                <Eye className="h-4 w-4" />
                            </div>
                            <h2 className="text-base font-bold text-neutral-900">Information We Collect</h2>
                        </div>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                            When you place an order on Big Bazar, we collect your name, phone number, email address, and delivery address. This information is used solely to process and deliver your orders. We may also collect browsing data to improve your shopping experience.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center text-white">
                                <Lock className="h-4 w-4" />
                            </div>
                            <h2 className="text-base font-bold text-neutral-900">Data Security</h2>
                        </div>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                            Your personal data is stored securely and is never shared with third parties for marketing purposes. Payment information is processed through secure channels (bKash, Nagad) and we do not store any payment credentials on our servers.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center text-white">
                                <ShieldCheck className="h-4 w-4" />
                            </div>
                            <h2 className="text-base font-bold text-neutral-900">How We Use Your Data</h2>
                        </div>
                        <p className="text-neutral-500 text-sm leading-relaxed mb-3">
                            We do not sell or trade your personal information. Your data is used exclusively for:
                        </p>
                        <ul className="space-y-3 text-sm text-neutral-500">
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
                                <span>Processing and delivering your orders.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
                                <span>Keeping you updated on order status via SMS.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
                                <span>Improving your shopping experience on our website.</span>
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center text-white">
                                <UserCheck className="h-4 w-4" />
                            </div>
                            <h2 className="text-base font-bold text-neutral-900">Your Rights</h2>
                        </div>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                            You can request access to, correction of, or deletion of your personal data at any time by contacting us at infobigbazar01@gmail.com or calling 01857045449. We will process your request within 7 business days.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                            Questions about your privacy?
                        </p>
                        <Link href="/contact">
                            <Button variant="outline" className="rounded-xl h-11 px-8 text-[10px] font-black uppercase tracking-widest border-neutral-200">
                                Contact Us
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <Link href="/">
                        <Button variant="ghost" className="text-neutral-400 hover:text-neutral-900 text-[10px] font-black uppercase tracking-widest gap-2">
                            <ArrowLeft className="h-4 w-4" /> Back to Shop
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
