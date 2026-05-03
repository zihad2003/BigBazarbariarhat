'use client';

import Link from 'next/link';
import { ArrowLeft, Scale, FileText, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
    return (
        <div className="bg-[#fafafa] min-h-screen font-sans">
            <main className="max-w-4xl mx-auto px-6 py-12 lg:py-24">
                
                {/* Header */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-8 bg-black" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Legal Manifest</span>
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">Terms of Acquisition</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-4">Revision: 2026.04.01 | Status: Active</p>
                </div>

                <div className="space-y-12 bg-white rounded-[3rem] p-10 lg:p-16 border border-gray-100 shadow-sm">
                    
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white">
                                <Scale className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Transactional Protocol</h2>
                        </div>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            By initiating a transaction on the Big Bazar platform, you agree to comply with our acquisition protocols. This includes the provision of accurate identity markers and valid financial instruments.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white">
                                <FileText className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Logistical Obligations</h2>
                        </div>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Our logistical matrix guarantees the transit of artifacts to the provided coordinates. It is the curator's responsibility to ensure availability at the terminal during the estimated arrival window.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white">
                                <ShieldAlert className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Liability Limitation</h2>
                        </div>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Big Bazar Bariarhat is not liable for disruptions caused by regional logistical failures, temporal shifts, or unauthorized interventions in the delivery matrix once the artifact has left our central curation hub.
                        </p>
                    </section>

                    <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                        <div className="flex gap-4">
                            <AlertCircle className="h-6 w-6 text-indigo-600 shrink-0" />
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                                Continued use of the Big Bazar terminal constitutes an irrevocable acceptance of these terms and any subsequent revisions to the legal manifest.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <Link href="/">
                        <Button variant="ghost" className="text-gray-400 hover:text-black text-[10px] font-black uppercase tracking-widest gap-2">
                            <ArrowLeft className="h-4 w-4" /> Back to Storefront
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}