'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an analytics service
        console.error('System Exception:', error);
    }, [error]);

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
            <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center text-rose-500 mb-10 border border-rose-100 shadow-xl shadow-rose-500/5">
                <ShieldAlert className="h-10 w-10" />
            </div>
            
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-4">Protocol Interrupted</h1>
            <p className="text-gray-400 text-sm font-black uppercase tracking-widest max-w-md mx-auto leading-relaxed mb-12">
                A critical exception occurred in the transmission matrix. Our curators have been notified.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
                <Button 
                    onClick={() => reset()}
                    className="h-16 px-10 bg-black text-white hover:bg-gray-800 rounded-2xl text-[11px] font-black uppercase tracking-widest gap-3 shadow-2xl shadow-black/20"
                >
                    <RotateCcw className="h-4 w-4" /> Reset Protocol
                </Button>
                <Link href="/">
                    <Button variant="outline" className="h-16 px-10 border-gray-200 hover:bg-white rounded-2xl text-[11px] font-black uppercase tracking-widest gap-3">
                        <Home className="h-4 w-4" /> Return Home
                    </Button>
                </Link>
            </div>

            <div className="mt-20 pt-10 border-t border-gray-200/50 w-full max-w-xs">
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                    Exception Identifier: {error.digest || 'BB-UNKNOWN-PROTOCOL'}
                </p>
            </div>
        </div>
    );
}
