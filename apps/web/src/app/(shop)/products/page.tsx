'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MOCK_PRODUCTS } from '@/lib/mock-data/products';
import { ProductGrid } from '@/components/shop/product-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Search, 
    SlidersHorizontal, 
    X, 
    Star,
    LayoutGrid,
    List,
    FilterX
} from 'lucide-react';
import { 
    Sheet, 
    SheetContent, 
    SheetHeader, 
    SheetTitle, 
    SheetTrigger 
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function ProductsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // UI State
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Filter State
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category') || null);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000]);
    const [minRating, setMinRating] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'newest');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Derived Data
    const categories = ['New Arrivals', 'Men', 'Women', 'kid(boys)', 'kids(girls)', 'Sale'];

    const brands = useMemo(() => {
        const b = Array.from(new Set(MOCK_PRODUCTS.map(p => p.brand).filter(Boolean)));
        return b.sort();
    }, []);

    // Initial load simulation
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Filtering Logic
    const filteredProducts = useMemo(() => {
        let results = [...MOCK_PRODUCTS];

        // Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            results = results.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.description.toLowerCase().includes(query)
            );
        }

        // Category
        if (selectedCategory) {
            results = results.filter(p => p.category === selectedCategory);
        }

        // Brands
        if (selectedBrands.length > 0) {
            results = results.filter(p => p.brand && selectedBrands.includes(p.brand));
        }

        // Price
        results = results.filter(p => {
            const price = p.salePrice || p.basePrice;
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // Rating
        if (minRating) {
            results = results.filter(p => (p.rating || 0) >= minRating);
        }

        // Sorting
        results.sort((a, b) => {
            const priceA = a.salePrice || a.basePrice;
            const priceB = b.salePrice || b.basePrice;

            switch (sortBy) {
                case 'price_low': return priceA - priceB;
                case 'price_high': return priceB - priceA;
                case 'rating': return (b.rating || 0) - (a.rating || 0);
                case 'newest':
                default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

        return results;
    }, [searchQuery, selectedCategory, selectedBrands, priceRange, minRating, sortBy]);

    // Pagination
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    }, [filteredProducts, currentPage]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Handlers
    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev => 
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
        setCurrentPage(1);
    };

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedCategory(null);
        setSelectedBrands([]);
        setPriceRange([0, 150000]);
        setMinRating(null);
        setSortBy('newest');
        setCurrentPage(1);
    };

    const FilterContent = () => (
        <div className="space-y-10">
            {/* Categories */}
            <div>
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-6">Categories</h3>
                <div className="space-y-2">
                    <button
                        onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
                        className={cn(
                            "w-full text-left px-4 py-2 rounded-xl text-sm transition-all",
                            selectedCategory === null ? "bg-foreground text-white font-bold" : "text-gray-500 hover:bg-gray-100"
                        )}
                    >
                        All Categories
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => { setSelectedCategory(cat as string); setCurrentPage(1); }}
                            className={cn(
                                "w-full text-left px-4 py-2 rounded-xl text-sm transition-all",
                                selectedCategory === cat ? "bg-foreground text-white font-bold" : "text-gray-500 hover:bg-gray-100"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>



            {/* Ratings */}
            <div>
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-6">Minimum Rating</h3>
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => { setMinRating(minRating === rating ? null : rating); setCurrentPage(1); }}
                            className={cn(
                                "flex items-center gap-3 w-full px-4 py-2 rounded-xl transition-all",
                                minRating === rating ? "bg-amber-50 text-amber-600" : "hover:bg-gray-100 text-gray-400"
                            )}
                        >
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={cn("h-3 w-3", i < rating ? "fill-current" : "text-gray-200")} />
                                ))}
                            </div>
                            <span className="text-xs font-black">& Up</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Clear All */}
            <Button 
                variant="outline" 
                className="w-full h-12 rounded-2xl border-dashed border-2 font-black uppercase tracking-widest text-[10px] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all"
                onClick={clearAllFilters}
            >
                <FilterX className="h-4 w-4 mr-2" />
                Reset Filters
            </Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
                
                {/* Header Module */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-px w-8 bg-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">All Collections</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-playfair font-bold tracking-tight text-gray-900 leading-tight">
                            Shop <span className="text-primary">Our Products</span>
                        </h1>
                        <p className="text-gray-500 font-medium max-w-md">
                            Browse our full range of premium clothing and accessories for the whole family.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Results</span>
                            <span className="text-xl font-black text-gray-900">{filteredProducts.length} <span className="text-sm font-medium text-gray-400">products</span></span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    
                    {/* Desktop Sidebar Module */}
                    <aside className="hidden lg:block w-72 shrink-0">
                        <div className="sticky top-32">
                            <FilterContent />
                        </div>
                    </aside>

                    {/* Main Content Module */}
                    <main className="flex-1">
                        
                        {/* Toolbar Module */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 bg-gray-50/50 p-4 rounded-[2.5rem] border border-gray-100">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                {/* Mobile Filter Trigger */}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" className="lg:hidden h-12 w-12 rounded-2xl p-0 border-gray-200 hover:bg-white hover:shadow-xl transition-all">
                                            <SlidersHorizontal className="h-5 w-5" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
                                        <SheetHeader className="mb-8">
                                            <SheetTitle className="text-2xl font-black tracking-tighter">Filters</SheetTitle>
                                        </SheetHeader>
                                        <FilterContent />
                                    </SheetContent>
                                </Sheet>

                                <div className="relative flex-1 sm:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                        className="h-12 pl-12 pr-4 bg-white border-gray-200 rounded-2xl focus:ring-2 focus:ring-black/5 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                <div className="hidden sm:flex items-center bg-white border border-gray-100 rounded-2xl p-1 shadow-sm">
                                    <button 
                                        onClick={() => setViewMode('grid')}
                                        className={cn(
                                            "h-10 w-10 flex items-center justify-center rounded-xl transition-all",
                                            viewMode === 'grid' ? "bg-black text-white shadow-xl" : "text-gray-400 hover:text-black"
                                        )}
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('list')}
                                        className={cn(
                                            "h-10 w-10 flex items-center justify-center rounded-xl transition-all",
                                            viewMode === 'list' ? "bg-black text-white shadow-xl" : "text-gray-400 hover:text-black"
                                        )}
                                    >
                                        <List className="h-4 w-4" />
                                    </button>
                                </div>

                                <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
                                    <SelectTrigger className="w-[180px] h-12 rounded-2xl border-gray-200 bg-white font-bold text-xs uppercase tracking-widest focus:ring-black/5 transition-all">
                                        <SelectValue placeholder="Sort By" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                                        <SelectItem value="newest" className="font-bold text-xs uppercase tracking-widest py-3">Newest</SelectItem>
                                        <SelectItem value="price_low" className="font-bold text-xs uppercase tracking-widest py-3">Price: Low to High</SelectItem>
                                        <SelectItem value="price_high" className="font-bold text-xs uppercase tracking-widest py-3">Price: High to Low</SelectItem>
                                        <SelectItem value="rating" className="font-bold text-xs uppercase tracking-widest py-3">Best Rating</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Category Pills Module */}
                        <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-4 no-scrollbar">
                            <button
                                onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
                                className={cn(
                                    "px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap shrink-0 border",
                                    selectedCategory === null
                                        ? "bg-foreground text-white border-foreground shadow-xl shadow-black/10"
                                        : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"
                                )}
                            >
                                All Categories
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => { setSelectedCategory(cat as string); setCurrentPage(1); }}
                                    className={cn(
                                        "px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap shrink-0 border",
                                        selectedCategory === cat
                                            ? "bg-primary text-white border-primary shadow-xl shadow-primary/20"
                                            : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Grid Module */}
                        <ProductGrid 
                            products={paginatedProducts} 
                            isLoading={isLoading} 
                            viewMode={viewMode}
                        />

                        {/* Empty State */}
                        {!isLoading && filteredProducts.length === 0 && (
                            <div className="text-center py-32 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="h-7 w-7 text-gray-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3 font-playfair">No Products Found</h3>
                                <p className="text-gray-400 font-medium mb-10 max-w-sm mx-auto">
                                    We couldn't find any products matching your current filters. Try adjusting your search or resetting filters.
                                </p>
                                <Button
                                    onClick={clearAllFilters}
                                    className="bg-foreground text-white hover:bg-primary h-12 px-10 rounded-xl font-bold uppercase tracking-wider text-xs"
                                >
                                    Reset All Filters
                                </Button>
                            </div>
                        )}

                        {/* Pagination Module */}
                        {!isLoading && totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-3">
                                <Button
                                    variant="outline"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    className="h-11 px-6 rounded-xl border-gray-200 font-bold uppercase tracking-wider text-xs"
                                >
                                    Previous
                                </Button>
                                <div className="flex items-center gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={cn(
                                                "w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold transition-all",
                                                currentPage === i + 1
                                                    ? "bg-foreground text-white shadow-lg shadow-black/15"
                                                    : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                                            )}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="h-11 px-6 rounded-xl border-gray-200 font-bold uppercase tracking-wider text-xs"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
