'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
    onFilterChange: (filters: any) => void;
    activeFilters: any;
    onClearAll: () => void;
}

export function FilterSidebar({ onFilterChange, activeFilters, onClearAll }: FilterSidebarProps) {
    const [metadata, setMetadata] = useState<{
        categories: any[];
        brands: any[];
        sizes: string[];
        colors: { name: string; hex: string | null }[];
    } | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchMetadata() {
            try {
                const res = await fetch('/api/products/filters');
                const result = await res.json();
                if (result.success) setMetadata(result.data);
            } catch (error) {
                console.error('Failed to fetch filter metadata:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchMetadata();
    }, []);

    const handleCategoryToggle = (slug: string) => {
        const categories = activeFilters.category === slug ? undefined : slug;
        onFilterChange({ category: categories });
    };

    const handleBrandToggle = (slug: string) => {
        const brand = activeFilters.brand === slug ? undefined : slug;
        onFilterChange({ brand });
    };

    const handleSizeToggle = (size: string) => {
        const sizes = activeFilters.sizes || [];
        const newSizes = sizes.includes(size)
            ? sizes.filter((s: string) => s !== size)
            : [...sizes, size];
        onFilterChange({ sizes: newSizes.length > 0 ? newSizes : undefined });
    };

    const handleColorToggle = (color: string) => {
        const colors = activeFilters.colors || [];
        const newColors = colors.includes(color)
            ? colors.filter((c: string) => c !== color)
            : [...colors, color];
        onFilterChange({ colors: newColors.length > 0 ? newColors : undefined });
    };

    const handlePriceChange = (values: number[]) => {
        onFilterChange({ minPrice: values[0], maxPrice: values[1] });
    };

    const handleRatingChange = (rating: number) => {
        onFilterChange({ rating: activeFilters.rating === rating ? undefined : rating });
    };

    if (isLoading || !metadata) {
        return (
            <div className="space-y-8 animate-pulse">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-4">
                        <div className="h-4 w-24 bg-gray-100 rounded" />
                        <div className="space-y-2">
                            <div className="h-8 w-full bg-gray-50 rounded-xl" />
                            <div className="h-8 w-full bg-gray-50 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20 lg:pb-0">
            {/* Category Filter */}
            <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 px-1">Categories</h3>
                <div className="space-y-3">
                    {metadata.categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryToggle(cat.slug)}
                            aria-pressed={activeFilters.category === cat.slug}
                            className={cn(
                                "flex items-center justify-between w-full group p-3 rounded-2xl transition-all",
                                activeFilters.category === cat.slug ? "bg-black text-white shadow-xl shadow-black/10" : "hover:bg-gray-100 text-gray-600"
                            )}
                        >
                            <span className="font-bold">{cat.name}</span>
                            <ChevronDown className={cn("h-4 w-4 opacity-0 group-hover:opacity-100 -rotate-90 transition-all", activeFilters.category === cat.slug && "opacity-100")} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Filter */}
            <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 px-1">Price Range</h3>
                <div className="px-1 space-y-6">
                    <Slider
                        defaultValue={[activeFilters.minPrice || 0, activeFilters.maxPrice || 50000]}
                        max={50000}
                        step={500}
                        onValueCommit={handlePriceChange}
                        className="my-10"
                    />
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">Min</span>
                            <span className="font-bold">৳{activeFilters.minPrice || 0}</span>
                        </div>
                        <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">Max</span>
                            <span className="font-bold">৳{activeFilters.maxPrice || 50000}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Brands Filter */}
            {metadata.brands.length > 0 && (
                <div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 px-1">Brands</h3>
                    <div className="space-y-3">
                        {metadata.brands.map((brand) => (
                            <div key={brand.id} className="flex items-center space-x-3 p-1">
                                <Checkbox
                                    id={brand.id}
                                    checked={activeFilters.brand === brand.slug}
                                    onCheckedChange={() => handleBrandToggle(brand.slug)}
                                />
                                <label
                                    htmlFor={brand.id}
                                    className="text-sm font-bold text-gray-600 cursor-pointer select-none"
                                >
                                    {brand.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Rating Filter */}
            <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 px-1">Average Rating</h3>
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => handleRatingChange(rating)}
                            aria-label={`Rated ${rating} stars and up`}
                            aria-pressed={activeFilters.rating === rating}
                            className={cn(
                                "flex items-center gap-3 w-full p-2 rounded-xl transition-all",
                                activeFilters.rating === rating ? "bg-amber-50 text-amber-600" : "hover:bg-gray-50 text-gray-500"
                            )}
                        >
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={cn("h-4 w-4", i < rating ? "fill-current" : "text-gray-200")} />
                                ))}
                            </div>
                            <span className="text-xs font-bold">& Up</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Colors Filter */}
            {metadata.colors.length > 0 && (
                <div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 px-1">Select Color</h3>
                    <div className="flex flex-wrap gap-4 px-1">
                        {metadata.colors.map((color) => (
                            <button
                                key={color.name}
                                onClick={() => handleColorToggle(color.name)}
                                aria-label={`Color: ${color.name}`}
                                aria-pressed={activeFilters.colors?.includes(color.name)}
                                className={cn(
                                    "w-10 h-10 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center relative",
                                    activeFilters.colors?.includes(color.name) ? "border-black scale-110" : "border-gray-100 shadow-sm"
                                )}
                                title={color.name}
                            >
                                <span
                                    className="w-full h-full rounded-full"
                                    style={{ backgroundColor: color.hex || '#ccc' }}
                                />
                                {activeFilters.colors?.includes(color.name) && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <X className={cn("h-4 w-4", color.name.toLowerCase() === 'white' ? 'text-black' : 'text-white')} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Sizes Filter */}
            {metadata.sizes.length > 0 && (
                <div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 px-1">Select Size</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {metadata.sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => handleSizeToggle(size)}
                                aria-pressed={activeFilters.sizes?.includes(size)}
                                className={cn(
                                    "aspect-square flex items-center justify-center border-2 rounded-xl text-xs font-black transition-all",
                                    activeFilters.sizes?.includes(size) ? "bg-black text-white border-black scale-105 shadow-xl" : "border-gray-100 hover:border-gray-300 text-gray-500"
                                )}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Availability Filter */}
            <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 px-1">Availability</h3>
                <div className="flex items-center space-x-3 p-1">
                    <Checkbox
                        id="inStock"
                        checked={activeFilters.inStock === true}
                        onCheckedChange={(checked: boolean) => onFilterChange({ inStock: checked ? true : undefined })}
                    />
                    <label
                        htmlFor="inStock"
                        className="text-sm font-bold text-gray-600 cursor-pointer select-none"
                    >
                        In Stock Only
                    </label>
                </div>
            </div>

            <Button
                variant="ghost"
                className="w-full text-red-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-50 hover:text-red-600 transition-all rounded-2xl h-12"
                onClick={onClearAll}
            >
                Clear all filters
            </Button>
        </div>
    );
}
