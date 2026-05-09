'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    Plus, Search, Trash2, Edit3, Layers, Loader2, ArrowRight, Eye, EyeOff,
    ChevronDown, ChevronRight, Save, X, Image as ImageIcon, GripVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryItem {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    displayOrder: number;
    isHidden: boolean;
    parentId?: string | null;
    children?: CategoryItem[];
    _count?: { products: number };
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
    const [creating, setCreating] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const [formData, setFormData] = useState({
        name: '', slug: '', description: '', displayOrder: '0', image: '', parentId: '', isHidden: false,
    });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/categories?includeHidden=true');
            const result = await res.json();
            if (result.success && result.data) setCategories(result.data);
        } catch (error) {
            console.error('Failed to fetch collections:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    const resetForm = () => {
        setFormData({ name: '', slug: '', description: '', displayOrder: '0', image: '', parentId: '', isHidden: false });
        setEditingCategory(null);
    };

    const openEditModal = (cat: CategoryItem) => {
        setEditingCategory(cat);
        setFormData({
            name: cat.name, slug: cat.slug, description: cat.description || '',
            displayOrder: String(cat.displayOrder || 0), image: cat.image || '',
            parentId: cat.parentId || '', isHidden: cat.isHidden || false,
        });
        setShowCreateModal(true);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const confirmMsg = editingCategory 
            ? 'Are you sure you want to save changes to this collection?' 
            : 'Are you sure you want to create this new collection?';
        
        if (!confirm(confirmMsg)) return;

        setCreating(true);
        const toastId = toast.loading(editingCategory ? 'Saving collection...' : 'Creating collection...');
        try {
            if (editingCategory) {
                const res = await fetch(`/api/categories/${editingCategory.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...formData, newSlug: formData.slug !== editingCategory.slug ? formData.slug : undefined }),
                });
                const result = await res.json();
                if (!result.success) {
                    toast.error(result.error || 'Failed to save changes.', { id: toastId });
                    return;
                }
                toast.success('Collection updated successfully! 🎉', { id: toastId });
            } else {
                const res = await fetch('/api/categories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                const result = await res.json();
                if (!result.success) {
                    toast.error(result.error || 'Failed to create collection.', { id: toastId });
                    return;
                }
                toast.success('Collection created successfully! 🎉', { id: toastId });
            }
            setShowCreateModal(false);
            resetForm();
            fetchCategories();
        } catch (error: any) {
            console.error('Save failed:', error);
            toast.error(error.message || 'An unexpected error occurred.', { id: toastId });
        } finally {
            setCreating(false);
        }
    };

    const deleteCategory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this collection and all its subcategories? This action is permanent.')) return;
        const toastId = toast.loading('Deleting collection...');
        try {
            const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (result.success) {
                toast.success('Collection deleted successfully! 🎉', { id: toastId });
                fetchCategories();
            } else {
                toast.error(result.error || 'Failed to delete collection.', { id: toastId });
            }
        } catch (error: any) {
            console.error('Delete failed:', error);
            toast.error(error.message || 'An unexpected error occurred.', { id: toastId });
        }
    };

    const toggleVisibility = async (cat: CategoryItem) => {
        const action = cat.isHidden ? 'show' : 'hide';
        if (!confirm(`Are you sure you want to ${action} this collection on the storefront?`)) return;

        const toastId = toast.loading('Updating collection visibility...');
        try {
            const res = await fetch(`/api/categories/${cat.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isHidden: !cat.isHidden }),
            });
            const result = await res.json();
            if (result.success) {
                toast.success(`Collection is now ${!cat.isHidden ? 'Hidden' : 'Visible'}! 🎉`, { id: toastId });
                fetchCategories();
            } else {
                toast.error(result.error || 'Failed to update visibility.', { id: toastId });
            }
        } catch (error: any) {
            console.error('Toggle failed:', error);
            toast.error(error.message || 'An unexpected error occurred.', { id: toastId });
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-gray-100 pb-12">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic">Collections</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-3">
                        Manage storefront categories — Men, Women, Kids, Wedding Touch & subcategories
                    </p>
                </div>
                <Button
                    onClick={() => { resetForm(); setShowCreateModal(true); }}
                    className="h-16 px-10 bg-black text-white rounded-3xl text-[10px] font-black uppercase tracking-widest gap-3 shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus className="h-5 w-5" /> Add Collection
                </Button>
            </div>

            {/* Categories List */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-20 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
                    </div>
                ) : categories.length === 0 ? (
                    <div className="p-20 text-center">
                        <Layers className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-sm font-bold text-gray-400">No collections yet. Create your first one!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {categories.map((cat, idx) => (
                            <div key={cat.id}>
                                {/* Parent Category Row */}
                                <div className={`flex items-center gap-6 px-10 py-6 hover:bg-gray-50/50 transition-all group ${cat.isHidden ? 'opacity-50' : ''}`}>
                                    <span className="text-xs font-black text-gray-300 w-8 text-center">{cat.displayOrder}</span>
                                    <button onClick={() => toggleExpand(cat.id)} className="p-1">
                                        {(cat.children?.length || 0) > 0 ? (
                                            expandedCategories.has(cat.id)
                                                ? <ChevronDown className="h-4 w-4 text-gray-400" />
                                                : <ChevronRight className="h-4 w-4 text-gray-400" />
                                        ) : <div className="w-4" />}
                                    </button>
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all shadow-sm overflow-hidden">
                                        {cat.image ? (
                                            <img src={cat.image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <Layers className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-black text-gray-900 tracking-tight">{cat.name}</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{cat.slug} · {cat._count?.products || 0} products · {cat.children?.length || 0} subcategories</p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => toggleVisibility(cat)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${cat.isHidden ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-green-50 text-green-500 border-green-100'}`} title={cat.isHidden ? 'Show on storefront' : 'Hide from storefront'}>
                                            {cat.isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                        <button onClick={() => openEditModal(cat)} className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all border border-indigo-100">
                                            <Edit3 className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => deleteCategory(cat.id)} className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-100">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Subcategories */}
                                {expandedCategories.has(cat.id) && cat.children && cat.children.length > 0 && (
                                    <div className="bg-gray-50/30">
                                        {cat.children.map(sub => (
                                            <div key={sub.id} className={`flex items-center gap-6 pl-24 pr-10 py-4 hover:bg-gray-50 transition-all group ${sub.isHidden ? 'opacity-50' : ''}`}>
                                                <span className="text-[10px] font-bold text-gray-300 w-8 text-center">{sub.displayOrder}</span>
                                                <div className="w-2 h-2 rounded-full bg-gray-300" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-700">{sub.name}</p>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{sub.slug} · {(sub as any)._count?.products || 0} products</p>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button onClick={() => toggleVisibility(sub as CategoryItem)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all text-xs ${sub.isHidden ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-500'}`}>
                                                        {sub.isHidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                                    </button>
                                                    <button onClick={() => deleteCategory(sub.id)} className="w-8 h-8 bg-rose-50 text-rose-500 rounded-lg flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all text-xs">
                                                        <Trash2 className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 text-black">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => { setShowCreateModal(false); resetForm(); }} />
                    <div className="bg-white w-full max-w-xl rounded-[4rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 bg-gray-50/50 border-b border-gray-50 flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic">
                                    {editingCategory ? 'Edit Collection' : 'New Collection'}
                                </h2>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 italic">
                                    {editingCategory ? 'Update category details' : 'Add a new storefront category'}
                                </p>
                            </div>
                            <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-10 space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Category Name *</label>
                                <input required placeholder="e.g. Men, Women, Kids(Boys)" className="w-full h-14 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none" value={formData.name}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setFormData({ ...formData, name: val, slug: editingCategory ? formData.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') });
                                    }}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">URL Slug *</label>
                                <input required className="w-full h-14 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-mono text-xs text-indigo-600 focus:bg-white focus:border-indigo-600 transition-all outline-none" value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Display Order</label>
                                    <input type="number" className="w-full h-14 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-black text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none" value={formData.displayOrder}
                                        onChange={e => setFormData({ ...formData, displayOrder: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Parent Category</label>
                                    <select className="w-full h-14 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none appearance-none" value={formData.parentId}
                                        onChange={e => setFormData({ ...formData, parentId: e.target.value })}
                                    >
                                        <option value="">None (Top Level)</option>
                                        {categories.filter(c => c.id !== editingCategory?.id).map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Cover Image URL</label>
                                <input placeholder="https://images.unsplash.com/..." className="w-full h-14 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none text-xs" value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={formData.isHidden} onChange={e => setFormData({ ...formData, isHidden: e.target.checked })} className="w-5 h-5 rounded-lg accent-indigo-600" />
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Hidden from storefront navigation</span>
                                </label>
                            </div>

                            <Button disabled={creating} className="w-full h-16 bg-black text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all gap-4">
                                {creating ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-5 w-5 text-indigo-400" />}
                                {editingCategory ? 'Save Changes' : 'Create Collection'}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
