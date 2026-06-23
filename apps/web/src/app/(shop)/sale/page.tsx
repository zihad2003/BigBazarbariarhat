'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductGrid } from '@/components/shop/product-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Search, 
    SlidersHorizontal, 
    X, 
    LayoutGrid, 
    List,
    FilterX,
    Loader2,
    Sparkles
} from 'lucide-react';
import { 
    Sheet, 
    SheetContent, 
    SheetHeader, 
    SheetTitle, 
    SheetTrigger 
} from '@/components/ui/sheet';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { useLanguageStore, useTranslation } from '@bigbazar/shared';
import { Breadcrumbs } from '@/components/shop/breadcrumbs';
import { motion } from 'framer-motion';

// --- Local Translations ---
const localTranslations: Record<string, any> = {
    en: {
        headerSubtitle: 'Limited Time',
        headerTitle1: 'Flash ',
        headerTitle2: 'Sale',
        headerDesc: 'Grab the best deals before they\'re gone. Premium fashion at unbeatable prices.',
        totalItems: 'Total Items',
        products: 'products',
        searchPlaceholder: 'Search sale items...',
        allCategories: 'All Categories',
        sortNewest: 'Newest First',
        sortPriceLow: 'Price: Low to High',
        sortPriceHigh: 'Price: High to Low',
        filters: 'Filters',
        categories: 'Categories',
        clearFilters: 'Clear Filters',
        resetFilters: 'Reset Filters',
        noSaleItems: 'No sale items found at the moment.',
        clearFiltersLink: 'Clear filters',
        previous: 'Previous',
        next: 'Next',
        page: 'Page',
        of: 'of',
    },
    bn: {
        headerSubtitle: 'সীমিত সময়',
        headerTitle1: 'ফ্ল্যাশ ',
        headerTitle2: 'সেল',
        headerDesc: 'সেরা ডিলগুলো শেষ হওয়ার আগেই নিয়ে নিন। প্রিমিয়াম ফ্যাশন অবিশ্বাস্য দামে।',
        totalItems: 'মোট পণ্য',
        products: 'টি পণ্য',
        searchPlaceholder: 'সেলের পণ্য খুঁজুন...',
        allCategories: 'সকল ক্যাটাগরি',
        sortNewest: 'নতুন প্রথমে',
        sortPriceLow: 'দাম: কম থেকে বেশি',
        sortPriceHigh: 'দাম: বেশি থেকে কম',
        filters: 'ফিল্টার',
        categories: 'ক্যাটাগরি',
        clearFilters: 'ফিল্টার মুছুন',
        resetFilters: 'ফিল্টার রিসেট করুন',
        noSaleItems: 'বর্তমানে কোনো সেলের পণ্য পাওয়া যায়নি।',
        clearFiltersLink: 'ফিল্টার মুছুন',
        previous: 'পূর্ববর্তী',
        next: 'পরবর্তী',
        page: 'পৃষ্ঠা',
        of: 'এর মধ্যে',
    }
};

export default function SalePage() {
    const { language } = useLanguageStore();
    const t = useTranslation();
    const ct = localTranslations[language] || localTranslations.en;
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Filter State
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category') || null);
    const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'newest');
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
    const itemsPerPage = 12;

    // Fetch Categories
    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setCategories(data.data);
                }
            })
            .catch(err => console.error('Failed to fetch categories:', err));
    }, []);

    // Fetch Sale Products
    useEffect(() => {
        setLoading(true);
        const queryParams = new URLSearchParams({
            page: currentPage.toString(),
            limit: itemsPerPage.toString(),
            search: searchQuery,
            category: selectedCategory || '',
            sort: sortBy,
            onSale: 'true'
        });
        fetch(`/api/products?${queryParams.toString()}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProducts(data.data || []);
                    setTotal(data.pagination?.total || data.count || 0);
                    setTotalPages(data.pagination?.totalPages || Math.ceil((data.count || 0) / itemsPerPage));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch sale products:', err);
                setLoading(false);
            });
    }, [currentPage, searchQuery, selectedCategory, sortBy]);

    // Scroll to top when page changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedCategory(null);
        setSortBy('newest');
        setCurrentPage(1);
    };

    const FilterContent = () => (
        <div className="space-y-10">
            <div>
                <h3 className="text-xs font-black text-neutral-900 uppercase tracking-[0.2em] mb-6">{ct.categories}</h3>
                <div className="space-y-2">
                    <button
                        onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
                        className={cn(
                            "w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                            selectedCategory === null ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                        )}
                    >
                        {ct.allCategories}
                    </button>
                    {categories.map((cat: any) => (
                        <button
                            key={cat.id}
                            onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                            className={cn(
                                "w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                selectedCategory === cat.id ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                            )}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {(selectedCategory || searchQuery) && (
                <Button 
                    variant="outline" 
                    className="w-full h-11 rounded-xl border-dashed border-2 font-black uppercase tracking-widest text-[10px] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all"
                    onClick={clearAllFilters}
                >
                    <FilterX className="h-4 w-4 mr-2" />
                    {ct.resetFilters}
                </Button>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
                <Breadcrumbs 
                    items={[
                        { label: t?.common?.sale || 'Sale', active: true }
                    ]} 
                />

                {/* Header — Premium style matching products/new-arrivals */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-px w-8 bg-rose-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">{ct.headerSubtitle}</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-playfair font-bold tracking-tight text-neutral-900 leading-tight">
                            {ct.headerTitle1}<span className="text-rose-500 font-bold italic">{ct.headerTitle2}</span>
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
                            <div className="bg-rose-50 px-6 py-3 rounded-xl border border-rose-100">
                                <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest block mb-1">{ct.totalItems}</span>
                                <span className="text-xl font-black text-neutral-900">{total} <span className="text-sm font-medium text-neutral-400">{ct.products}</span></span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-16">
                    
                    {/* Mobile Filter Sheet */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="lg:hidden mb-4 w-full flex items-center justify-center gap-2 rounded-xl border-neutral-200 h-12 text-[10px] font-black uppercase tracking-widest">
                                <SlidersHorizontal className="h-4 w-4" /> {ct.filters}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
                            <SheetHeader className="mb-8">
                                <SheetTitle className="text-2xl font-black tracking-tighter">{ct.filters}</SheetTitle>
                            </SheetHeader>
                            <FilterContent />
                        </SheetContent>
                    </Sheet>

                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-72 shrink-0">
                        <div className="sticky top-32">
                            <FilterContent />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Toolbar — Matching products/new-arrivals */}
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 bg-neutral-50/50 p-4 rounded-xl border border-neutral-100"
                        >
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder={ct.searchPlaceholder}
                                        className="h-12 pl-12 pr-4 bg-white border-neutral-200 rounded-xl focus:ring-2 focus:ring-neutral-900/10 transition-all font-medium text-sm"
                                        value={searchQuery}
                                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
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
                                    </SelectContent>
                                </Select>
                            </div>
                        </motion.div>

                        {/* Products Grid */}
                        {loading ? (
                            <div className="py-20 flex justify-center">
                                <Loader2 className="h-10 w-10 animate-spin text-gray-300" />
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <ProductGrid products={products} isLoading={false} viewMode={viewMode} />

                                {/* Pagination */}
                                {totalPages > 1 && (
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
                            </>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-24 bg-neutral-50 rounded-2xl border border-neutral-100"
                            >
                                <Sparkles className="h-10 w-10 text-neutral-200 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg font-semibold">{ct.noSaleItems}</p>
                                <Button variant="link" onClick={clearAllFilters} className="mt-3 text-black font-bold text-sm uppercase tracking-wider">
                                    {ct.clearFiltersLink}
                                </Button>
                            </motion.div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
