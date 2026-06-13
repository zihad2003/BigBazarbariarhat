'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Product, ProductFilter, Category } from '@bigbazar/shared';
import { ProductsService } from '@bigbazar/shared';
import { ProductGrid } from '@/components/shop/product-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, SlidersHorizontal, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useLanguageStore, useTranslation } from '@bigbazar/shared';
import { Breadcrumbs } from '@/components/shop/breadcrumbs';

export default function SalePage() {
    const { language } = useLanguageStore();
    const t = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    // Filter State
    const [filters, setFilters] = useState<ProductFilter>({
        page: Number(searchParams.get('page')) || 1,
        limit: 12,
        search: searchParams.get('search') || '',
        categoryId: searchParams.get('category') || undefined,
        minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
        maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
        sortBy: (searchParams.get('sort') as any) || 'newest',
        onSale: true // Hardcoded for Sale page
    });

    // Fetch Categories
    useEffect(() => {
        ProductsService.getCategories().then(res => {
            if (res.success && res.data) {
                setCategories(res.data);
            }
        });
    }, []);

    // Fetch Products
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await ProductsService.getProducts(filters);
            if (res.success && res.data) {
                setProducts(res.data);
                setTotal(res.count || 0);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 300); // Debounce
        return () => clearTimeout(timer);
    }, [fetchProducts]);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.page && filters.page > 1) params.set('page', filters.page.toString());
        if (filters.search) params.set('search', filters.search);
        if (filters.categoryId) params.set('category', filters.categoryId);
        if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
        if (filters.sortBy) params.set('sort', filters.sortBy);
        // We don't need to put onSale in URL as it's implicit for this page

        router.push(`/sale?${params.toString()}`, { scroll: false });
    }, [filters, router]);

    // Scroll to top when page changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [filters.page]);

    const handleFilterChange = (key: keyof ProductFilter, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }));
    };

    const clearFilters = () => {
        setFilters({
            page: 1,
            limit: 12,
            sortBy: 'newest',
            onSale: true
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Breadcrumbs 
                items={[
                    { label: t?.common?.sale || 'Sale', active: true }
                ]} 
            />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold tracking-tight text-neutral-900 mb-12">
                Flash <span className="text-emerald-600 font-bold italic">Sale</span>
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Mobile Filter Sheet */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="lg:hidden mb-4 w-full flex items-center justify-center gap-2 rounded-xl border-neutral-200 h-11 text-xs font-bold uppercase tracking-wider">
                            <SlidersHorizontal className="h-4 w-4" /> Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>
                        <div className="mt-8 space-y-8">
                            {/* Categories */}
                            <div>
                                <h3 className="text-xs font-black text-neutral-900 uppercase tracking-[0.2em] mb-4">Categories</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleFilterChange('categoryId', undefined)}
                                        className={`block w-full text-left px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${!filters.categoryId ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}
                                    >
                                        All Categories
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleFilterChange('categoryId', cat.id)}
                                            className={`block w-full text-left px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filters.categoryId === cat.id ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </SheetContent>
                </Sheet>

                {/* Desktop Sidebar */}
                <div className="hidden lg:block w-64 flex-shrink-0 space-y-8">
                    <div>
                        <h3 className="text-xs font-black text-neutral-900 uppercase tracking-[0.2em] mb-6">Categories</h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => handleFilterChange('categoryId', undefined)}
                                className={`block w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${!filters.categoryId ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}
                            >
                                All Categories
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleFilterChange('categoryId', cat.id)}
                                    className={`block w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filters.categoryId === cat.id ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>


                    {(filters.categoryId || filters.minPrice || filters.maxPrice || filters.search) && (
                        <Button
                            variant="outline"
                            className="w-full rounded-xl border-dashed border-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all text-xs font-bold uppercase tracking-wider h-11"
                            onClick={clearFilters}
                        >
                            <X className="h-4 w-4 mr-2" /> Clear Filters
                        </Button>
                    )}
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <Input
                                placeholder="Search sale items..."
                                className="pl-11 rounded-xl border-neutral-200 focus:ring-neutral-900/10 text-sm font-medium"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                        </div>

                        <select
                            className="w-full sm:w-auto h-10 px-4 border border-neutral-200 rounded-xl bg-white text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-neutral-900/10 cursor-pointer"
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        >
                            <option value="newest">Newest Arrivals</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <Loader2 className="h-10 w-10 animate-spin text-gray-300" />
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <ProductGrid products={products as any[]} />

                            {/* Pagination */}
                            {total > (filters.limit || 12) && (
                                <div className="mt-12 flex justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        disabled={filters.page === 1}
                                        onClick={() => handleFilterChange('page', (filters.page || 1) - 1)}
                                        className="h-10 rounded-xl border-neutral-200 text-xs font-bold uppercase tracking-wider"
                                    >
                                        Previous
                                    </Button>
                                    <span className="flex items-center px-4 font-bold text-xs text-neutral-500 uppercase tracking-widest">
                                        Page {filters.page} of {Math.ceil(total / (filters.limit || 12))}
                                    </span>
                                    <Button
                                        variant="outline"
                                        disabled={filters.page! * (filters.limit || 12) >= total}
                                        onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}
                                        className="h-10 rounded-xl border-neutral-200 text-xs font-bold uppercase tracking-wider"
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">No sale items found at the moment.</p>
                            <Button variant="link" onClick={clearFilters} className="mt-2 text-black font-bold">
                                Clear filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
