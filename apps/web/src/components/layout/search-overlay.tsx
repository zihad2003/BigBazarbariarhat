'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, ArrowRight, History, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/lib/stores/ui-store';
import { Button } from '@/components/ui/button';

const POPULAR_SEARCHES = ['Luxury Chrono', 'Silk Dress', 'Gold Necklace', 'Leather Bag', 'Minimalist Watch'];

export function SearchOverlay() {
    const { isSearchOpen, closeSearch } = useUIStore();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const [debouncedQuery, setDebouncedQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) setRecentSearches(JSON.parse(saved));
    }, []);

    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            inputRef.current.focus();
        }
        if (!isSearchOpen) {
            setQuery('');
            setResults([]);
        }
    }, [isSearchOpen]);

    useEffect(() => {
        const searchProducts = async () => {
            if (!debouncedQuery.trim()) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/products?q=${encodeURIComponent(debouncedQuery)}&limit=5`);
                const data = await res.json();
                if (data.success) {
                    setResults(data.data);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        searchProducts();
    }, [debouncedQuery]);

    const addToRecentSearches = (searchTerm: string) => {
        const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    const handleSearchSubmit = (e: React.FormEvent | string) => {
        if (typeof e !== 'string') e.preventDefault();
        const searchTerm = typeof e === 'string' ? e : query;

        if (searchTerm.trim()) {
            addToRecentSearches(searchTerm.trim());
            closeSearch();
            router.push(`/shop?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const clearRecent = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    return (
        <AnimatePresence>
            {isSearchOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeSearch}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[1000] cursor-zoom-out"
                    />
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                        className="fixed top-0 left-0 right-0 z-[1001] bg-white shadow-2xl overflow-hidden rounded-b-[3.5rem]"
                    >
                        <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
                            <form onSubmit={handleSearchSubmit} className="relative mb-12">
                                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 text-black stroke-[3]" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search our masterpieces..."
                                    className="w-full pl-16 pr-12 py-10 text-5xl md:text-7xl font-black text-black placeholder:text-gray-100 focus:outline-none bg-transparent tracking-tighter"
                                />
                                <button
                                    type="button"
                                    onClick={closeSearch}
                                    aria-label="Close search"
                                    className="absolute right-0 top-1/2 -translate-y-1/2 p-4 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-all duration-300"
                                >
                                    <X className="w-8 h-8" />
                                </button>
                                {loading && (
                                    <div className="absolute -bottom-2 left-16 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Curating results...</span>
                                    </div>
                                )}
                            </form>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                                {/* Left Sidebar: Recent & Popular */}
                                <div className="lg:col-span-4 space-y-12">
                                    {recentSearches.length > 0 && (
                                        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                                    <History className="w-3 h-3" /> Recent Searches
                                                </h3>
                                                <button onClick={clearRecent} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700">Clear</button>
                                            </div>
                                            <div className="space-y-2">
                                                {recentSearches.map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => handleSearchSubmit(s)}
                                                        className="block w-full text-left p-4 rounded-2xl hover:bg-gray-50 text-lg font-bold transition-all group border border-transparent hover:border-gray-100"
                                                    >
                                                        <span className="flex items-center justify-between">
                                                            {s}
                                                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-indigo-600" />
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                                            <TrendingUp className="w-3 h-3" /> Popular Right Now
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {POPULAR_SEARCHES.map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => handleSearchSubmit(s)}
                                                    className="px-6 py-3 rounded-full bg-gray-50 hover:bg-black hover:text-white text-sm font-black transition-all border border-gray-100"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Search Suggestions */}
                                <div className="lg:col-span-8">
                                    {query ? (
                                        <div className="min-h-[400px]">
                                            {loading && results.length === 0 ? (
                                                <div className="space-y-4">
                                                    {[...Array(3)].map((_, i) => (
                                                        <div key={i} className="h-32 bg-gray-50 rounded-3xl animate-pulse" />
                                                    ))}
                                                </div>
                                            ) : results.length > 0 ? (
                                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Product Suggestions</h3>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {results.map((product) => (
                                                            <Link
                                                                key={product.id}
                                                                href={`/products/${product.slug}`}
                                                                onClick={closeSearch}
                                                                className="flex items-center gap-6 p-4 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group border border-transparent hover:border-gray-100"
                                                            >
                                                                <div className="w-20 h-24 bg-white rounded-2xl overflow-hidden shrink-0 relative shadow-sm">
                                                                    <Image
                                                                        src={product.images?.[0]?.url || '/placeholder.png'}
                                                                        alt={product.name}
                                                                        fill
                                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                                    />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-black text-black group-hover:text-indigo-600 transition-colors truncate">{product.name}</h4>
                                                                    <p className="text-sm font-bold text-gray-400 mt-1">৳{(product.salePrice || product.basePrice || product.price || 0).toLocaleString()}</p>
                                                                    <div className="mt-2 flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Explore</span>
                                                                        <ArrowRight className="w-3 h-3 text-indigo-600" />
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                    <Link
                                                        href={`/shop?q=${encodeURIComponent(query)}`}
                                                        onClick={closeSearch}
                                                        className="mt-10 block w-full py-6 rounded-[2rem] bg-black text-white text-center font-black text-xl hover:bg-indigo-600 transition-all shadow-xl shadow-black/10"
                                                    >
                                                        See all {results.length}+ masterpieces found
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="text-center py-24 bg-gray-50 rounded-[3.5rem] border border-dashed border-gray-200">
                                                    <Search className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                                                    <h4 className="text-2xl font-black text-gray-400">Selection Not Found</h4>
                                                    <p className="text-gray-400 mt-2 font-medium">Your quest for "{query}" yielded no results.</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col justify-center items-center text-center p-12 bg-gray-50 rounded-[3.5rem] border border-gray-100">
                                            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-xl">
                                                <Search className="w-12 h-12 text-gray-100" />
                                            </div>
                                            <h4 className="text-3xl font-black tracking-tighter text-gray-900 mb-4">Start your exploration</h4>
                                            <p className="text-gray-500 max-w-sm text-lg font-medium font-playfair italic leading-relaxed">
                                                Discover our exclusive collections by typing above. We'll find the perfect masterpiece for you.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
