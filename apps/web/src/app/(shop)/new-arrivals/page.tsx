'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/shop/product-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Search, 
    SlidersHorizontal, 
    FilterX,
    LayoutGrid,
    List,
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

export default function NewArrivalsPage() {
    // UI State
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [apiProducts, setApiProducts] = useState<any[]>([]);

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string>('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const categories = ['All Categories', 'New Arrivals', 'Men', 'Women', 'Kids(Boys)', 'Kids(Girls)', 'Wedding Touch', 'Sale'];

    // Load actual products from Database
    useEffect(() => {
        setIsLoading(true);
        fetch('/api/products?sort=newest&limit=100')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setApiProducts(data.data);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch new arrivals:', err);
                setIsLoading(false);
            });
    }, []);

    // Filtering Logic
    const filteredProducts = useMemo(() => {
        let results = [...apiProducts];

        // Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            results = results.filter(p => 
                p.name.toLowerCase().includes(query) || 
                (p.description || '').toLowerCase().includes(query)
            );
        }

        // Category
        if (selectedCategory && selectedCategory !== 'All Categories') {
            results = results.filter(p => {
                const catName = typeof p.category === 'object' ? p.category?.name : p.category;
                return catName?.toLowerCase() === selectedCategory.toLowerCase();
            });
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
                default: return new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime();
            }
        });

        return results;
    }, [apiProducts, searchQuery, selectedCategory, sortBy]);

    // Pagination
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    }, [filteredProducts, currentPage]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedCategory(null);
        setSortBy('newest');
        setCurrentPage(1);
    };

    const FilterContent = () => (
        <div className="space-y-10">
            <div>
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-6">Categories</h3>
                <div className="space-y-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => { setSelectedCategory(cat === 'All Categories' ? null : cat); setCurrentPage(1); }}
                            className={cn(
                                "w-full text-left px-4 py-2 rounded-xl text-sm transition-all",
                                (selectedCategory === cat || (cat === 'All Categories' && selectedCategory === null)) ? "bg-foreground text-white font-bold" : "text-gray-500 hover:bg-gray-100"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

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
                            <div className="h-px w-8 bg-destructive" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-destructive">Just In</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-playfair font-bold tracking-tight text-gray-900 leading-tight">
                            Shop <span className="text-destructive">New Arrivals</span>
                        </h1>
                        <p className="text-gray-500 font-medium max-w-md">
                            Explore our latest masterworks and fresh additions to the collection.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Total Items</span>
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
                                        placeholder="Search new items..."
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
                                        <SelectItem value="newest" className="font-bold text-xs uppercase tracking-widest py-3">Newest First</SelectItem>
                                        <SelectItem value="price_low" className="font-bold text-xs uppercase tracking-widest py-3">Price: Low to High</SelectItem>
                                        <SelectItem value="price_high" className="font-bold text-xs uppercase tracking-widest py-3">Price: High to Low</SelectItem>
                                        <SelectItem value="rating" className="font-bold text-xs uppercase tracking-widest py-3">Best Rating</SelectItem>
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