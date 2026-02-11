'use client';

import { useState, useEffect } from 'react';
import {
    Tags,
    Plus,
    Search,
    Edit2,
    Trash2,
    Loader2,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Brand {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    productCount: number;
    isActive: boolean;
}

export default function BrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newBrand, setNewBrand] = useState('');

    useEffect(() => {
        // Mock data for development
        setTimeout(() => {
            setBrands([
                { id: '1', name: 'Nike', slug: 'nike', productCount: 45, isActive: true },
                { id: '2', name: 'Adidas', slug: 'adidas', productCount: 32, isActive: true },
                { id: '3', name: 'Puma', slug: 'puma', productCount: 18, isActive: true },
                { id: '4', name: 'Aarong', slug: 'aarong', productCount: 67, isActive: true },
                { id: '5', name: 'Yellow', slug: 'yellow', productCount: 24, isActive: true },
                { id: '6', name: 'Richman', slug: 'richman', productCount: 15, isActive: false },
                { id: '7', name: 'Ecstasy', slug: 'ecstasy', productCount: 38, isActive: true },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    const filteredBrands = brands.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddBrand = () => {
        if (!newBrand.trim()) return;
        const brand: Brand = {
            id: Date.now().toString(),
            name: newBrand.trim(),
            slug: newBrand.trim().toLowerCase().replace(/\s+/g, '-'),
            productCount: 0,
            isActive: true,
        };
        setBrands(prev => [...prev, brand]);
        setNewBrand('');
        setShowForm(false);
    };

    const toggleBrand = (id: string) => {
        setBrands(prev => prev.map(b =>
            b.id === id ? { ...b, isActive: !b.isActive } : b
        ));
    };

    const deleteBrand = (id: string) => {
        setBrands(prev => prev.filter(b => b.id !== id));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-gray-300" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">Brands</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage product brands</p>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-black text-white rounded-xl gap-2 font-bold"
                >
                    {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {showForm ? 'Cancel' : 'Add Brand'}
                </Button>
            </div>

            {/* Add Brand Form */}
            {showForm && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4">
                    <Input
                        placeholder="Brand name..."
                        value={newBrand}
                        onChange={(e) => setNewBrand(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddBrand()}
                        className="rounded-xl flex-1"
                        autoFocus
                    />
                    <Button onClick={handleAddBrand} className="rounded-xl font-bold bg-green-600 hover:bg-green-700">
                        Save
                    </Button>
                </div>
            )}

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search brands..."
                    className="pl-10 rounded-xl"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Brands Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBrands.map(brand => (
                    <div
                        key={brand.id}
                        className={`bg-white rounded-2xl p-6 border shadow-sm transition-all hover:shadow-md ${brand.isActive ? 'border-gray-100' : 'border-red-100 bg-red-50/30 opacity-60'}`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                                <Tags className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => toggleBrand(brand.id)}
                                    className={`p-2 rounded-lg transition-colors ${brand.isActive ? 'hover:bg-amber-50 text-gray-400 hover:text-amber-600' : 'hover:bg-green-50 text-gray-400 hover:text-green-600'}`}
                                    title={brand.isActive ? 'Deactivate' : 'Activate'}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => deleteBrand(brand.id)}
                                    className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <h3 className="font-black text-lg mb-1">{brand.name}</h3>
                        <p className="text-xs text-gray-400 font-medium mb-3">/{brand.slug}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 font-bold">{brand.productCount} products</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${brand.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                {brand.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredBrands.length === 0 && (
                <div className="text-center py-20">
                    <Tags className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">No brands found</p>
                </div>
            )}
        </div>
    );
}
