'use client';

import { useState, useEffect, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
    Search as SearchIcon, 
    Filter, 
    LayoutGrid, 
    List, 
    ChevronDown, 
    ArrowUpDown,
    Heart,
    ShoppingBag,
    Star,
    Plus
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn, formatPrice } from '@/lib/utils';
import { ProductGrid } from '@/components/shop/product-grid';

export default function SearchResultsPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('relevance');

    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        const categoryParam = selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
        const sortParam = sortBy !== 'relevance' ? `&sort=${sortBy}` : '';
        
        fetch(`/api/products?q=${encodeURIComponent(query)}${categoryParam}${sortParam}&limit=100`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setResults(data.data);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, [query, selectedCategory, sortBy]);

    return (
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 md:py-20">
            
            {/* Header */}
            <div className="flex flex-col gap-8 mb-16">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-8 bg-indigo-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Search Matrix</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                        Results for <span className="text-indigo-600">"{query}"</span>
                    </h1>
                    <p className="text-slate-400 font-medium mt-4 uppercase text-[11px] tracking-widest">
                        Found {results.length} matching items.
                    </p>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center justify-between gap-6 p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-slate-50 border border-slate-50 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none appearance-none cursor-pointer min-w-[160px] hover:bg-slate-100 transition-colors"
                        >
                            <option value="all">All Sectors</option>
                            <option value="electronics">Electronics</option>
                            <option value="clothing">Clothing</option>
                            <option value="home">Home & Living</option>
                        </select>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-slate-50 border border-slate-50 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none appearance-none cursor-pointer min-w-[160px] hover:bg-slate-100 transition-colors"
                        >
                            <option value="relevance">Relevance</option>
                            <option value="price-low">Value: Low to High</option>
                            <option value="price-high">Value: High to Low</option>
                            <option value="newest">Latest Entry</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" className="h-12 w-12 rounded-xl p-0 hover:bg-slate-50">
                            <LayoutGrid className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" className="h-12 w-12 rounded-xl p-0 hover:bg-slate-50 text-slate-300">
                            <List className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Grid */}
            {(isLoading || results.length > 0) ? (
                <ProductGrid products={results} isLoading={isLoading} />
            ) : (
                <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                        <SearchIcon className="h-10 w-10 text-slate-200" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">No Results</h3>
                    <p className="text-slate-400 font-medium max-w-sm mx-auto mb-10">
                        We couldn't find any items matching your search criteria.
                    </p>
                    <Link href="/products">
                        <Button className="h-16 px-12 bg-black text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl">
                            Explore All Products
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
