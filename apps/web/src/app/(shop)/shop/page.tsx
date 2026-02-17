'use client';

import { useState, useEffect, useCallback, use, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    ChevronDown,
    LayoutGrid,
    List,
    Search,
    SlidersHorizontal,
    X,
    Star,
    ShoppingBag,
    Heart,
    Loader2,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@bigbazar/shared';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { ProductCard } from '@/components/shop/product-card';
import { ProductGrid } from '@/components/shop/product-grid';
import { FilterSidebar } from '@/components/shop/filter-sidebar';
import { cn } from '@/lib/utils';
import type { Product, Category } from '@/types';

export default function ShopPage({ params: paramsPromise }: { params: Promise<{ slug?: string }> }) {
    const params = use(paramsPromise);
    const [products, setProducts] = useState<Product[]>([]);
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);

    // Unified Filter State
    const [filters, setFilters] = useState<any>({
        sortBy: 'newest',
        q: '',
        category: params.slug,
        sizes: [],
        colors: [],
        brand: undefined,
        rating: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        page: 1
    });

    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

    const { addItem } = useCartStore();
    const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();
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

                // If no results, fetch suggestions (featured products)
                if (result.data.length === 0) {
                    const suggRes = await fetch('/api/products?featured=true&limit=4');
                    const suggResult = await suggRes.json();
                    if (suggResult.success) setSuggestions(suggResult.data);
                }
            }

            if (params.slug && !category) {
                const catRes = await fetch(`/api/categories?slug=${params.slug}`);
                const catResult = await catRes.json();
                if (catResult.success && catResult.data.length > 0) setCategory(catResult.data[0]);
            }
        } catch (error) {
            console.error('Failed to fetch shop data:', error);
        } finally {
            setLoading(false);
        }
    }, [filters, params.slug, category]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleFilterChange = (newFilters: any) => {
        setFilters((prev: any) => ({ ...prev, ...newFilters, page: 1 }));
    };

    const clearFilters = () => {
        setFilters({
            sortBy: 'newest',
            q: '',
            category: params.slug,
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

    const handleAddToCart = (product: Product) => {
        addItem(product as any, 1);
        addNotification({
            type: 'success',
            message: `${product.name} added to cart`,
        });
        openCart();
    };

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 font-bold uppercase tracking-widest text-[10px]">
                        <Link href="/" className="hover:text-black transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
                        {category && (
                            <>
                                <span>/</span>
                                <span className="text-black">{category.name}</span>
                            </>
                        )}
                    </div>
                    <h1 className="text-6xl font-black text-gray-900 mb-4 tracking-tighter">
                        {category ? category.name : 'Our Store'}
                    </h1>
                    <p className="text-gray-500 max-w-2xl text-xl font-medium leading-relaxed">
                        {category?.description || 'Explore our exclusive range of high-performance items designed to elevate your everyday experience.'}
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-1 md:w-96 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Search masterpieces..."
                            value={filters.q}
                            onChange={(e) => handleFilterChange({ q: e.target.value })}
                            className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-[1.5rem] text-lg focus:outline-none transition-all shadow-sm"
                        />
                    </div>
                    <Button
                        variant="outline"
                        className={cn(
                            "rounded-2xl gap-3 h-16 px-8 font-black text-lg border-2 transition-all",
                            showFilters ? "bg-black text-white border-black" : "hover:border-black"
                        )}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <SlidersHorizontal className="h-5 w-5" />
                        Filters
                    </Button>
                </div>
            </div>

            {/* Active Filter Tags */}
            {activeFilterTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Refining by:</span>
                    {activeFilterTags.map((tag, i) => (
                        <Badge
                            key={`${tag.key}-${i}`}
                            variant="secondary"
                            className="bg-gray-100 text-black px-4 py-2 rounded-xl border border-gray-200 flex items-center gap-3 text-sm font-bold group hover:bg-black hover:text-white transition-all cursor-pointer"
                            onClick={() => removeFilter(tag.key, tag.value)}
                        >
                            {tag.label}
                            <X className="h-3.5 w-3.5 text-gray-400 group-hover:text-white" />
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

            <div className="flex flex-col lg:flex-row gap-16">
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
                        <h2 className="text-4xl font-black tracking-tighter">Filters</h2>
                        <button onClick={() => setShowFilters(false)} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                            <X className="h-7 w-7" />
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
                    <div className="flex items-center justify-between mb-12 pb-8 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            <p className="text-lg text-gray-500 font-medium font-playfair italic">
                                We found <span className="text-black font-black not-italic">{pagination.total}</span> items for you
                            </p>
                            {loading && <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />}
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest hidden sm:inline">Sort:</span>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                                    className="text-sm font-black focus:outline-none bg-transparent cursor-pointer h-10 border-b border-gray-100 hover:border-black transition-all"
                                >
                                    <option value="newest">Latest Arrivals</option>
                                    <option value="popular">Most Popular</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={cn(
                                        "p-2.5 rounded-xl transition-all",
                                        viewMode === 'grid' ? "bg-white shadow-lg shadow-black/5 text-black" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    <LayoutGrid className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={cn(
                                        "p-2.5 rounded-xl transition-all",
                                        viewMode === 'list' ? "bg-white shadow-lg shadow-black/5 text-black" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    <List className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <ProductGrid products={products} isLoading={loading && products.length === 0} viewMode={viewMode} />

                    {(!loading && products.length === 0) && (
                        <div className="animate-in fade-in zoom-in-95 duration-700">
                            <div className="text-center py-40 bg-gray-50 rounded-[5rem] border border-gray-100 shadow-inner px-12">
                                <div className="w-40 h-40 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-indigo-100 relative group overflow-hidden">
                                    <div className="absolute inset-0 bg-indigo-600 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full opacity-5" />
                                    <Search className="h-16 w-16 text-indigo-400 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter">Selection Not Found</h2>
                                <p className="text-gray-500 mb-12 max-w-lg mx-auto text-xl font-medium leading-relaxed font-playfair italic">
                                    Your quest for the perfect masterpiece continues. Try refining your filters or explore our curators' recommendations below.
                                </p>
                                <Button
                                    variant="outline"
                                    className="rounded-[2.5rem] font-black px-14 h-20 text-xl border-4 border-black hover:bg-black hover:text-white transition-all shadow-2xl shadow-black/10"
                                    onClick={clearFilters}
                                >
                                    Restart Exploration
                                </Button>
                            </div>

                            {/* Suggestions Section */}
                            {suggestions.length > 0 && (
                                <div className="mt-32">
                                    <div className="flex items-center justify-between mb-12">
                                        <h3 className="text-4xl font-black tracking-tighter">Suggested for You</h3>
                                        <Link href="/shop" className="text-indigo-600 font-black flex items-center gap-3 hover:gap-5 transition-all group">
                                            See All Collections <ArrowRight className="h-5 w-5" />
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                                        {suggestions.map((product) => (
                                            <Link key={product.id} href={`/products/${product.slug}`} className="group">
                                                <div className="aspect-[4/5] relative rounded-[2rem] overflow-hidden mb-6 shadow-xl">
                                                    <Image src={product.images?.[0]?.url || '/placeholder.png'} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                                                </div>
                                                <h4 className="font-black text-lg group-hover:text-indigo-600 transition-colors mb-2">{product.name}</h4>
                                                <div className="font-black text-gray-400">৳{product.basePrice.toLocaleString()}</div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && products.length > 0 && pagination.totalPages > 1 && (
                        <div className="mt-32 flex items-center justify-center gap-4">
                            <Button
                                variant="outline"
                                className="rounded-[1.5rem] border-2 h-16 w-16 p-0 hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-30 shadow-sm"
                                disabled={filters.page === 1}
                                onClick={() => handleFilterChange({ page: filters.page - 1 })}
                            >
                                <ChevronDown className="h-7 w-7 rotate-90" />
                            </Button>

                            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-[2rem] border border-gray-100 shadow-inner">
                                {[...Array(pagination.totalPages)].map((_, i) => (
                                    <Button
                                        key={i}
                                        variant={filters.page === i + 1 ? 'default' : 'ghost'}
                                        className={cn(
                                            "rounded-[1.5rem] h-12 w-12 p-0 text-xl font-black transition-all duration-300",
                                            filters.page === i + 1 ? "bg-black text-white shadow-xl shadow-black/20" : "text-gray-400 hover:text-black hover:bg-white"
                                        )}
                                        onClick={() => handleFilterChange({ page: i + 1 })}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                className="rounded-[1.5rem] border-2 h-16 w-16 p-0 hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-30 shadow-sm"
                                disabled={filters.page === pagination.totalPages}
                                onClick={() => handleFilterChange({ page: filters.page + 1 })}
                            >
                                <ChevronDown className="h-7 w-7 -rotate-90" />
                            </Button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
