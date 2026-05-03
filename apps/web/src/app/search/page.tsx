'use client';

import { useState, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { MOCK_PRODUCTS } from '@/lib/mock-data/products';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import { useUIStore } from '@/lib/stores/ui-store';

export default function SearchResultsPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('relevance');

    const { addItem: addToCart } = useCartStore();
    const { toggleItem: toggleWishlist, hasItem: isInWishlist } = useWishlistStore();
    const { openCart, addNotification } = useUIStore();

    useEffect(() => {
        setIsLoading(true);
        // Mock search logic
        setTimeout(() => {
            let filtered = MOCK_PRODUCTS.filter(p => 
                p.name.toLowerCase().includes(query.toLowerCase()) || 
                p.category?.toLowerCase().includes(query.toLowerCase()) ||
                p.description?.toLowerCase().includes(query.toLowerCase())
            );

            if (selectedCategory !== 'all') {
                filtered = filtered.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
            }

            if (sortBy === 'price-low') filtered.sort((a, b) => (a.salePrice || a.basePrice) - (b.salePrice || b.basePrice));
            if (sortBy === 'price-high') filtered.sort((a, b) => (b.salePrice || b.basePrice) - (a.salePrice || a.basePrice));
            
            setResults(filtered);
            setIsLoading(false);
        }, 500);
    }, [query, selectedCategory, sortBy]);

    const handleAddToCart = (product: any) => {
        addToCart(product, 1);
        addNotification({ type: 'success', message: 'Artifact synchronized with curation.' });
        openCart();
    };

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
                        Identified {results.length} matching artifacts in the repository.
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
            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="space-y-6">
                            <div className="aspect-[3/4] bg-slate-50 rounded-[2.5rem] animate-pulse" />
                            <div className="h-4 w-2/3 bg-slate-50 rounded animate-pulse" />
                            <div className="h-4 w-1/3 bg-slate-50 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <AnimatePresence mode="popLayout">
                        {results.map((product) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group bg-white rounded-[2.5rem] border border-slate-50 overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-700"
                            >
                                <div className="relative aspect-[3/4] bg-slate-50 overflow-hidden">
                                    <Image src={product.images?.[0]?.url || '/placeholder.jpg'} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                                        <button 
                                            onClick={() => toggleWishlist(product)}
                                            className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg backdrop-blur-md",
                                                isInWishlist(product.id) ? "bg-red-500 text-white" : "bg-white/90 text-slate-400 hover:text-red-500"
                                            )}
                                        >
                                            <Heart className={cn("h-4 w-4", isInWishlist(product.id) && "fill-current")} />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                        <Button 
                                            onClick={() => handleAddToCart(product)}
                                            className="w-full h-14 bg-black/90 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl"
                                        >
                                            <Plus className="h-4 w-4 mr-2" /> Add to Curation
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h3 className="font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{product.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <span className="text-xl font-black text-slate-900 font-mono tracking-tighter">
                                            {formatPrice(product.salePrice || product.basePrice)}
                                        </span>
                                        <div className="flex items-center gap-1 text-amber-400">
                                            <Star className="h-3 w-3 fill-current" />
                                            <span className="text-[10px] font-black text-slate-900">4.8</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                        <SearchIcon className="h-10 w-10 text-slate-200" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Signal Not Found</h3>
                    <p className="text-slate-400 font-medium max-w-sm mx-auto mb-10">
                        We couldn't identify any artifacts matching your search criteria. Try a different sector or identification.
                    </p>
                    <Link href="/products">
                        <Button className="h-16 px-12 bg-black text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl">
                            Explore All Artifacts
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
