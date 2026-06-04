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
            const targetSlug = selectedCategory.toLowerCase();
            results = results.filter(p => {
                const catName = typeof p.category === 'object' ? p.category?.name : p.category;
                const catSlug = typeof p.category === 'object' ? p.category?.slug : null;
                
                return (
                    (catName && catName.toLowerCase() === targetSlug) ||
                    (catSlug && (catSlug.toLowerCase() === targetSlug || catSlug.toLowerCase().startsWith(`${targetSlug}-`))) ||
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
                                selectedCategory?.toLowerCase() === cat.key.toLowerCase() ? "bg-destructive text-white shadow-lg" : "text-gray-500 hover:bg-gray-100"
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>
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

                {/* Header */}
                <div className="mb-4 sm:mb-8">
                    <h1 className="text-xl sm:text-3xl lg:text-4xl font-playfair font-bold tracking-tight text-gray-900">
                        Shop <span className="text-destructive">Our Products</span>
                    </h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 lg:gap-12">
                    
                    {/* Desktop Sidebar Module */}
                    <aside className="hidden lg:block w-60 shrink-0">
                        <div className="sticky top-32">
                            <FilterContent />
                        </div>
                    </aside>

                    {/* Main Content Module */}
                    <main className="flex-1">
                        
                        {/* Toolbar — minimal row */}
                        <div className="flex items-center justify-between mb-4 sm:mb-8">
                            <div className="flex items-center gap-2">
                                {/* Mobile Filter Trigger */}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" className="lg:hidden h-8 w-8 rounded-lg p-0 border-gray-200">
                                            <SlidersHorizontal className="h-3.5 w-3.5" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
                                        <SheetHeader className="mb-8">
                                            <SheetTitle className="text-2xl font-black tracking-tighter">Filters</SheetTitle>
                                        </SheetHeader>
                                        <FilterContent />
                                    </SheetContent>
                                </Sheet>

                                <span className="text-xs text-gray-400 font-medium">{filteredProducts.length} products</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="hidden sm:flex items-center border border-gray-100 rounded-lg p-0.5">
                                    <button 
                                        onClick={() => setViewMode('grid')}
                                        className={cn(
                                            "h-7 w-7 flex items-center justify-center rounded-md transition-all",
                                            viewMode === 'grid' ? "bg-gray-900 text-white" : "text-gray-400 hover:text-black"
                                        )}
                                    >
                                        <LayoutGrid className="h-3.5 w-3.5" />
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('list')}
                                        className={cn(
                                            "h-7 w-7 flex items-center justify-center rounded-md transition-all",
                                            viewMode === 'list' ? "bg-gray-900 text-white" : "text-gray-400 hover:text-black"
                                        )}
                                    >
                                        <List className="h-3.5 w-3.5" />
                                    </button>
                                </div>

                                <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
                                    <SelectTrigger className="w-[120px] sm:w-[150px] h-8 rounded-lg border-gray-200 bg-white text-[10px] sm:text-xs font-medium focus:ring-black/5">
                                        <SelectValue placeholder="Sort" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                        <SelectItem value="newest" className="text-xs py-2">Newest</SelectItem>
                                        <SelectItem value="price_low" className="text-xs py-2">Price: Low to High</SelectItem>
                                        <SelectItem value="price_high" className="text-xs py-2">Price: High to Low</SelectItem>
                                        <SelectItem value="rating" className="text-xs py-2">Best Rating</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
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
