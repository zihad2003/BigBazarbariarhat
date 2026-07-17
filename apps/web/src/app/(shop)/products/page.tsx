'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { ProductGrid } from '@/components/shop/product-grid';
import { Breadcrumbs } from '@/components/shop/breadcrumbs';
import { Button } from '@/components/ui/button';
import { 
    SlidersHorizontal, 
    X, 
    Star,
    LayoutGrid,
    List,
    FilterX,
    Search
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
import { motion } from 'framer-motion';

// --- Local Translations ---
const localTranslations: Record<string, any> = {
    en: {
        headerSubtitle: 'Collection',
        headerTitle1: 'Shop ',
        headerTitle2: 'Our Products',
        headerDesc: 'Explore our curated collection of premium fashion for the whole family.',
        totalItems: 'Total Items',
        products: 'products',
        searchPlaceholder: 'Search products...',
        allCategories: 'All Categories',
        sortNewest: 'Newest First',
        sortPriceLow: 'Price: Low to High',
        sortPriceHigh: 'Price: High to Low',
        sortRating: 'Best Rating',
        filters: 'Filters',
        categories: 'Categories',
        resetFilters: 'Reset Filters',
        previous: 'Previous',
        next: 'Next',
        priceRange: 'Price Range',
        brands: 'Brands',
        reviews: 'Reviews',
        starsAndUp: 'Stars & Up',
        noProductsFound: 'No Products Found',
    },
    bn: {
        headerSubtitle: 'কালেকশন',
        headerTitle1: 'কেনাকাটা করুন ',
        headerTitle2: 'আমাদের পণ্যসমূহ',
        headerDesc: 'পুরো পরিবারের জন্য আমাদের প্রিমিয়াম ফ্যাশন কালেকশন দেখুন।',
        totalItems: 'মোট পণ্য',
        products: 'টি পণ্য',
        searchPlaceholder: 'পণ্য খুঁজুন...',
        allCategories: 'সকল ক্যাটাগরি',
        sortNewest: 'নতুন প্রথমে',
        sortPriceLow: 'দাম: কম থেকে বেশি',
        sortPriceHigh: 'দাম: বেশি থেকে কম',
        sortRating: 'সেরা রেটিং',
        filters: 'ফিল্টার',
        categories: 'ক্যাটাগরি',
        resetFilters: 'ফিল্টার রিসেট করুন',
        previous: 'পূর্ববর্তী',
        next: 'পরবর্তী',
        priceRange: 'মূল্যসীমা',
        brands: 'ব্র্যান্ডস',
        reviews: 'রিভিউ সমূহ',
        starsAndUp: 'স্টার ও তার উপরে',
        noProductsFound: 'কোনো পণ্য পাওয়া যায়নি',
    }
};

export default function ProductsPage() {
    const { language } = useLanguageStore();
    const t = useTranslation();
    const ct = localTranslations[language] || localTranslations.en;
    const router = useRouter();
    const searchParams = useSearchParams();

    // UI State
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [apiProducts, setApiProducts] = useState<any[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter State & Local Buffers for Debouncing
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');
    
    const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('subcategory') || searchParams.get('category') || null);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000]);
    const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([0, 150000]);
    
    const [minRating, setMinRating] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 12;

    // Debounce search query updates
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(localSearch);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [localSearch]);

    // Debounce price slider updates to prevent spamming backend API
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localPriceRange[0] !== priceRange[0] || localPriceRange[1] !== priceRange[1]) {
                setPriceRange(localPriceRange);
                setCurrentPage(1);
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [localPriceRange]);

    // Sync state with URL parameters dynamically (e.g. searching from layout navigation header)
    useEffect(() => {
        const query = searchParams.get('search') || '';
        const cat = searchParams.get('subcategory') || searchParams.get('category') || null;
        setLocalSearch(query);
        setSelectedCategory(cat);
        setCurrentPage(1);
    }, [searchParams]);

    // Load actual products from the backend API
    useEffect(() => {
        setIsLoading(true);
        // Correctly map sorting options to database query values supported by API
        const mappedSort = sortBy === 'price_low' ? 'price_asc' : sortBy === 'price_high' ? 'price_desc' : sortBy === 'rating' ? 'popular' : sortBy;
        
        const queryParams = new URLSearchParams({
            page: currentPage.toString(),
            limit: itemsPerPage.toString(),
            search: searchQuery,
            category: selectedCategory || '',
            sort: mappedSort,
            minPrice: priceRange[0].toString(),
            maxPrice: priceRange[1].toString()
        });
        
        fetch(`/api/products?${queryParams.toString()}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setApiProducts(data.data);
                    setTotalProducts(data.pagination.total);
                    setTotalPages(data.pagination.totalPages);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, [currentPage, searchQuery, selectedCategory, sortBy, priceRange]);

    // Scroll to top when page changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    // Derived category listings
    const categoryOptions = [
        { key: 'New Arrivals', label: t?.newArrivals?.title || 'New Arrivals' },
        { key: 'men', label: t?.categories?.men || 'Men' },
        { key: 'women', label: t?.categories?.women || 'Women' },
        { key: 'kids-boys', label: t?.categories?.kidsBoys || 'Kids(Boys)' },
        { key: 'kids-girls', label: t?.categories?.kidsGirls || 'Kids(Girls)' },
        { key: 'wedding-touch', label: t?.categories?.weddingTouch || 'Wedding Touch' },
        { key: 'Sale', label: t?.common?.sale || 'Sale' },
    ];

    const brands = useMemo(() => {
        const b = Array.from(new Set(apiProducts.map(p => p.brand).filter(Boolean)));
        return b.sort();
    }, [apiProducts]);

    // Local client-side filters for properties not fully filtered by backend (like rating and custom brand array selection)
    const filteredProducts = useMemo(() => {
        let items = [...apiProducts];
        
        if (selectedBrands.length > 0) {
            items = items.filter(p => p.brand && selectedBrands.includes(p.brand));
        }
        
        if (minRating !== null) {
            items = items.filter(p => (p.rating || 5) >= minRating);
        }
        
        return items;
    }, [apiProducts, selectedBrands, minRating]);

    // Handlers
    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev => 
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
        setCurrentPage(1);
    };

    const clearAllFilters = () => {
        setLocalSearch('');
        setSearchQuery('');
        setSelectedCategory(null);
        setSelectedBrands([]);
        setPriceRange([0, 150000]);
        setLocalPriceRange([0, 150000]);
        setMinRating(null);
        setSortBy('newest');
        setCurrentPage(1);
    };

    const renderFilterContent = () => (
        <div className="space-y-6 md:space-y-7 bg-neutral-50/40 p-4 lg:p-5 rounded-2xl border border-neutral-100/60">
            {/* Search Input Subsection */}
            <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Search</h3>
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                    <input
                        type="text"
                        placeholder={ct.searchPlaceholder}
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white border border-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Classification Categories Subsection */}
            <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{ct.categories}</h3>
                <div className="flex flex-col gap-1.5">
                    <button
                        onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
                        className={cn(
                            "w-full flex items-center justify-between text-left py-2 px-3 rounded-xl text-xs transition-all font-semibold uppercase tracking-wider",
                            selectedCategory === null 
                                ? "bg-neutral-900 text-white shadow-sm" 
                                : "text-neutral-600 bg-white border border-neutral-150 hover:bg-neutral-50 hover:text-neutral-900"
                        )}
                    >
                        <span>{ct.allCategories}</span>
                        {selectedCategory === null && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </button>
                    {categoryOptions.map(cat => {
                        const isActive = selectedCategory?.toLowerCase() === cat.key.toLowerCase() || selectedCategory?.toLowerCase().startsWith(cat.key.toLowerCase() + '-');
                        return (
                            <button
                                key={cat.key}
                                onClick={() => { setSelectedCategory(isActive ? null : cat.key); setCurrentPage(1); }}
                                className={cn(
                                    "w-full flex items-center justify-between text-left py-2 px-3 rounded-xl text-xs transition-all font-semibold uppercase tracking-wider",
                                    isActive 
                                        ? "bg-neutral-950 text-white shadow-sm" 
                                        : "text-neutral-600 bg-white border border-neutral-150 hover:bg-neutral-50 hover:text-neutral-900"
                                )}
                            >
                                <span>{cat.label}</span>
                                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Premium Price Range Slider Subsection */}
            <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{ct.priceRange}</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold text-neutral-650 font-mono bg-white p-2 rounded-xl border border-neutral-150">
                        <span>৳{localPriceRange[0].toLocaleString()}</span>
                        <span className="text-neutral-350">—</span>
                        <span>৳{localPriceRange[1].toLocaleString()}</span>
                    </div>
                    <Slider
                        defaultValue={[0, 150000]}
                        value={localPriceRange}
                        min={0}
                        max={150000}
                        step={1000}
                        onValueChange={(val) => setLocalPriceRange(val as [number, number])}
                        className="py-1"
                    />
                </div>
            </div>

            {/* Custom Brand Tag-Cloud Subsection */}
            {brands.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{ct.brands}</h3>
                    <div className="flex flex-wrap gap-1.5">
                        {brands.map(brand => {
                            const isSelected = selectedBrands.includes(brand);
                            return (
                                <button
                                    key={brand}
                                    onClick={() => toggleBrand(brand)}
                                    className={cn(
                                        "px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold uppercase tracking-wider transition-all",
                                        isSelected
                                            ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                                            : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                                    )}
                                >
                                    {brand}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Review Stars Filters Subsection */}
            <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{ct.reviews}</h3>
                <div className="grid grid-cols-5 gap-1.5">
                    {[5, 4, 3, 2, 1].map((stars) => {
                        const isSelected = minRating === stars;
                        return (
                            <button
                                key={stars}
                                onClick={() => { setMinRating(isSelected ? null : stars); setCurrentPage(1); }}
                                className={cn(
                                    "flex flex-col items-center gap-0.5 justify-center py-2 px-1 rounded-xl border text-[9px] font-bold transition-all",
                                    isSelected
                                        ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                                        : "bg-white border-neutral-200 text-amber-500 hover:bg-neutral-50"
                                )}
                                title={`${stars} ${ct.starsAndUp}`}
                            >
                                <span className={isSelected ? "text-white" : "text-neutral-700"}>{stars}</span>
                                <Star className={cn("h-3 w-3", isSelected ? "fill-white text-white" : "fill-amber-400 text-amber-400")} />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Clear/Reset Controls */}
            {(localSearch || selectedCategory !== null || selectedBrands.length > 0 || minRating !== null || priceRange[0] > 0 || priceRange[1] < 150000) && (
                <Button 
                    variant="outline" 
                    className="w-full h-10 rounded-xl border border-dashed border-red-200 text-rose-500 bg-rose-50/10 hover:bg-rose-50 hover:text-rose-600 hover:border-red-300 font-bold uppercase tracking-wider text-[9px] transition-all"
                    onClick={() => { clearAllFilters(); }}
                >
                    <FilterX className="h-3.5 w-3.5 mr-1.5" />
                    {ct.resetFilters}
                </Button>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-6 lg:py-10">
                <Breadcrumbs 
                    items={[
                        { label: t?.common?.products || 'Products', active: true }
                    ]} 
                />

                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8"
                >
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-px w-8 bg-emerald-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">{ct.headerSubtitle}</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-playfair font-bold tracking-tight text-neutral-900 leading-tight">
                            {ct.headerTitle1}<span className="text-emerald-600 font-bold italic">{ct.headerTitle2}</span>
                        </h1>
                    </div>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                    
                    {/* Desktop Sidebar Module */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-32">
                            {renderFilterContent()}
                        </div>
                    </aside>

                    {/* Main Content Module */}
                    <main className="flex-1">
                        
                        {/* Toolbar Header Module */}
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="flex flex-row items-center justify-between gap-4 mb-6 bg-neutral-50/50 p-2.5 rounded-xl border border-neutral-100"
                        >
                            <div className="flex items-center gap-4 w-auto">
                                {/* Mobile Filter Trigger Sheet */}
                                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" className="lg:hidden h-9 w-9 rounded-xl p-0 border-neutral-200 hover:bg-white hover:shadow-md transition-all">
                                            <SlidersHorizontal className="h-4 w-4" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="bottom" className="h-[75vh] rounded-t-[2.5rem] overflow-y-auto w-full max-w-lg mx-auto border-t border-neutral-100 shadow-2xl bg-white pb-10">
                                        <div className="w-12 h-1.5 bg-neutral-200 rounded-full mx-auto mb-6" />
                                        <SheetHeader className="mb-6">
                                            <SheetTitle className="text-2xl font-black tracking-tighter text-center">{ct.filters}</SheetTitle>
                                        </SheetHeader>
                                        <div className="px-4">
                                            {renderFilterContent()}
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>

                            <div className="flex items-center gap-4 w-auto justify-end">
                                <div className="hidden sm:flex items-center bg-white border border-neutral-100 rounded-xl p-1 shadow-sm font-sans">
                                    <button 
                                        onClick={() => setViewMode('grid')}
                                        className={cn(
                                            "h-8 w-8 flex items-center justify-center rounded-lg transition-all",
                                            viewMode === 'grid' ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-455 hover:text-black"
                                        )}
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('list')}
                                        className={cn(
                                            "h-8 w-8 flex items-center justify-center rounded-lg transition-all",
                                            viewMode === 'list' ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-455 hover:text-black"
                                        )}
                                    >
                                        <List className="h-4 w-4" />
                                    </button>
                                </div>

                                <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
                                    <SelectTrigger className="w-[140px] sm:w-[170px] h-9 rounded-xl border-neutral-200 bg-white font-bold text-[10px] sm:text-xs uppercase tracking-widest focus:ring-neutral-900/10 transition-all">
                                        <SelectValue placeholder="Sort By" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-neutral-100 shadow-2xl">
                                        <SelectItem value="newest" className="font-bold text-xs uppercase tracking-widest py-3">{ct.sortNewest}</SelectItem>
                                        <SelectItem value="price_low" className="font-bold text-xs uppercase tracking-widest py-3">{ct.sortPriceLow}</SelectItem>
                                        <SelectItem value="price_high" className="font-bold text-xs uppercase tracking-widest py-3">{ct.sortPriceHigh}</SelectItem>
                                        <SelectItem value="rating" className="font-bold text-xs uppercase tracking-widest py-3">{ct.sortRating}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </motion.div>

                        {/* Grid Module */}
                        <ProductGrid 
                            products={filteredProducts} 
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
                                    className="h-10 px-5 rounded-xl border-neutral-200 font-bold uppercase tracking-wider text-xs"
                                >
                                    {ct.previous}
                                </Button>
                                <div className="flex items-center gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all",
                                                currentPage === i + 1
                                                    ? "bg-neutral-900 text-white shadow-md"
                                                    : "bg-neutral-50 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
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
                                    className="h-10 px-5 rounded-xl border-neutral-200 font-bold uppercase tracking-wider text-xs"
                                >
                                    {ct.next}
                                </Button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
