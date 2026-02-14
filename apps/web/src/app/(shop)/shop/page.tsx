'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Filter,
    ChevronDown,
    LayoutGrid,
    List,
    Search,
    SlidersHorizontal,
    X,
    Star,
    ShoppingBag,
    Heart,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@bigbazar/shared';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import { useUIStore } from '@/lib/stores/ui-store';
import type { Product, Category } from '@/types';

export default function ShopPage({ params: paramsPromise }: { params: Promise<{ slug?: string }> }) {
    const params = use(paramsPromise);
    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [searchTerm, setSearchTerm] = useState('');

    // Filter states
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

    const { addItem } = useCartStore();
    const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();
    const { openCart, addNotification } = useUIStore();

    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch('/api/categories?parentsOnly=true');
            const result = await res.json();
            if (result.success) setCategories(result.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    }, []);

    const fetchProducts = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (params.slug) queryParams.append('category', params.slug);
            if (sortBy) queryParams.append('sortBy', sortBy);
            if (searchTerm) queryParams.append('q', searchTerm);
            if (selectedSizes.length > 0) queryParams.append('sizes', selectedSizes.join(','));
            if (selectedColors.length > 0) queryParams.append('colors', selectedColors.join(','));
            if (priceRange.min) queryParams.append('minPrice', priceRange.min);
            if (priceRange.max) queryParams.append('maxPrice', priceRange.max);
            queryParams.append('page', page.toString());

            const res = await fetch(`/api/products?${queryParams.toString()}`);
            const result = await res.json();
            if (result.success) {
                setProducts(result.data);
                setPagination({
                    page: result.pagination.page,
                    totalPages: result.pagination.totalPages
                });
            }

            if (params.slug && !category) {
                const catRes = await fetch(`/api/categories?slug=${params.slug}`);
                const catResult = await catRes.json();
                if (catResult.success) setCategory(catResult.data[0]);
            }
        } catch (error) {
            console.error('Failed to fetch shop data:', error);
        } finally {
            setLoading(false);
        }
    }, [params.slug, sortBy, selectedSizes, selectedColors, priceRange, searchTerm, category]);

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [fetchCategories, fetchProducts]);

    const handleAddToCart = (product: Product) => {
        addItem(product, 1);
        addNotification({
            type: 'success',
            message: `${product.name} added to cart`,
        });
        openCart();
    };

    const toggleSize = (size: string) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    const toggleColor = (color: string) => {
        setSelectedColors(prev =>
            prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
        );
    };

    const clearFilters = () => {
        setSelectedSizes([]);
        setSelectedColors([]);
        setPriceRange({ min: '', max: '' });
        setSearchTerm('');
        setSortBy('newest');
    };

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                        <Link href="/" className="hover:text-black transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
                        {category && (
                            <>
                                <span>/</span>
                                <span className="text-black font-bold uppercase tracking-widest">{category.name}</span>
                            </>
                        )}
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
                        {category ? category.name : 'Our Collection'}
                    </h1>
                    <p className="text-gray-500 max-w-2xl text-lg font-medium">
                        {category?.description || 'Discover our curated selection of premium fashion items, designed for modern elegance and unparalleled comfort.'}
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-1 md:w-80 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Find your style..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-2xl text-base focus:outline-none transition-all"
                        />
                    </div>
                    <Button
                        variant="outline"
                        className={`rounded-2xl gap-3 h-14 px-8 font-black text-lg border-2 transition-all ${showFilters ? 'bg-black text-white border-black' : 'hover:border-black'}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <SlidersHorizontal className="h-5 w-5" />
                        Filters
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Mobile Filters Drawer Overlay */}
                {showFilters && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] lg:hidden" onClick={() => setShowFilters(false)} />
                )}

                {/* Filters Sidebar */}
                <aside className={`
                    fixed lg:sticky top-32 inset-y-0 left-0 w-[85vw] max-w-sm lg:w-72 bg-white lg:bg-transparent z-[120] lg:z-0
                    p-8 lg:p-0 transition-all duration-500 ease-out h-[100vh] lg:h-auto overflow-y-auto
                    ${showFilters ? 'translate-x-0 opacity-100' : '-translate-x-full lg:hidden opacity-0'}
                `}>
                    <div className="flex items-center justify-between lg:hidden mb-12">
                        <h2 className="text-3xl font-black">Filters</h2>
                        <button onClick={() => setShowFilters(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="space-y-12">
                        {/* Categories */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 px-1">Shop Categories</h3>
                            <div className="space-y-3">
                                <Link
                                    href="/shop"
                                    className={`flex items-center justify-between group p-3 rounded-2xl transition-all ${!params.slug ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                                >
                                    <span className="font-bold">All Products</span>
                                    <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100 -rotate-90 transition-all" />
                                </Link>
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/category/${cat.slug}`}
                                        className={`flex items-center justify-between group p-3 rounded-2xl transition-all ${params.slug === cat.slug ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                                    >
                                        <span className="font-bold">{cat.name}</span>
                                        <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100 -rotate-90 transition-all" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 px-1">Price Range</h3>
                            <div className="space-y-6 bg-gray-50 p-6 rounded-[2rem]">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                            className="w-full pl-8 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                            className="w-full pl-8 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sizes */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 px-1">Select Size</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Free'].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => toggleSize(size)}
                                        className={`aspect-square flex items-center justify-center border-2 rounded-xl text-sm font-black transition-all ${selectedSizes.includes(size) ? 'bg-black text-white border-black scale-105 shadow-lg' : 'border-gray-100 hover:border-gray-300'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Colors */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 px-1">Select Color</h3>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { name: 'Black', hex: '#000000' },
                                    { name: 'White', hex: '#FFFFFF' },
                                    { name: 'Red', hex: '#FF0000' },
                                    { name: 'Blue', hex: '#0000FF' },
                                    { name: 'Green', hex: '#00FF00' },
                                    { name: 'Yellow', hex: '#FFFF00' },
                                    { name: 'Gray', hex: '#808080' },
                                    { name: 'Navy', hex: '#000080' }
                                ].map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => toggleColor(color.name)}
                                        className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center ${selectedColors.includes(color.name) ? 'border-indigo-600 p-0.5' : 'border-gray-100'}`}
                                        title={color.name}
                                    >
                                        <span className="w-full h-full rounded-full" style={{ backgroundColor: color.hex, border: color.name === 'White' ? '1px solid #e5e7eb' : 'none' }} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            variant="link"
                            className="w-full text-red-500 font-bold p-0 justify-start hover:text-red-700 h-auto"
                            onClick={clearFilters}
                        >
                            Reset All Filters
                        </Button>
                    </div>
                </aside>

                {/* Main Products Grid */}
                <main className="flex-1">
                    {/* Sorting & Toolbar */}
                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            <p className="text-base text-gray-500 font-medium">
                                Showing <span className="text-black font-black">{products.length}</span> Masterpieces
                            </p>
                            {loading && <Loader2 className="h-5 w-5 animate-spin text-gray-300" />}
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 group">
                                <span className="text-sm text-gray-400 font-bold uppercase tracking-wider hidden sm:inline">Order By</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="text-base font-black focus:outline-none bg-transparent cursor-pointer h-10 pr-2 border-b-2 border-transparent focus:border-black transition-all"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="popular">Most Popular</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-black' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <LayoutGrid className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-black' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <List className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {loading && products.length === 0 ? (
                        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-10`}>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="animate-pulse space-y-6">
                                    <div className="aspect-[4/5] bg-gray-50 rounded-[2.5rem]" />
                                    <div className="space-y-3 px-2">
                                        <div className="h-4 w-24 bg-gray-50 rounded" />
                                        <div className="h-6 w-full bg-gray-50 rounded-lg" />
                                        <div className="h-6 w-1/3 bg-gray-50 rounded-lg" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-x-10 gap-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both`}>
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className={`group flex ${viewMode === 'list' ? 'flex-row gap-10 items-center bg-gray-50/50 p-8 rounded-[3rem] border border-transparent hover:border-gray-200 hover:bg-white transition-all transform hover:-translate-y-1 shadow-sm hover:shadow-2xl' : 'flex-col'}`}
                                >
                                    {/* Product Image */}
                                    <div className={`relative overflow-hidden bg-gray-100 rounded-[2.5rem] ${viewMode === 'list' ? 'w-64 h-80 shrink-0' : 'aspect-[4/5] mb-8 shadow-2xl shadow-gray-200/40'}`}>
                                        <Link href={`/products/${product.slug}`}>
                                            <Image
                                                src={product.images?.[0]?.url || '/placeholder.png'}
                                                alt={product.name}
                                                fill
                                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                        </Link>

                                        {/* Action Buttons */}
                                        <div className="absolute top-6 right-6 flex flex-col gap-3 translate-x-20 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                onClick={() => toggleWishlist(product)}
                                                className={`rounded-2xl shadow-xl h-12 w-12 border-none transition-all ${isInWishlist(product.id) ? 'bg-red-500 text-white' : 'bg-white hover:bg-black hover:text-white'}`}
                                            >
                                                <Heart className={`h-6 w-6 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                onClick={() => handleAddToCart(product)}
                                                className="rounded-2xl shadow-xl bg-white h-12 w-12 border-none hover:bg-indigo-600 hover:text-white transition-all"
                                            >
                                                <ShoppingBag className="h-6 w-6" />
                                            </Button>
                                        </div>

                                        {product.salePrice && product.basePrice > product.salePrice && (
                                            <div className="absolute top-6 left-6 bg-red-600 text-white px-5 py-2 rounded-2xl text-sm font-black shadow-xl">
                                                -{Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)}%
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 px-2">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="flex items-center gap-1 text-amber-400">
                                                <Star className="h-4 w-4 fill-current" />
                                                <span className="text-sm text-gray-900 font-black">{product.averageRating || '4.5'}</span>
                                            </div>
                                            <span className="text-gray-300">|</span>
                                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">{product.category?.name || 'New Arrival'}</span>
                                        </div>

                                        <h3 className={`font-black text-gray-900 group-hover:text-black transition-colors mb-3 leading-tight ${viewMode === 'list' ? 'text-3xl' : 'text-xl'}`}>
                                            <Link href={`/products/${product.slug}`}>{product.name}</Link>
                                        </h3>

                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="font-black text-2xl">৳{(product.salePrice || product.basePrice).toLocaleString()}</span>
                                            {product.salePrice && product.basePrice > product.salePrice && (
                                                <span className="text-lg text-gray-400 line-through font-medium">৳{product.basePrice.toLocaleString()}</span>
                                            )}
                                        </div>

                                        {viewMode === 'list' && (
                                            <p className="text-lg text-gray-500 mb-8 line-clamp-3 max-w-2xl font-medium leading-relaxed">
                                                {product.shortDescription || 'Crafted with premium materials and designed for the contemporary lifestyle. Experience the perfect blend of luxury, comfort, and timeless fashion in every detail.'}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-4">
                                            <Button
                                                onClick={() => handleAddToCart(product)}
                                                className="bg-black text-white hover:bg-gray-800 rounded-2xl px-10 h-14 font-black text-lg shadow-xl shadow-gray-200 gap-3 group/btn"
                                            >
                                                <ShoppingBag className="h-6 w-6 transition-transform group-hover/btn:-rotate-12" />
                                                Add to Cart
                                            </Button>

                                            {viewMode === 'list' && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => toggleWishlist(product)}
                                                    className={`rounded-2xl h-14 w-14 border-2 transition-all ${isInWishlist(product.id) ? 'bg-red-500 border-red-500 text-white' : 'hover:border-black'}`}
                                                >
                                                    <Heart className={`h-6 w-6 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-40 bg-gray-50 rounded-[4rem]">
                            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                                <Search className="h-12 w-12 text-gray-200" />
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 mb-4">Masterpiece Not Found</h2>
                            <p className="text-gray-500 mb-10 max-w-md mx-auto text-lg font-medium">
                                We couldn't find exactly what you were looking for. Try refining your filters or search keywords.
                            </p>
                            <Button
                                variant="outline"
                                className="rounded-[2rem] font-black px-12 h-16 text-lg border-4 hover:bg-black hover:text-white hover:border-black transition-all"
                                onClick={clearFilters}
                            >
                                Clear All Explorations
                            </Button>
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && products.length > 0 && pagination.totalPages > 1 && (
                        <div className="mt-24 flex items-center justify-center gap-4">
                            <Button
                                variant="outline"
                                className="rounded-2xl border-2 h-14 w-14 p-0 hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-30"
                                disabled={pagination.page === 1}
                                onClick={() => fetchProducts(pagination.page - 1)}
                            >
                                <ChevronDown className="h-6 w-6 rotate-90" />
                            </Button>

                            {[...Array(pagination.totalPages)].map((_, i) => (
                                <Button
                                    key={i}
                                    variant={pagination.page === i + 1 ? 'default' : 'ghost'}
                                    className={`rounded-2xl h-14 w-14 p-0 text-xl font-black ${pagination.page === i + 1 ? 'bg-black text-white' : 'text-gray-400 hover:text-black hover:bg-gray-100'}`}
                                    onClick={() => fetchProducts(i + 1)}
                                >
                                    {i + 1}
                                </Button>
                            ))}

                            <Button
                                variant="outline"
                                className="rounded-2xl border-2 h-14 w-14 p-0 hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-30"
                                disabled={pagination.page === pagination.totalPages}
                                onClick={() => fetchProducts(pagination.page + 1)}
                            >
                                <ChevronDown className="h-6 w-6 -rotate-90" />
                            </Button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
