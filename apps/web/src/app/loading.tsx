import { Loader2 } from 'lucide-react';

/**
 * Global loading state shown during route transitions.
 * Premium animated spinner with brand identity.
 */
export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
            <div className="text-center">
                {/* Animated loader */}
                <div className="relative mx-auto w-20 h-20 mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-[1.5rem] blur-xl animate-pulse" />
                    <div className="relative w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center border border-gray-100 shadow-lg">
                        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                    </div>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">
                    Loading Masterpieces
                </p>
            </div>
        </div>
    );
}
