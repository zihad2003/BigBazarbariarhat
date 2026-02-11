import Link from 'next/link';
import { Search, Home, ArrowLeft } from 'lucide-react';

/**
 * Next.js 404 Not Found Page.
 * Premium design with helpful navigation options.
 */
export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-lg w-full text-center">
                {/* 404 Display */}
                <div className="relative mb-8">
                    <span className="text-[12rem] font-black text-gray-100 leading-none select-none">
                        404
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[1.5rem] flex items-center justify-center border border-indigo-100/50 shadow-xl shadow-indigo-500/10">
                            <Search className="h-8 w-8 text-indigo-500" />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-4">
                    Page Not Found
                </p>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">
                    Lost in the collection
                </h1>
                <p className="text-gray-500 font-medium text-lg mb-10 max-w-sm mx-auto">
                    The page you're looking for doesn't exist or has been moved to a new location.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95"
                    >
                        <Home className="h-4 w-4" />
                        Homepage
                    </Link>
                    <Link
                        href="/products"
                        className="flex items-center gap-3 px-8 py-4 bg-gray-50 text-gray-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Browse Products
                    </Link>
                </div>

                {/* Decorative elements */}
                <div className="mt-20 flex items-center justify-center gap-8">
                    <div className="w-20 h-1 rounded-full bg-gradient-to-r from-transparent to-gray-200" />
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                        Big Bazar Bariarhat
                    </span>
                    <div className="w-20 h-1 rounded-full bg-gradient-to-l from-transparent to-gray-200" />
                </div>
            </div>
        </div>
    );
}
