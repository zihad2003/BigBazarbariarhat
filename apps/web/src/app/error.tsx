'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { logger } from '@/lib/logger';

/**
 * Next.js App-level Error Page.
 * Automatically catches errors from any route segment and displays a premium fallback.
 */
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error
        logger.error('Unhandled route error', {
            name: error.name,
            message: error.message,
            digest: error.digest,
        });
    }, [error]);

    const isDev = process.env.NODE_ENV === 'development';

    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-lg w-full text-center">
                {/* Animated Error Icon */}
                <div className="relative mx-auto w-28 h-28 mb-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-orange-500/20 rounded-[2.5rem] blur-2xl animate-pulse" />
                    <div className="relative w-28 h-28 bg-gradient-to-br from-rose-50 to-orange-50 rounded-[2.5rem] flex items-center justify-center border border-rose-100/50 shadow-xl shadow-rose-500/10">
                        <AlertTriangle className="h-12 w-12 text-rose-500" />
                    </div>
                </div>

                {/* Error Message */}
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-4">
                    Something Went Wrong
                </p>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">
                    We hit an unexpected error
                </h1>
                <p className="text-gray-500 font-medium text-lg mb-8 max-w-sm mx-auto">
                    Don't worry — your data is safe. Please try again or head back to the homepage.
                </p>

                {/* Dev Error Details */}
                {isDev && (
                    <div className="mb-8 p-5 bg-gray-900 rounded-2xl border border-gray-800 text-left overflow-hidden">
                        <div className="flex items-center gap-2 mb-3">
                            <Bug className="h-4 w-4 text-rose-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">
                                Development Error
                            </span>
                        </div>
                        <p className="text-rose-300 font-mono text-sm break-all">
                            {error.name}: {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-gray-500 text-xs mt-2 font-mono">
                                Digest: {error.digest}
                            </p>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={reset}
                        className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                    <a
                        href="/"
                        className="flex items-center gap-3 px-8 py-4 bg-gray-50 text-gray-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
                    >
                        <Home className="h-4 w-4" />
                        Go Home
                    </a>
                </div>
            </div>
        </div>
    );
}
