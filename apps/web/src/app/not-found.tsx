import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-white select-none">
            <div className="max-w-md w-full text-center">
                {/* 404 Display */}
                <div className="relative mb-6">
                    <span className="text-[10rem] md:text-[12rem] font-extralight text-gray-100 leading-none tracking-widest block select-none">
                        404
                    </span>
                </div>

                {/* Message */}
                <div className="space-y-3 mb-10">
                    <h1 className="text-3xl md:text-4xl font-playfair font-semibold text-foreground tracking-tight">
                        Lost in the collection
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-xs mx-auto">
                        The page you are looking for doesn't exist or has been moved to a new location.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/" className="w-full sm:w-auto">
                        <Button 
                            className="w-full sm:w-auto h-12 px-8 bg-black text-white hover:bg-gray-900 rounded-none text-xs uppercase tracking-widest font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Home className="h-3.5 w-3.5" /> Homepage
                        </Button>
                    </Link>
                    <Link href="/products" className="w-full sm:w-auto">
                        <Button 
                            variant="outline" 
                            className="w-full sm:w-auto h-12 px-8 border-black text-black hover:bg-black hover:text-white rounded-none text-xs uppercase tracking-widest font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" /> Browse products
                        </Button>
                    </Link>
                </div>

                {/* Footer text */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center w-full max-w-xs">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">
                        Big Bazar Bariarhat
                    </p>
                </div>
            </div>
        </div>
    );
}
