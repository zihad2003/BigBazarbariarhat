'use client';

import Link from 'next/link';
import { ArrowLeft, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CookiesPage() {
    return (
        <div className="bg-white min-h-screen font-sans text-neutral-900">
            <main className="max-w-xl mx-auto px-4 sm:px-6 py-20 lg:py-32 text-center">
                <div className="space-y-8 bg-neutral-50 rounded-xl p-8 lg:p-12 border border-neutral-100 shadow-sm flex flex-col items-center">
                    <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center text-white">
                        <Cookie className="h-5 w-5" />
                    </div>
                    
                    <div className="space-y-3">
                        <h1 className="text-3xl font-playfair font-bold text-neutral-900">
                            Cookie Settings
                        </h1>
                        <div className="h-0.5 w-12 bg-neutral-300 mx-auto" />
                    </div>

                    <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
                        We use essential cookies to make our store work. Dynamic cookie preferences control panel is currently under development.
                    </p>

                    <div className="pt-4">
                        <Link href="/">
                            <Button className="bg-neutral-900 hover:bg-neutral-800 text-white uppercase tracking-widest font-black text-[10px] px-8 h-12 rounded-xl transition-all">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Shop
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}