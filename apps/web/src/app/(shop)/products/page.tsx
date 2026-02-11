'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductsService, Product, ProductFilter, Category } from '@bigbazar/shared';
import { ProductGrid } from '@/components/shop/product-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, SlidersHorizontal, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function ProductsPage() {
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

        router.push(`/products?${params.toString()}`, { scroll: false });
    }, [filters, router]);

    const handleFilterChange = (key: keyof ProductFilter, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 })); // Reset page on filter change
    };

    const clearFilters = () => {
        setFilters({
            page: 1,
            limit: 12,
            sortBy: 'newest'
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Mobile Filter Sheet */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="lg:hidden mb-4 w-full flex items-center gap-2">
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
                                <h3 className="font-bold mb-4">Categories</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleFilterChange('categoryId', undefined)}
                                        className={`block w-full text-left text-sm ${!filters.categoryId ? 'font-bold text-black' : 'text-gray-500'}`}
                                    >
                                        All Categories
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleFilterChange('categoryId', cat.id)}
                                            className={`block w-full text-left text-sm ${filters.categoryId === cat.id ? 'font-bold text-black' : 'text-gray-500'}`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h3 className="font-bold mb-4">Price Range</h3>
                                <div className="flex gap-4">
                                    <Input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.minPrice || ''}
                                        onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                                        className="w-full"
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.maxPrice || ''}
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Desktop Sidebar */}
                <div className="hidden lg:block w-64 flex-shrink-0 space-y-8">
                    <div>
                        <h3 className="font-black text-xl mb-6">Categories</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => handleFilterChange('categoryId', undefined)}
                                className={`block w-full text-left transition-colors ${!filters.categoryId ? 'font-bold text-black' : 'text-gray-500 hover:text-black'}`}
                            >
                                All Categories
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleFilterChange('categoryId', cat.id)}
                                    className={`block w-full text-left transition-colors ${filters.categoryId === cat.id ? 'font-bold text-black' : 'text-gray-500 hover:text-black'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-black text-xl mb-6">Price Range</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                type="number"
                                placeholder="Min"
                                value={filters.minPrice || ''}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full"
                            />
                            <Input
                                type="number"
                                placeholder="Max"
                                value={filters.maxPrice || ''}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {(filters.categoryId || filters.minPrice || filters.maxPrice || filters.search) && (
                        <Button
                            variant="destructive"
                            className="w-full"
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
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search products..."
                                className="pl-10"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                        </div>

                        <select
                            className="w-full sm:w-auto px-4 py-2 border rounded-md bg-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        >
                            <option value="newest">Newest Arrivals</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            {/* <option value="rating">Best Rating</option> */}
                        </select>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <Loader2 className="h-10 w-10 animate-spin text-gray-300" />
                        </div>
                    ) : (
                        <>
                            <ProductGrid products={products} />

                            {/* Pagination */}
                            {total > (filters.limit || 12) && (
                                <div className="mt-12 flex justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        disabled={filters.page === 1}
                                        onClick={() => handleFilterChange('page', (filters.page || 1) - 1)}
                                    >
                                        Previous
                                    </Button>
                                    <span className="flex items-center px-4 font-bold text-sm">
                                        Page {filters.page} of {Math.ceil(total / (filters.limit || 12))}
                                    </span>
                                    <Button
                                        variant="outline"
                                        disabled={filters.page! * (filters.limit || 12) >= total}
                                        onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
