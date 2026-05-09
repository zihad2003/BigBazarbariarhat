'use client';

import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
            <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                <div className="absolute inset-0 h-12 w-12 bg-indigo-600/10 rounded-full blur-xl animate-pulse" />
            </div>
            <p className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 animate-pulse">
                Loading Products...
            </p>
        </div>
    );
}
