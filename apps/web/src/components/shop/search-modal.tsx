'use client';

import { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, TrendingUp, ArrowRight, ShoppingBag, Star, Loader2, Sparkles, Tag, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/lib/stores/ui-store';

export function SearchModal() {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{
        products: any[],
        categories: any[],
        suggestions: string[]
    }>({ products: [], categories: [], suggestions: [] });
    const [loading, setLoading] = useState(false);
    const { isSearchOpen, closeSearch } = useUIStore();
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (isSearchOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isSearchOpen]);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim().length < 2) {
                setSearchResults({ products: [], categories: [], suggestions: [] });
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const result = await res.json();
                if (result.success) {
                    setSearchResults(result.data);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/shop?q=${encodeURIComponent(query)}`);
            closeSearch();
        }
    };

    const hasResults = searchResults.products.length > 0 || searchResults.categories.length > 0 || searchResults.suggestions.length > 0;

    return (
        <AnimatePresence>
            {isSearchOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-white z-[100] overflow-y-auto"
                >
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        {/* Search Header */}
                        <div className="flex items-center gap-6 py-10 border-b border-gray-100">
                            <form onSubmit={handleSearch} className="flex-1 relative group">
                                <SearchIcon className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 group-focus-within:text-black transition-colors" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search for masterpieces..."
                                    className="w-full bg-transparent pl-16 pr-4 py-4 text-5xl font-black tracking-tighter focus:outline-none placeholder:text-gray-200"
                                />
                                {loading && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                                        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                                    </div>
                                )}
                            </form>
                            <button
                                onClick={closeSearch}
                                className="p-4 hover:bg-gray-50 rounded-full transition-all group"
                            >
                                <X className="h-10 w-10 text-gray-400 group-hover:text-black group-hover:rotate-90 transition-all duration-300" />
                            </button>
                        </div>

                        {/* Search Content */}
                        <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-20">
                            {/* Suggestions & Results */}
                            <div className="lg:col-span-8">
                                {query.trim().length > 0 ? (
                                    <div className="space-y-16">
                                        {hasResults ? (
                                            <>
                                                {/* Suggestions List */}
                                                {searchResults.suggestions.length > 0 && (
                                                    <section>
                                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Suggestions</h3>
                                                        <div className="flex flex-wrap gap-3">
                                                            {searchResults.suggestions.map((item) => (
                                                                <button
                                                                    key={item}
                                                                    onClick={() => setQuery(item)}
                                                                    className="px-6 py-3 bg-gray-50 hover:bg-black hover:text-white rounded-2xl text-base font-bold transition-all border border-gray-100"
                                                                >
                                                                    {item}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </section>
                                                )}

                                                {/* Products Grid */}
                                                {searchResults.products.length > 0 && (
                                                    <section>
                                                        <div className="flex items-center justify-between mb-8">
                                                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Featured Products</h3>
                                                            <Link href={`/shop?q=${query}`} onClick={closeSearch} className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">View All</Link>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                                            {searchResults.products.map((item) => (
                                                                <Link
                                                                    key={item.id}
                                                                    href={`/products/${item.slug}`}
                                                                    onClick={closeSearch}
                                                                    className="group flex gap-6 p-6 rounded-[2.5rem] bg-gray-50/50 hover:bg-white transition-all border border-transparent hover:border-gray-100 hover:shadow-2xl"
                                                                >
                                                                    <div className="relative w-28 h-36 bg-white rounded-2xl overflow-hidden shrink-0 border border-gray-100 shadow-sm transition-transform group-hover:scale-105">
                                                                        <Image
                                                                            src={item.images?.[0]?.url || '/placeholder.jpg'}
                                                                            alt={item.name}
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                    </div>
                                                                    <div className="flex flex-col justify-center min-w-0">
                                                                        <h3 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 line-clamp-2 mb-2 transition-colors">
                                                                            {item.name}
                                                                        </h3>
                                                                        <div className="flex items-center gap-4">
                                                                            <span className="font-black text-2xl">৳{(item.salePrice || item.basePrice).toLocaleString()}</span>
                                                                            {item.salePrice && <span className="text-sm text-gray-400 line-through">৳{item.basePrice.toLocaleString()}</span>}
                                                                        </div>
                                                                        <div className="flex items-center gap-2 mt-4 text-xs font-black text-indigo-400 uppercase tracking-widest">
                                                                            Secure Discovery <ArrowRight className="h-3 w-3" />
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </section>
                                                )}

                                                {/* Categories List */}
                                                {searchResults.categories.length > 0 && (
                                                    <section>
                                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Departments</h3>
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                                            {searchResults.categories.map((item) => (
                                                                <Link
                                                                    key={item.id}
                                                                    href={`/category/${item.slug}`}
                                                                    onClick={closeSearch}
                                                                    className="group flex items-center justify-between p-6 rounded-2xl bg-white border border-gray-100 hover:border-black transition-all"
                                                                >
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                                                            <Tag className="h-5 w-5" />
                                                                        </div>
                                                                        <span className="font-black text-gray-900">{item.name}</span>
                                                                    </div>
                                                                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </section>
                                                )}
                                            </>
                                        ) : (
                                            !loading && (
                                                <div className="text-center py-32 bg-gray-50 rounded-[4rem] border border-dashed border-gray-200">
                                                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                                                        <Package className="h-10 w-10 text-gray-200" />
                                                    </div>
                                                    <h3 className="text-3xl font-black text-gray-900 mb-4">No matches for "{query}"</h3>
                                                    <p className="text-gray-500 max-w-sm mx-auto text-lg font-medium">Try checking your spelling or use more general terms to find what you seek.</p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-20">
                                        {/* Trending Searches */}
                                        <section>
                                            <div className="flex items-center gap-4 mb-10">
                                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                                                    <TrendingUp className="h-6 w-6 text-indigo-600" />
                                                </div>
                                                <h3 className="text-3xl font-black tracking-tight">Popular Inquiries</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-4">
                                                {['Premium Silk Panjabi', 'Corporate Shirts', 'Royal Saree Collection', 'Festive Kids Wear', 'Winter Essential Vests', 'Artisan Accessories'].map((term) => (
                                                    <button
                                                        key={term}
                                                        onClick={() => setQuery(term)}
                                                        className="px-8 py-4 bg-gray-50 hover:bg-white hover:shadow-xl hover:border-gray-200 rounded-2xl text-lg font-bold transition-all border border-gray-50"
                                                    >
                                                        {term}
                                                    </button>
                                                ))}
                                            </div>
                                        </section>

                                        {/* Recent Collections */}
                                        <section>
                                            <div className="flex items-center gap-4 mb-10">
                                                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                                                    <Sparkles className="h-6 w-6 text-purple-600" />
                                                </div>
                                                <h3 className="text-3xl font-black tracking-tight">Curated Vaults</h3>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                                {[
                                                    { name: "The Men's Vault", image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc', slug: 'men' },
                                                    { name: "Signature Women", image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5', slug: 'women' },
                                                    { name: "Heirloom Kids", image: 'https://images.unsplash.com/photo-1519704253435-0f62243d4c5d', slug: 'kids' },
                                                ].map((col) => (
                                                    <Link
                                                        key={col.slug}
                                                        href={`/category/${col.slug}`}
                                                        onClick={closeSearch}
                                                        className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl"
                                                    >
                                                        <Image
                                                            src={col.image}
                                                            alt={col.name}
                                                            fill
                                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                                        <div className="absolute bottom-8 left-8">
                                                            <span className="text-2xl font-black text-white group-hover:translate-x-3 transition-transform block">
                                                                {col.name}
                                                            </span>
                                                            <span className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em] mt-2 block">Enterprise Collection</span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                )}
                            </div>

                            {/* Promotional Sidebar */}
                            <div className="lg:col-span-4 space-y-10">
                                <div className="bg-black rounded-[3rem] p-12 text-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/30 rounded-full blur-[80px]" />
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-10">
                                            <ShoppingBag className="h-8 w-8 text-white" />
                                        </div>
                                        <h4 className="text-4xl font-black mb-6 leading-tight">Privileged Acquisition.</h4>
                                        <p className="text-gray-400 mb-10 font-medium text-lg">Secure a <span className="text-white font-black underline underline-offset-8">20% premium discount</span> on your initial curation.</p>
                                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl mb-12">
                                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] block mb-2">Access Token</span>
                                            <span className="text-2xl font-mono font-black text-indigo-400 tracking-widest">WELCOME20</span>
                                        </div>
                                        <Button className="w-full bg-white text-black hover:bg-gray-100 rounded-2xl h-16 px-8 font-black text-base shadow-xl active:scale-[0.98] transition-all">
                                            Initiate Discovery
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-[3rem] p-10 border border-gray-100">
                                    <h4 className="text-2xl font-black mb-6">Expert Concierge</h4>
                                    <div className="space-y-6">
                                        <p className="text-gray-500 font-medium leading-relaxed">
                                            Seeking a specific masterpiece or require tailoring guidance? Our curators are on standby for your inquiry.
                                        </p>
                                        <Link href="/contact" className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/5" onClick={closeSearch}>
                                            Connect Now <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
