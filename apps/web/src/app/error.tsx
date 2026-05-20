'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('System Exception:', error);
    }, [error]);

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-white px-6 text-center select-none">
            <div className="space-y-4 max-w-md mx-auto">
                <h1 className="text-3xl md:text-4xl font-playfair font-semibold text-foreground tracking-tight">
                    Something went wrong
                </h1>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-sm mx-auto">
                    We had a problem loading this page. Please try again or return to the shop.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
                <Button 
                    onClick={() => reset()}
                    className="h-12 px-8 bg-black text-white hover:bg-gray-900 rounded-none text-xs uppercase tracking-widest font-semibold transition-all duration-300 flex items-center gap-2"
                >
                    <RotateCcw className="h-3.5 w-3.5" /> Try again
                </Button>
                <Link href="/">
                    <Button 
                        variant="outline" 
                        className="h-12 px-8 border-black text-black hover:bg-black hover:text-white rounded-none text-xs uppercase tracking-widest font-semibold transition-all duration-300 flex items-center gap-2"
                    >
                        Return to shop <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                </Link>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Code: {error.digest || 'BB-001'}
                </p>
            </div>
        </div>
    );
}
