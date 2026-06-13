'use client';

import Link from 'next/link';
import { ArrowLeft, Scale, FileText, ShieldAlert, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
    return (
        <div className="bg-white min-h-screen font-sans">
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                
                {/* Header */}
                <div className="mb-14">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-8 bg-neutral-300" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Legal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold text-neutral-900 tracking-tight">Terms of Service</h1>
                    <p className="text-neutral-400 text-xs mt-3">Last updated: June 2026</p>
                </div>

                <div className="space-y-10 bg-neutral-50 rounded-xl p-8 lg:p-12 border border-neutral-100">
                    
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center text-white">
                                <Scale className="h-4 w-4" />
                            </div>
                            <h2 className="text-base font-bold text-neutral-900">Orders & Payments</h2>
                        </div>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                            By placing an order on Big Bazar, you agree to provide accurate personal and payment information. We accept bKash, Nagad, and Cash on Delivery (COD). All prices are listed in Bangladeshi Taka (৳) and include applicable taxes unless stated otherwise.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center text-white">
                                <FileText className="h-4 w-4" />
                            </div>
                            <h2 className="text-base font-bold text-neutral-900">Shipping & Delivery</h2>
                        </div>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                            We ship across Bangladesh. Delivery within Mirsharai is free. For other areas, shipping charges apply as listed on our Shipping page. It is your responsibility to ensure someone is available at the delivery address to receive the order during the estimated delivery window.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center text-white">
                                <ShieldAlert className="h-4 w-4" />
                            </div>
                            <h2 className="text-base font-bold text-neutral-900">Returns & Liability</h2>
                        </div>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                            Please inspect all products upon delivery in front of the courier rider. Returns and exchanges are only accepted at the time of delivery. Once the rider leaves, we cannot process return requests. Big Bazar is not liable for delays caused by courier service disruptions, natural events, or incorrect delivery addresses provided by the customer.
                        </p>
                    </section>

                    <div className="p-6 bg-white rounded-xl border border-neutral-100">
                        <div className="flex gap-3">
                            <AlertCircle className="h-5 w-5 text-neutral-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-neutral-500 leading-relaxed">
                                By using the Big Bazar website and placing orders, you agree to these terms. We may update these terms from time to time — continued use of the site constitutes acceptance of any changes.
                            </p>
                        </div>
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