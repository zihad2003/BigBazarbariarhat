'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Trash2,
    Edit3,
    Layers,
    Loader2,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoriesService, Category } from '@bigbazar/shared';

interface CategoryWithCount extends Category {
    _count?: {
        products: number;
    };
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        displayOrder: '0',
    });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await CategoriesService.getCategories();
            if (response.success && response.data) {
                setCategories(response.data);
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

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            const response = await CategoriesService.createCategory(formData);
            if (response.success) {
                setShowCreateModal(false);
                fetchCategories();
                setFormData({ name: '', slug: '', description: '', displayOrder: '0' });
            }
        } catch (error) {
            console.error('Manifestation failed:', error);
        } finally {
            setCreating(false);
        }
    };

    const deleteCategory = async (id: string) => {
        if (!confirm('Are you sure you want to decommission this collection?')) return;
        try {
            const response = await CategoriesService.deleteCategory(id);
            if (response.success) {
                fetchCategories();
            } else {
                alert(response.error);
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
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="h-16 px-10 bg-black text-white rounded-3xl text-[10px] font-black uppercase tracking-widest gap-3 shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus className="h-5 w-5" />
                    Inject Collection
                </Button>
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
                ) : categories.map((cat: Category) => (
                    <div key={cat.id} className="bg-white rounded-[3.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-900/5 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[8rem] opacity-30 group-hover:scale-110 transition-transform" />

                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                                <Layers className="h-7 w-7" />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => deleteCategory(cat.id)}
                                    className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 mb-8">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter italic">{cat.name}</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed line-clamp-1 italic">{cat.slug}</p>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Manifest Count</span>
                                <span className="text-lg font-black text-indigo-600 italic">{(cat as CategoryWithCount)._count?.products || 0} Units</span>
                            </div>
                            <Button variant="outline" className="h-10 px-4 rounded-xl border border-gray-100 hover:border-black transition-all">
                                <Edit3 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Injector Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 text-black">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowCreateModal(false)} />
                    <div className="bg-white w-full max-w-xl rounded-[4rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 bg-gray-50/50 border-b border-gray-50 flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic">Collection Injector</h2>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 italic">Define new taxonomic node</p>
                            </div>
                            <button onClick={() => setShowCreateModal(false)} className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-10 space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Entity Name</label>
                                <input
                                    required
                                    placeholder="e.g. Modern Aesthetics"
                                    className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                    value={formData.name}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setFormData({
                                            ...formData,
                                            name: val,
                                            slug: val.toLowerCase().replace(/ /g, '-')
                                        });
                                    }}
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Identification Slug</label>
                                <input
                                    required
                                    className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-mono text-xs text-indigo-600 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Operational Sequence</label>
                                <input
                                    type="number"
                                    className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-black text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                    value={formData.displayOrder}
                                    onChange={e => setFormData({ ...formData, displayOrder: e.target.value })}
                                />
                            </div>

                            <Button
                                disabled={creating}
                                className="w-full h-20 bg-black text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all gap-4"
                            >
                                {creating ? <Loader2 className="h-6 w-6 animate-spin" /> : <Layers className="h-6 w-6 text-indigo-400" />}
                                Manifest Collection Node
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
