'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-[#fafafa] min-h-screen font-sans">
            <main className="max-w-4xl mx-auto px-6 py-12 lg:py-24">
                
                {/* Header */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-8 bg-black" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Legal Manifest</span>
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">Privacy Protocol</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-4">Revision: 2026.04.01 | Status: Active</p>
                </div>

                <div className="space-y-12 bg-white rounded-[3rem] p-10 lg:p-16 border border-gray-100 shadow-sm">
                    
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Data Sovereignty</h2>
                        </div>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            At Big Bazar Bariarhat, we recognize that your personal data is a critical asset. Our protocol is designed to ensure that you maintain sovereignty over your information at all times. We only collect the data necessary to facilitate artifact acquisition and logistical synchronization.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <Lock className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Security Encryption</h2>
                        </div>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            All transmissions within the Big Bazar network are protected by 256-bit SSL encryption. Your financial instruments and identity markers are stored in isolated, air-gapped security modules to prevent unauthorized access.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <Eye className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Transparency Manifest</h2>
                        </div>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            We do not participate in the trade of consumer profiles. Your data is used exclusively for:
                        </p>
                        <ul className="space-y-4 text-gray-500 font-medium pl-4">
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                                <span>Logistical coordination of your artifacts.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                                <span>Synchronization of your curation history.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                                <span>Optimization of the storefront experience.</span>
                            </li>
                        </ul>
                    </section>

                    <div className="pt-12 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-8">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Questions regarding the legal manifest?
                        </p>
                        <Link href="/contact">
                            <Button variant="outline" className="rounded-xl h-12 px-8 text-[10px] font-black uppercase tracking-widest border-gray-100">
                                Contact Legal Hub
                            </Button>
                        </Link>
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
