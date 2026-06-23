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

    // Filter State
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('subcategory') || searchParams.get('category') || null);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000]);
    const [minRating, setMinRating] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 12;

    // Sync state with URL parameters dynamically
    useEffect(() => {
        const query = searchParams.get('search') || '';
        const cat = searchParams.get('subcategory') || searchParams.get('category') || null;
        setSearchQuery(query);
        setSelectedCategory(cat);
        setCurrentPage(1);
    }, [searchParams]);

    useEffect(() => {
        setIsLoading(true);
        const queryParams = new URLSearchParams({
            page: currentPage.toString(),
            limit: itemsPerPage.toString(),
            search: searchQuery,
            category: selectedCategory || '',
            sort: sortBy,
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

    // Derived Data
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

    // Filtering Logic
    const filteredProducts = apiProducts;
    const paginatedProducts = apiProducts;

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
                <h3 className="text-xs font-black text-neutral-900 uppercase tracking-[0.2em] mb-6">{ct.categories}</h3>
                <div className="space-y-2">
                    <button
                        onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
                        className={cn(
                            "w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all uppercase tracking-widest text-[10px] font-bold",
                            selectedCategory === null ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                        )}
                    >
                        {ct.allCategories}
                    </button>
                    {categoryOptions.map(cat => (
                        <button
                            key={cat.key}
                            onClick={() => { setSelectedCategory(cat.key); setCurrentPage(1); }}
                            className={cn(
                                "w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all uppercase tracking-widest text-[10px] font-bold",
                                (selectedCategory?.toLowerCase() === cat.key.toLowerCase() || selectedCategory?.toLowerCase().startsWith(cat.key.toLowerCase() + '-')) ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            <Button 
                variant="outline" 
                className="w-full h-11 rounded-xl border-dashed border-2 font-black uppercase tracking-widest text-[10px] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all"
                onClick={clearAllFilters}
            >
                <FilterX className="h-4 w-4 mr-2" />
                {ct.resetFilters}
            </Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 lg:py-10">
                <Breadcrumbs 
                    items={[
                        { label: t?.common?.products || 'Products', active: true }
                    ]} 
                />

                {/* Header — Premium style matching new-arrivals */}
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
                        <p className="text-gray-500 font-medium max-w-md">
                            {ct.headerDesc}
                        </p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-neutral-50 px-6 py-3 rounded-xl border border-neutral-100">
                                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1">{ct.totalItems}</span>
                                <span className="text-xl font-black text-neutral-900">{totalProducts} <span className="text-sm font-medium text-neutral-400">{ct.products}</span></span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* Desktop Sidebar Module */}
                    <aside className="hidden lg:block w-72 shrink-0">
                        <div className="sticky top-32">
                            <FilterContent />
                        </div>
                    </aside>

                    {/* Main Content Module */}
                    <main className="flex-1">
                        
                        {/* Toolbar — Matching new-arrivals */}
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-neutral-50/50 p-3 rounded-xl border border-neutral-100"
                        >
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                {/* Mobile Filter Trigger */}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" className="lg:hidden h-12 w-12 rounded-xl p-0 border-neutral-200 hover:bg-white hover:shadow-md transition-all">
                                            <SlidersHorizontal className="h-5 w-5" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
                                        <SheetHeader className="mb-8">
                                            <SheetTitle className="text-2xl font-black tracking-tighter">{ct.filters}</SheetTitle>
                                        </SheetHeader>
                                        <FilterContent />
                                    </SheetContent>
                                </Sheet>

                                <div className="relative flex-1 sm:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder={ct.searchPlaceholder}
                                        value={searchQuery}
                                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                        className="h-12 pl-12 pr-4 bg-white border-neutral-200 rounded-xl focus:ring-2 focus:ring-neutral-900/10 transition-all font-medium text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                <div className="hidden sm:flex items-center bg-white border border-neutral-100 rounded-xl p-1 shadow-sm">
                                    <button 
                                        onClick={() => setViewMode('grid')}
                                        className={cn(
                                            "h-10 w-10 flex items-center justify-center rounded-xl transition-all",
                                            viewMode === 'grid' ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/10" : "text-neutral-400 hover:text-black"
                                        )}
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('list')}
                                        className={cn(
                                            "h-10 w-10 flex items-center justify-center rounded-xl transition-all",
                                            viewMode === 'list' ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/10" : "text-neutral-400 hover:text-black"
                                        )}
                                    >
                                        <List className="h-4 w-4" />
                                    </button>
                                </div>

                                <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
                                    <SelectTrigger className="w-[180px] h-12 rounded-xl border-neutral-200 bg-white font-bold text-xs uppercase tracking-widest focus:ring-neutral-900/10 transition-all">
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
                                    className="h-11 px-6 rounded-xl border-neutral-200 font-bold uppercase tracking-wider text-xs"
                                >
                                    {ct.previous}
                                </Button>
                                <div className="flex items-center gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={cn(
                                                "w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold transition-all",
                                                currentPage === i + 1
                                                    ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/10"
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
                                    className="h-11 px-6 rounded-xl border-neutral-200 font-bold uppercase tracking-wider text-xs"
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
