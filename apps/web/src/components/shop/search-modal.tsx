'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search as SearchIcon, X, TrendingUp, ArrowRight, ShoppingBag, Loader2, Tag, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/lib/stores/ui-store';
import { useDebounce } from '@/hooks/use-debounce';

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
    const [mounted, setMounted] = useState(false);
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isSearchOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';
            document.body.classList.add('drawer-open');
            return () => {
                document.body.style.overflow = originalStyle;
                document.body.classList.remove('drawer-open');
            };
        } else {
            setQuery('');
            setSearchResults({ products: [], categories: [], suggestions: [] });
        }
    }, [isSearchOpen]);

    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedQuery.trim().length < 2) {
                setSearchResults({ products: [], categories: [], suggestions: [] });
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
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

        fetchResults();
    }, [debouncedQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/products?search=${encodeURIComponent(query)}`);
            closeSearch();
        }
    };

    const hasResults = searchResults.products.length > 0 || searchResults.categories.length > 0 || searchResults.suggestions.length > 0;

    if (!mounted) return null;

    const modalContent = (
        <AnimatePresence>
            {isSearchOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-white z-[1000] flex flex-col"
                >
                    {/* Fixed Header Bar at Top */}
                    <div className="bg-white border-b border-slate-100 z-20 shrink-0">
                        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-4">
                            <form onSubmit={handleSearch} className="flex-1 relative flex items-center">
                                <SearchIcon className="absolute left-0 h-6 w-6 text-slate-400" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search products, categories..."
                                    aria-label="Search products"
                                    className="w-full bg-transparent pl-10 pr-10 py-2 text-xl md:text-3xl font-extrabold tracking-tight focus:outline-none placeholder:text-slate-200 text-slate-950"
                                />
                                {loading && (
                                    <div className="absolute right-2">
                                        <Loader2 className="h-5 w-5 text-primary animate-spin" />
                                    </div>
                                )}
                            </form>
                            <button
                                onClick={closeSearch}
                                className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-950"
                                aria-label="Close search"
                            >
                                <X className="h-7 w-7" />
                            </button>
                        </div>
                    </div>

                    {/* Independently Scrollable Results Body */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        <div className="max-w-4xl mx-auto px-6 py-10">
                            {query.trim().length > 0 ? (
                                <div className="space-y-12">
                                    {hasResults ? (
                                        <>
                                            {/* Search Suggestions */}
                                            {searchResults.suggestions.length > 0 && (
                                                <section>
                                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Related Suggestions</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {searchResults.suggestions.map((item) => (
                                                            <button
                                                                key={item}
                                                                onClick={() => setQuery(item)}
                                                                className="px-4 py-2 bg-slate-50 hover:bg-primary hover:text-white rounded-xl text-sm font-bold transition-all border border-slate-100"
                                                            >
                                                                {item}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </section>
                                            )}

                                            {/* Products Results List */}
                                            {searchResults.products.length > 0 && (
                                                <section>
                                                    <div className="flex items-center justify-between mb-6">
                                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Products found</h3>
                                                        <Link href={`/products?search=${query}`} onClick={closeSearch} className="text-primary font-black text-xs uppercase tracking-widest hover:underline">View All</Link>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {searchResults.products.map((item) => (
                                                            <Link
                                                                key={item.id}
                                                                href={`/products/${item.slug}`}
                                                                onClick={closeSearch}
                                                                className="group flex gap-4 p-4 rounded-2xl bg-slate-50/50 hover:bg-white transition-all border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-slate-100/50"
                                                            >
                                                                <div className="relative w-16 h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-sm transition-transform group-hover:scale-105">
                                                                    <Image
                                                                        src={item.images?.[0]?.url || '/placeholder.jpg'}
                                                                        alt={item.name}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col justify-center min-w-0">
                                                                    <h4 className="text-base font-black text-slate-900 group-hover:text-primary line-clamp-1 mb-1 transition-colors">
                                                                        {item.name}
                                                                    </h4>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="font-bold text-slate-900 text-lg">৳{(item.salePrice || item.basePrice).toLocaleString()}</span>
                                                                        {item.salePrice && <span className="text-xs text-slate-400 line-through">৳{item.basePrice.toLocaleString()}</span>}
                                                                    </div>
                                                                    <div className="flex items-center gap-1 mt-2 text-[10px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        Shop Now <ArrowRight className="h-3 w-3" />
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </section>
                                            )}

                                            {/* Categories Results */}
                                            {searchResults.categories.length > 0 && (
                                                <section>
                                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Matching Categories</h3>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        {searchResults.categories.map((item) => (
                                                            <Link
                                                                key={item.id}
                                                                href={`/category/${item.slug}`}
                                                                onClick={closeSearch}
                                                                className="group flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 hover:border-primary transition-all"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                                                        <Tag className="h-4 w-4 text-slate-600 group-hover:text-white" />
                                                                    </div>
                                                                    <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                                                                </div>
                                                                <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </section>
                                            )}
                                        </>
                                    ) : (
                                        !loading && (
                                            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                                    <Package className="h-6 w-6 text-slate-400" />
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-2">No products match "{query}"</h3>
                                                <p className="text-slate-500 max-w-xs mx-auto text-sm">Please double check your spelling or try more general words.</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-10 animate-in fade-in duration-500">
                                    {/* Trending Searches */}
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 bg-primary/5 rounded-xl flex items-center justify-center">
                                                <TrendingUp className="h-4 w-4 text-primary" />
                                            </div>
                                            <h3 className="text-lg font-black tracking-tight text-slate-900">Trending Searches</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2.5">
                                            {['Premium Silk Panjabi', 'Corporate Shirts', 'Royal Saree Collection', 'Festive Kids Wear', 'Winter Essential Vests', 'Artisan Accessories'].map((term) => (
                                                <button
                                                    key={term}
                                                    onClick={() => setQuery(term)}
                                                    className="px-5 py-3 bg-slate-50 hover:bg-primary hover:text-white rounded-xl text-sm font-bold transition-all border border-slate-100 text-slate-600"
                                                >
                                                    {term}
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Quick Links / Navigation Departments */}
                                    <section>
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Browse Departments</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                            {[
                                                { name: "Men's Wear", slug: 'men' },
                                                { name: "Women's Fashion", slug: 'women' },
                                                { name: "Kids' Collection", slug: 'kids' },
                                                { name: "Wedding Touch", slug: 'wedding-touch' },
                                            ].map((col) => (
                                                <Link
                                                    key={col.slug}
                                                    href={`/category/${col.slug}`}
                                                    onClick={closeSearch}
                                                    className="group p-5 rounded-2xl border border-slate-100 hover:border-primary hover:shadow-lg hover:shadow-slate-100/50 transition-all bg-white"
                                                >
                                                    <span className="text-sm font-extrabold text-slate-900 group-hover:text-primary transition-colors block mb-1">
                                                        {col.name}
                                                    </span>
                                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest group-hover:text-primary/70 transition-colors">Shop Department &rarr;</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}
