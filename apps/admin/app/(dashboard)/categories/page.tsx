'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Plus,
    Search,
    Trash2,
    Edit,
    Layers,
    Package,
    Loader2
} from 'lucide-react';

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
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const deleteCategory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            if (res.ok) fetchCategories();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Categories</h1>
                    <p className="text-[13px] text-muted-foreground mt-0.5">Organize your products into groups.</p>
                </div>
                <Link
                    href="/categories/new"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add New Category
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Find category..."
                    className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="h-40 bg-card border border-border rounded-xl animate-pulse" />
                    ))
                ) : categories.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-card border border-border rounded-xl">
                        <Layers className="w-10 h-10 text-muted/30 mx-auto mb-3" />
                        <p className="text-[13px] text-muted-foreground">No categories found.</p>
                    </div>
                ) : categories.map((cat) => (
                    <div key={cat.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden border border-border">
                                {cat.image ? (
                                    <img src={cat.image} className="w-full h-full object-cover" />
                                ) : (
                                    <Layers className="w-6 h-6 text-muted-foreground" />
                                )}
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={`/categories/${cat.id}`} className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground">
                                    <Edit className="w-4 h-4" />
                                </Link>
                                <button
                                    onClick={() => deleteCategory(cat.id)}
                                    className="p-2 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[15px] font-semibold text-foreground mb-1">{cat.name}</h3>
                            <p className="text-[11px] text-muted-foreground font-mono">{cat.slug}</p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Package className="w-3.5 h-3.5" />
                                <span className="text-[12px] font-medium">{cat._count?.products || 0} Products</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
