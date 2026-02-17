'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Plus,
    Search,
    Trash2,
    Edit3,
    Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/categories');
            const result = await res.json();
            if (result.success) {
                setCategories(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch collections:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const deleteCategory = async (id: string) => {
        if (!confirm('Are you sure you want to decommission this collection?')) return;
        try {
            const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (result.success) {
                fetchCategories();
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Termination failed:', error);
        }
    };

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-gray-100 pb-12">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic">Collections</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-3">Architect the taxonomy of the storefront catalog</p>
                </div>
                <Link href="/categories/new">
                    <Button
                        className="h-16 px-10 bg-black text-white rounded-3xl text-[10px] font-black uppercase tracking-widest gap-3 shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        <Plus className="h-5 w-5" />
                        Inject Collection
                    </Button>
                </Link>
            </div>

            {/* Matrix Console */}
            <div className="bg-white rounded-[3rem] border border-gray-100 p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Identify collection by name or slug..."
                            className="w-full pl-16 pr-8 py-5 bg-gray-50 border border-transparent rounded-[1.5rem] text-base focus:bg-white focus:border-indigo-100 outline-none transition-all font-bold placeholder:text-gray-300"
                        />
                    </div>
                </div>
            </div>

            {/* Collections Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {loading ? (
                    [...Array(8)].map((_, i) => (
                        <div key={i} className="h-64 bg-gray-50 rounded-[3.5rem] animate-pulse" />
                    ))
                ) : categories.map((cat) => (
                    <Link key={cat.id} href={`/categories/${cat.id}`}>
                        <div className="bg-white rounded-[3.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-900/5 transition-all group relative overflow-hidden h-full cursor-pointer">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[8rem] opacity-30 group-hover:scale-110 transition-transform" />
                            {cat.image && (
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity">
                                    <img src={cat.image} alt="" className="w-full h-full object-cover grayscale" />
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-10 relative z-10">
                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all shadow-sm relative overflow-hidden">
                                    {cat.image ? (
                                        <img src={cat.image} alt="" className="w-full h-full object-cover opacity-50 group-hover:opacity-100" />
                                    ) : (
                                        <Layers className="h-7 w-7" />
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            deleteCategory(cat.id);
                                        }}
                                        className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-100 z-20"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 mb-8 relative z-10">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tighter italic">{cat.name}</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed line-clamp-1 italic">{cat.slug}</p>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-50 relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Manifest Count</span>
                                    <span className="text-lg font-black text-indigo-600 italic">{cat._count?.products || 0} Units</span>
                                </div>
                                <div className="h-10 w-10 flex items-center justify-center rounded-xl border border-gray-100 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all">
                                    <Edit3 className="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
