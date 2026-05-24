'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { ProductGrid } from '@/components/shop/product-grid';
import { Breadcrumbs } from '@/components/shop/breadcrumbs';
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
import { useLanguageStore, useTranslation } from '@bigbazar/shared';

export default function ProductsPage() {
    const { language } = useLanguageStore();
    const t = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();

    // UI State
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [apiProducts, setApiProducts] = useState<any[]>([]);

    useEffect(() => {
        setIsLoading(true);
        fetch('/api/products?limit=1000') // fetch all for client-side filtering for now
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setApiProducts(data.data);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, []);

    // Sync state with URL parameters dynamically
    useEffect(() => {
        const query = searchParams.get('search') || '';
        const cat = searchParams.get('category') || null;
        setSearchQuery(query);
        setSelectedCategory(cat);
        setCurrentPage(1);
    }, [searchParams]);

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
    const categoryOptions = [
        { key: 'New Arrivals', label: t?.newArrivals?.title || 'New Arrivals' },
        { key: 'Men', label: t?.categories?.men || 'Men' },
        { key: 'Women', label: t?.categories?.women || 'Women' },
        { key: 'Kids(Boys)', label: t?.categories?.kidsBoys || 'Kids(Boys)' },
        { key: 'Kids(Girls)', label: t?.categories?.kidsGirls || 'Kids(Girls)' },
        { key: 'Wedding-Touch', label: t?.categories?.weddingTouch || 'Wedding Touch' },
        { key: 'Sale', label: 'Sale' },
    ];

    const brands = useMemo(() => {
        const b = Array.from(new Set(apiProducts.map(p => p.brand).filter(Boolean)));
        return b.sort();
    }, [apiProducts]);

    // Filtering Logic
    const filteredProducts = useMemo(() => {
        let results = [...apiProducts];

        // Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            results = results.filter(p => 
                p.name.toLowerCase().includes(query) || 
                (p.description || '').toLowerCase().includes(query) ||
                (typeof p.category === 'object' ? p.category?.name : p.category || '').toLowerCase().includes(query)
            );
        }

        // Category
        if (selectedCategory) {
            results = results.filter(p => {
                const catName = typeof p.category === 'object' ? p.category?.name : p.category;
                const catSlug = typeof p.category === 'object' ? p.category?.slug : null;
                
                return (
                    (catName && catName.toLowerCase() === selectedCategory.toLowerCase()) ||
                    (catSlug && catSlug.toLowerCase() === selectedCategory.toLowerCase()) ||
                    (selectedCategory === 'New Arrivals' && p.isNew)
                );
            });
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
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-6">{t?.categories?.title || 'Categories'}</h3>
                <div className="space-y-2">
                    <button
                        onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
                        className={cn(
                            "w-full text-left px-4 py-2 rounded-xl text-sm transition-all uppercase tracking-widest text-[10px] font-bold",
                            selectedCategory === null ? "bg-foreground text-white shadow-lg" : "text-gray-500 hover:bg-gray-100"
                        )}
                    >
                        {t?.common?.viewAll || 'All Categories'}
                    </button>
                    {categoryOptions.map(cat => (
                        <button
                            key={cat.key}
                            onClick={() => { setSelectedCategory(cat.key); setCurrentPage(1); }}
                            className={cn(
                                "w-full text-left px-4 py-2 rounded-xl text-sm transition-all uppercase tracking-widest text-[10px] font-bold",
                                selectedCategory === cat.key ? "bg-destructive text-white shadow-lg" : "text-gray-500 hover:bg-gray-100"
                            )}
                        >
                            {cat.label}
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
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-10">
                <Breadcrumbs 
                    items={[
                        { label: t?.common?.products || 'Products', active: true }
                    ]} 
                />

                {/* Header Module */}
                <div className="flex flex-row items-end justify-between gap-4 mb-6 sm:mb-16">
                    <div className="space-y-2 sm:space-y-4">
                        <div className="hidden sm:flex items-center gap-3">
                            <div className="h-px w-8 bg-destructive" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{t?.newArrivals?.subtitle || 'All Collections'}</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-playfair font-bold tracking-tight text-gray-900 leading-tight">
                            Shop <span className="text-destructive">Our Products</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="bg-gray-50 px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-gray-100">
                            <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5 sm:mb-1">Results</span>
                            <span className="text-base sm:text-xl font-black text-gray-900">{filteredProducts.length} <span className="text-xs sm:text-sm font-medium text-gray-400">products</span></span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 lg:gap-16">
                    
                    {/* Desktop Sidebar Module */}
                    <aside className="hidden lg:block w-72 shrink-0">
                        <div className="sticky top-32">
                            <FilterContent />
                        </div>
                    </aside>

                    {/* Main Content Module */}
                    <main className="flex-1">
                        
                        {/* Toolbar Module */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 mb-6 sm:mb-12 bg-gray-50/50 p-2 sm:p-4 rounded-2xl sm:rounded-[2.5rem] border border-gray-100">
                            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
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
                                    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder={t?.common?.search || "Search products..."}
                                        value={searchQuery}
                                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                        className="h-10 sm:h-12 pl-10 sm:pl-12 pr-3 sm:pr-4 bg-white border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-black/5 transition-all font-medium text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
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
                                    <SelectTrigger className="w-[140px] sm:w-[180px] h-10 sm:h-12 rounded-xl sm:rounded-2xl border-gray-200 bg-white font-bold text-[10px] sm:text-xs uppercase tracking-widest focus:ring-black/5 transition-all">
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
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-6 sm:mb-12 overflow-x-auto pb-3 sm:pb-4 no-scrollbar">
                            <button
                                onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
                                className={cn(
                                    "px-3 sm:px-6 py-2 sm:py-3 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all whitespace-nowrap shrink-0 border",
                                    selectedCategory === null
                                        ? "bg-foreground text-white border-foreground shadow-xl shadow-black/10"
                                        : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"
                                )}
                            >
                                {t?.common?.viewAll || 'All Categories'}
                            </button>
                            {categoryOptions.map(cat => (
                                <button
                                    key={cat.key}
                                    onClick={() => { setSelectedCategory(cat.key); setCurrentPage(1); }}
                                    className={cn(
                                        "px-3 sm:px-6 py-2 sm:py-3 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all whitespace-nowrap shrink-0 border",
                                        selectedCategory === cat.key
                                            ? "bg-destructive text-white border-destructive shadow-xl shadow-destructive/20"
                                            : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"
                                    )}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Grid Module */}
                        <ProductGrid 
                            products={paginatedProducts} 
                            isLoading={isLoading} 
                            viewMode={viewMode}
                        />



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
