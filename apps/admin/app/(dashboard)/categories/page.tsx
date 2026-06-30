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
    Loader2,
    FolderOpen,
    Tag
} from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/use-toast';

function CategoryImage({ src, alt, isParent = false }: { src?: string | null; alt: string; isParent?: boolean }) {
    const [errored, setErrored] = useState(!src || src.trim() === '');

    useEffect(() => {
        setErrored(!src || src.trim() === '');
    }, [src]);

    if (errored) {
        return isParent ? (
            <FolderOpen className="w-7 h-7 text-primary/70 animate-pulse-subtle" />
        ) : (
            <Tag className="w-4 h-4 text-muted-foreground/60 animate-pulse-subtle" />
        );
    }

    return (
        <img
            src={src!}
            className="w-full h-full object-cover"
            alt={alt}
            onError={() => setErrored(true)}
        />
    );
}

export default function CategoriesPage() {
    const { toast } = useToast();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Custom confirm dialog state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

    const fetchCategories = async (showLoader = false) => {
        if (showLoader) setLoading(true);
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
        fetchCategories(true);
    }, []);

    const handleDeleteClick = (id: string) => {
        setCategoryToDelete(id);
        setConfirmOpen(true);
    };

    const deleteCategory = async () => {
        if (!categoryToDelete) return;
        setDeletingId(categoryToDelete);
        setConfirmOpen(false);
        try {
            const res = await fetch(`/api/categories/${categoryToDelete}`, { method: 'DELETE' });
            if (res.ok) {
                toast({
                    title: 'Category deleted',
                    description: 'The category was successfully deleted.',
                });
                await fetchCategories();
            } else {
                toast({
                    title: 'Error',
                    description: 'Failed to delete category.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Delete failed:', error);
            toast({
                title: 'Error',
                description: 'An unexpected error occurred.',
                variant: 'destructive',
            });
        } finally {
            setDeletingId(null);
            setCategoryToDelete(null);
        }
    };

    // Structural Filter Helpers
    const parentCategories = categories.filter(cat => !cat.parentId);
    
    const getSubcategories = (parentId: string) => {
        return categories.filter(cat => cat.parentId === parentId);
    };

    // Filter parents and children based on search query
    const filteredParents = parentCategories.filter(parent => {
        const matchesParent = parent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              parent.slug.toLowerCase().includes(searchQuery.toLowerCase());
        
        const subcategories = getSubcategories(parent.id);
        const matchesChildren = subcategories.some(sub => 
            sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.slug.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return matchesParent || matchesChildren;
    });

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Categories & Navigation</h1>
                    <p className="text-[13px] text-muted-foreground mt-0.5">
                        Manage your storefront's navigation menus, parent collections, and subcategories.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/categories/new"
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create Category
                    </Link>
                </div>
            </div>

            {/* Filter and Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search categories or subcategories..."
                        className="w-full h-11 pl-10 pr-4 bg-card border border-border rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                    />
                </div>
                
                <div className="flex items-center gap-4 text-[12px] text-muted-foreground font-medium bg-muted/40 px-4 py-2 rounded-xl border border-border/60">
                    <span className="flex items-center gap-1.5">
                        <FolderOpen className="w-3.5 h-3.5 text-primary" />
                        {parentCategories.length} Parent Sections
                    </span>
                    <span className="w-1 h-1 bg-border rounded-full" />
                    <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-500" />
                        {categories.filter(c => c.parentId).length} Subcategories
                    </span>
                </div>
            </div>

            {/* Structured Proportional Grid */}
            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-80 bg-card border border-border rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : filteredParents.length === 0 ? (
                <div className="py-24 text-center bg-card border border-border rounded-2xl max-w-xl mx-auto">
                    <Layers className="w-12 h-12 text-muted/30 mx-auto mb-4" />
                    <h3 className="text-sm font-semibold text-foreground">No Categories Found</h3>
                    <p className="text-[12px] text-muted-foreground mt-1">Try refining your search term or create a new parent category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredParents.map((parent) => {
                        const allSubs = getSubcategories(parent.id);
                        const subs = searchQuery
                            ? allSubs.filter(sub =>
                                sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                sub.slug.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            : allSubs;

                        return (
                            <div key={parent.id} className="bg-card border border-border rounded-2xl flex flex-col hover:border-border/100 transition-colors shadow-sm overflow-hidden group">
                                {/* Parent Banner Header */}
                                <div className="p-6 border-b border-border bg-muted/20 relative">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            {/* Parent Image Cover */}
                                            <div className="w-16 h-16 rounded-xl bg-background border border-border overflow-hidden shrink-0 flex items-center justify-center relative">
                                                <CategoryImage src={parent.image} alt={parent.name} isParent />
                                            </div>
                                            <div>
                                                <h2 className="text-[16px] font-bold text-foreground flex items-center gap-2">
                                                    {parent.name}
                                                </h2>
                                                <p className="text-[11px] font-mono text-muted-foreground mt-0.5">{parent.slug}</p>
                                                <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1 font-medium">
                                                    <Package className="w-3.5 h-3.5 text-muted-foreground" />
                                                    {parent._count?.products || 0} Products directly assigned
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Actions for Parent Category */}
                                        <div className="flex items-center gap-1 bg-background border border-border p-1 rounded-lg">
                                            <Link href={`/categories/${parent.id}`} className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors" title="Edit Parent Section">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            {parent.slug !== 'uncategorized' && (
                                                <button
                                                    onClick={() => handleDeleteClick(parent.id)}
                                                    disabled={deletingId !== null}
                                                    className="p-2 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                                                    title="Delete Parent Section"
                                                >
                                                    {deletingId === parent.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin text-destructive" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Nested Subcategories Section */}
                                <div className="flex-1 p-6 space-y-3 bg-card overflow-y-auto max-h-[350px] scrollbar-hide">
                                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                                        Subcategories ({subs.length})
                                    </h4>
                                    
                                    {subs.length === 0 ? (
                                        <div className="py-8 text-center bg-muted/20 border border-dashed border-border/80 rounded-xl">
                                            <p className="text-[12px] text-muted-foreground">No dynamic subcategories configured.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-border border border-border rounded-xl bg-muted/10 overflow-hidden">
                                            {subs.map((sub) => (
                                                <div key={sub.id} className="p-4 flex items-center justify-between gap-4 bg-background/50 hover:bg-background transition-colors group/row">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center overflow-hidden border border-border shrink-0">
                                                            <CategoryImage src={sub.image} alt={sub.name} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h5 className="text-[13px] font-semibold text-foreground truncate">{sub.name}</h5>
                                                            <p className="text-[10px] font-mono text-muted-foreground truncate">{sub.slug}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <span className="text-[11px] font-bold text-muted-foreground bg-muted/60 px-2.5 py-0.5 rounded-full border border-border/40">
                                                            {sub._count?.products || 0} items
                                                        </span>
                                                        <div className="flex items-center bg-background border border-border rounded-lg p-0.5 opacity-0 group-hover/row:opacity-100 transition-opacity shadow-sm">
                                                            <Link href={`/categories/${sub.id}`} className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                                                                <Edit className="w-3.5 h-3.5" />
                                                            </Link>
                                                            {sub.slug !== 'uncategorized' && (
                                                                <button 
                                                                    onClick={() => handleDeleteClick(sub.id)} 
                                                                    disabled={deletingId !== null}
                                                                    className="p-1.5 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive disabled:opacity-50"
                                                                >
                                                                    {deletingId === sub.id ? (
                                                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-destructive" />
                                                                    ) : (
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    )}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Footer quick add portal */}
                                <div className="p-4 border-t border-border bg-muted/10 flex justify-end">
                                    <Link
                                        href={`/categories/new?parentId=${parent.id}`}
                                        className="text-[12px] font-bold text-primary hover:text-primary/85 flex items-center gap-1 bg-background px-3 py-1.5 rounded-lg border border-border hover:shadow-sm transition-all"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Add Subcategory to {parent.name}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <ConfirmDialog
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={deleteCategory}
                title="Delete Category?"
                description="Are you sure you want to delete this category? All of its subcategories will be disconnected."
                confirmText="Delete Category"
                variant="danger"
            />
        </div>
    );
}
