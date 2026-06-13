'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    ChevronDown,
    LayoutGrid,
    List,
    Search,
    SlidersHorizontal,
    X,
    Loader2,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUIStore } from '@/lib/stores/ui-store';
import { ProductGrid } from '@/components/shop/product-grid';
import { FilterSidebar } from '@/components/shop/filter-sidebar';
import { cn } from '@/lib/utils';
import type { Product, Category } from '@/types';
import ShopLoading from './loading';

interface ShopClientProps {
    initialProducts: any[];
    initialTotal: number;
    initialCategory: any | null;
    slug?: string;
}

export default function ShopClient({
    initialProducts,
    initialTotal,
    initialCategory,
    slug
}: ShopClientProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const [products, setProducts] = useState<any[]>(initialProducts);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [category, setCategory] = useState<any | null>(initialCategory);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);

    // Unified Filter State
    const [filters, setFilters] = useState<any>({
        sortBy: 'newest',
        q: '',
        category: slug,
        sizes: [],
        colors: [],
        brand: undefined,
        rating: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        page: 1
    });

    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: Math.ceil(initialTotal / 12) || 1,
        total: initialTotal
    });

    const isFirstMount = useRef(true);

    // Scroll to top when page changes
    useEffect(() => {
        if (isFirstMount.current) return;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [filters.page]);

    const { addProduct } = useCartStore();
    const { openCart, addNotification } = useUIStore();

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (filters.category) queryParams.append('category', filters.category);
            if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
            if (filters.q) queryParams.append('q', filters.q);
            if (filters.brand) queryParams.append('brand', filters.brand);
            if (filters.rating) queryParams.append('rating', filters.rating.toString());
            if (filters.sizes?.length > 0) queryParams.append('sizes', filters.sizes.join(','));
            if (filters.colors?.length > 0) queryParams.append('colors', filters.colors.join(','));
            if (filters.minPrice !== undefined) queryParams.append('minPrice', filters.minPrice.toString());
            if (filters.maxPrice !== undefined) queryParams.append('maxPrice', filters.maxPrice.toString());
            queryParams.append('page', filters.page.toString());

            const res = await fetch(`/api/products?${queryParams.toString()}`);
            const result = await res.json();
            if (result.success) {
                setProducts(result.data);
                setPagination({
                    page: result.pagination.page,
                    totalPages: result.pagination.totalPages,
                    total: result.pagination.total
                });

                if (result.data.length === 0) {
                    const suggRes = await fetch('/api/products?featured=true&limit=4');
                    const suggResult = await suggRes.json();
                    if (suggResult.success) setSuggestions(suggResult.data);
                }
            }

            if (slug && !category) {
                const catRes = await fetch(`/api/categories?slug=${slug}`);
                const catResult = await catRes.json();
                if (catResult.success && catResult.data.length > 0) setCategory(catResult.data[0]);
            }
        } catch (error) {
            console.error('Failed to fetch shop data:', error);
        } finally {
            setLoading(false);
        }
    }, [filters, slug, category]);

    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }
        fetchProducts();
    }, [fetchProducts]);

    const handleFilterChange = (newFilters: any) => {
        setFilters((prev: any) => ({ ...prev, ...newFilters, page: 1 }));
    };

    const clearFilters = () => {
        setFilters({
            sortBy: 'newest',
            q: '',
            category: slug,
            sizes: [],
            colors: [],
            brand: undefined,
            rating: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            page: 1
        });
    };

    const removeFilter = (key: string, value?: string) => {
        if (value) {
            setFilters((prev: any) => ({
                ...prev,
                [key]: prev[key].filter((v: string) => v !== value),
                page: 1
            }));
        } else {
            setFilters((prev: any) => ({ ...prev, [key]: undefined, page: 1 }));
        }
    };

    const activeFilterTags = useMemo(() => {
        const tags: { label: string; key: string; value?: string }[] = [];
        if (filters.q) tags.push({ label: `Search: ${filters.q}`, key: 'q' });
        if (filters.brand) tags.push({ label: `Brand: ${filters.brand}`, key: 'brand' });
        if (filters.rating) tags.push({ label: `${filters.rating}+ Stars`, key: 'rating' });
        if (filters.minPrice || filters.maxPrice) {
            tags.push({ label: `Price: ৳${filters.minPrice || 0} - ৳${filters.maxPrice || 50000}`, key: 'priceRange' });
        }
        filters.sizes?.forEach((s: string) => tags.push({ label: `Size: ${s}`, key: 'sizes', value: s }));
        filters.colors?.forEach((c: string) => tags.push({ label: `Color: ${c}`, key: 'colors', value: c }));
        return tags;
    }, [filters]);

    if (!mounted) {
        return <ShopLoading />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-neutral-400 mb-4 font-bold uppercase tracking-widest text-[10px]">
                        <Link href="/" className="hover:text-black transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
                        {category && (
                            <>
                                <span>/</span>
                                <span className="text-neutral-900">{category.name}</span>
                            </>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold text-neutral-900 mb-4 tracking-tight">
                        {category ? category.name : 'Our Store'}
                    </h1>
                    <p className="text-neutral-500 max-w-2xl text-base leading-relaxed">
                        {category?.description || 'Explore our exclusive range of handpicked items designed to elevate your everyday experience.'}
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-1 md:w-96 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search our collection..."
                            value={filters.q}
                            onChange={(e) => handleFilterChange({ q: e.target.value })}
                            className="w-full pl-12 pr-4 h-12 bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-neutral-300 rounded-xl text-sm focus:outline-none transition-all placeholder:text-neutral-400 text-neutral-900"
                        />
                    </div>
                    <Button
                        variant="outline"
                        className={cn(
                            "rounded-xl gap-2 h-12 px-5 font-bold text-sm border transition-all",
                            showFilters ? "bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800" : "bg-white text-neutral-900 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                        )}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                    </Button>
                </div>
            </div>

            {/* Active Filter Tags */}
            {activeFilterTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mr-2">Refining by:</span>
                    {activeFilterTags.map((tag, i) => (
                        <Badge
                            key={`${tag.key}-${i}`}
                            variant="secondary"
                            className="bg-neutral-50 text-neutral-900 px-4 py-2 rounded-xl border border-neutral-200 flex items-center gap-3 text-sm font-bold group hover:bg-neutral-900 hover:text-white transition-all cursor-pointer"
                            onClick={() => removeFilter(tag.key, tag.value)}
                        >
                            {tag.label}
                            <X className="h-3.5 w-3.5 text-neutral-400 group-hover:text-white" />
                        </Badge>
                    ))}
                    <button
                        onClick={clearFilters}
                        className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors ml-4"
                    >
                        Clear all
                    </button>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Mobile Filters Drawer Overlay */}
                {showFilters && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] lg:hidden animate-in fade-in duration-300" onClick={() => setShowFilters(false)} />
                )}

                {/* Filters Sidebar */}
                <aside className={`
                    fixed lg:sticky top-32 inset-y-0 left-0 w-[85vw] max-w-sm lg:w-80 bg-white lg:bg-transparent z-[120] lg:z-0
                    p-8 lg:p-0 transition-all duration-500 ease-luxury h-[100vh] lg:h-auto overflow-y-auto
                    ${showFilters ? 'translate-x-0 opacity-100' : '-translate-x-full lg:hidden opacity-0'}
                `}>
                    <div className="flex items-center justify-between lg:hidden mb-12">
                        <h2 className="text-2xl font-bold tracking-tight">Filters</h2>
                        <button onClick={() => setShowFilters(false)} className="p-3 bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <FilterSidebar
                        activeFilters={filters}
                        onFilterChange={handleFilterChange}
                        onClearAll={clearFilters}
                    />
                </aside>

                {/* Main Products Grid */}
                <main className="flex-1">
                    {/* Sorting & Toolbar */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
                        <div className="flex items-center gap-4">
                            {loading && <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />}
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest hidden sm:inline">Sort:</span>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                                    className="text-xs font-bold focus:outline-none bg-transparent cursor-pointer h-10 border-b border-neutral-100 hover:border-black transition-all"
                                >
                                    <option value="newest">Latest Arrivals</option>
                                    <option value="popular">Most Popular</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-1.5 p-1 bg-neutral-50 rounded-xl border border-neutral-100 shadow-inner">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={cn(
                                        "p-2 rounded-lg transition-all",
                                        viewMode === 'grid' ? "bg-white shadow-sm text-neutral-900" : "text-neutral-400 hover:text-neutral-600"
                                    )}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={cn(
                                        "p-2 rounded-lg transition-all",
                                        viewMode === 'list' ? "bg-white shadow-sm text-neutral-900" : "text-neutral-400 hover:text-neutral-600"
                                    )}
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <ProductGrid products={products} isLoading={loading && products.length === 0} viewMode={viewMode} />

                    {(!loading && products.length === 0) && (
                        <div className="animate-in fade-in zoom-in-95 duration-700">
                            <div className="text-center py-24 bg-neutral-50 rounded-xl border border-neutral-100 shadow-inner px-8">
                                <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-neutral-100 relative group overflow-hidden">
                                    <div className="absolute inset-0 bg-emerald-50 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full opacity-5" />
                                    <Search className="h-8 w-8 text-neutral-400 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h2 className="text-2xl font-bold font-playfair text-neutral-900 mb-4">No Products Found</h2>
                                <p className="text-neutral-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                                    We couldn't find any items matching your selected filters. Try broadening your search or resetting the filters.
                                </p>
                                <Button
                                    variant="outline"
                                    className="rounded-xl font-bold px-8 h-12 text-xs uppercase tracking-wider bg-neutral-900 hover:bg-neutral-800 text-white border-none transition-all shadow-md"
                                    onClick={clearFilters}
                                >
                                    Reset Filters
                                </Button>
                            </div>

                            {suggestions.length > 0 && (
                                <div className="mt-20">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-2xl font-playfair font-bold text-neutral-900">Suggested for You</h3>
                                        <Link href="/shop" className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all group text-sm">
                                            See All Collections <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {suggestions.map((product) => (
                                            <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                                                <div className="aspect-[3/4] relative rounded-xl overflow-hidden mb-4 shadow-sm border border-neutral-100">
                                                    <Image src={product.images?.[0]?.url || '/placeholder.png'} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                                </div>
                                                <h4 className="font-bold text-sm text-neutral-900 group-hover:text-emerald-600 transition-colors mb-1 truncate">{product.name}</h4>
                                                <div className="text-sm font-semibold text-neutral-500">৳{(product.basePrice || 0).toLocaleString()}</div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {!loading && products.length > 0 && pagination.totalPages > 1 && (
                        <div className="mt-16 flex items-center justify-center gap-3">
                            <Button
                                variant="outline"
                                className="rounded-xl border h-11 w-11 p-0 hover:bg-neutral-900 hover:text-white transition-all border-neutral-200 disabled:opacity-30"
                                disabled={filters.page === 1}
                                onClick={() => handleFilterChange({ page: filters.page - 1 })}
                            >
                                <ChevronDown className="h-5 w-5 rotate-90" />
                            </Button>

                            <div className="flex items-center gap-2 bg-neutral-50 p-1.5 rounded-xl border border-neutral-100">
                                {[...Array(pagination.totalPages)].map((_, i) => (
                                    <Button
                                        key={i}
                                        variant={filters.page === i + 1 ? 'default' : 'ghost'}
                                        className={cn(
                                            "rounded-xl h-9 w-9 p-0 text-sm font-bold transition-all duration-300",
                                            filters.page === i + 1 ? "bg-neutral-900 text-white shadow-md" : "text-neutral-400 hover:text-neutral-900 hover:bg-white"
                                        )}
                                        onClick={() => handleFilterChange({ page: i + 1 })}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                className="rounded-xl border h-11 w-11 p-0 hover:bg-neutral-900 hover:text-white transition-all border-neutral-200 disabled:opacity-30"
                                disabled={filters.page === pagination.totalPages}
                                onClick={() => handleFilterChange({ page: filters.page + 1 })}
                            >
                                <ChevronDown className="h-5 w-5 -rotate-90" />
                            </Button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
