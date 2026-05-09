'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { 
    Search, 
    Plus, 
    MoreHorizontal, 
    Edit2, 
    Trash2, 
    ExternalLink, 
    Copy, 
    Download, 
    ChevronLeft, 
    ChevronRight,
    Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn, formatPrice } from '@/lib/utils';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [sectors, setSectors] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch('/api/products?limit=1000'),
                fetch('/api/categories')
            ]);
            
            const prodData = await prodRes.json();
            const catData = await catRes.json();
            
            if (prodData.success && prodData.data) {
                setProducts(prodData.data);
            }
            if (catData.success && catData.data) {
                setSectors(catData.data);
            }
        } catch (err) {
            console.error('Failed to load admin products data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku?.toLowerCase().includes(searchQuery.toLowerCase());
        const catName = typeof p.category === 'object' ? p.category?.name : p.category;
        const matchesCategory = selectedCategory === 'all' || catName?.toLowerCase() === selectedCategory.toLowerCase();
        const matchesStatus = selectedStatus === 'all' || (selectedStatus === 'active' ? p.isActive !== false : p.isActive === false);
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const toggleSelectAll = () => {
        if (selectedProducts.length === filteredProducts.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(filteredProducts.map(p => p.id));
        }
    };

    const toggleSelectProduct = (id: string) => {
        if (selectedProducts.includes(id)) {
            setSelectedProducts(selectedProducts.filter(pId => pId !== id));
        } else {
            setSelectedProducts([...selectedProducts, id]);
        }
    };

    const toggleStatus = async (id: string, currentIsActive: boolean) => {
        const action = currentIsActive ? 'deactivate' : 'activate';
        if (!confirm(`Are you sure you want to ${action} this product?`)) return;

        const toastId = toast.loading(`Updating product status...`);
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentIsActive })
            });
            const data = await res.json();
            if (data.success) {
                setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: !currentIsActive } : p));
                toast.success(`Product status updated to ${!currentIsActive ? 'Active' : 'Inactive'}! 🎉`, { id: toastId });
            } else {
                toast.error(data.message || 'Failed to update status', { id: toastId });
            }
        } catch (err) {
            console.error('Failed to toggle product status:', err);
            toast.error('An error occurred while updating status.', { id: toastId });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product from the database? This action is permanent.')) return;

        const toastId = toast.loading('Deleting product from database...');
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                setProducts(prev => prev.filter(p => p.id !== id));
                toast.success('Product deleted successfully! 🎉', { id: toastId });
            } else {
                toast.error(data.message || 'Failed to delete product', { id: toastId });
            }
        } catch (err) {
            console.error('Failed to delete product:', err);
            toast.error('An error occurred while deleting product.', { id: toastId });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-8 bg-indigo-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Inventory Command</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Artifact Collection</h1>
                </div>
                <Link href="/admin/products/new">
                    <Button className="rounded-2xl h-14 px-8 bg-indigo-600 text-white hover:bg-indigo-700 transition-all font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 gap-3">
                        <Plus className="h-4 w-4" /> Manifest New Artifact
                    </Button>
                </Link>
            </div>

            {/* Filters & Actions Bar */}
            <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-6">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search by Name or SKU..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none appearance-none cursor-pointer min-w-[140px]"
                    >
                        <option value="all">All Sectors</option>
                        {sectors.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                    <select 
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none appearance-none cursor-pointer min-w-[140px]"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <Button variant="outline" className="h-14 px-6 rounded-2xl border-slate-100 text-[10px] font-black uppercase tracking-widest gap-2">
                        <Download className="h-4 w-4" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Bulk Actions */}
            <AnimatePresence>
                {selectedProducts.length > 0 && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-indigo-600 rounded-2xl p-4 flex items-center justify-between text-white shadow-xl shadow-indigo-600/20">
                            <div className="flex items-center gap-4 pl-4">
                                <span className="text-[11px] font-black uppercase tracking-widest">{selectedProducts.length} Artifacts Selected</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Products Table */}
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="py-6 px-8 w-10">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                    />
                                </th>
                                <th className="py-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Artifact</th>
                                <th className="py-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identifier (SKU)</th>
                                <th className="py-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sector</th>
                                <th className="py-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Price</th>
                                <th className="py-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Inventory</th>
                                <th className="py-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="py-6 px-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredProducts.map((p) => {
                                const mainImage = p.images?.[0]?.url || p.images?.[0] || '/placeholder.jpg';
                                const categoryName = typeof p.category === 'object' ? p.category?.name : p.category;
                                
                                return (
                                    <tr key={p.id} className={cn("group transition-colors hover:bg-slate-50/50", selectedProducts.includes(p.id) && "bg-indigo-50/30")}>
                                        <td className="py-6 px-8">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedProducts.includes(p.id)}
                                                onChange={() => toggleSelectProduct(p.id)}
                                                className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                            />
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                                                    <Image src={mainImage} alt={p.name} fill className="object-cover" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate max-w-[200px]">{p.name}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">ID: {p.id.split('-')[0]}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4 font-mono text-[11px] font-black text-slate-500 uppercase tracking-widest">{p.sku || 'N/A'}</td>
                                        <td className="py-6 px-4">
                                            <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-widest">{categoryName || 'General'}</span>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-slate-900 font-mono">{formatPrice(p.salePrice || p.basePrice)}</span>
                                                {p.salePrice && <span className="text-[9px] text-slate-400 line-through font-mono">{formatPrice(p.basePrice)}</span>}
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    p.stock > 10 ? "bg-emerald-500" : p.stock > 0 ? "bg-amber-500" : "bg-rose-500"
                                                )} />
                                                <span className="text-[11px] font-black text-slate-900 font-mono">{p.stock} Units</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <button 
                                                onClick={() => toggleStatus(p.id, p.isActive !== false)}
                                                className={cn(
                                                    "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
                                                    p.isActive !== false 
                                                        ? "bg-emerald-50 text-emerald-600 hover:bg-rose-50 hover:text-rose-600" 
                                                        : "bg-slate-100 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                                                )}
                                            >
                                                {p.isActive !== false ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/products/${p.id}/edit`}>
                                                    <button className="p-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all text-slate-400">
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(p.id)}
                                                    className="p-3 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all text-slate-400"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                                <div className="relative group/more">
                                                    <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all text-slate-400">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </button>
                                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover/more:opacity-100 group-hover/more:visible transition-all z-20 py-2">
                                                        <Link href={`/products/${p.slug}`} className="w-full px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 flex items-center gap-3">
                                                            <ExternalLink className="h-3 w-3" /> View On Site
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing 1 - {filteredProducts.length} of {products.length} Artifacts</p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-10 w-10 p-0 rounded-xl border-slate-100 text-slate-400 disabled:opacity-30" disabled>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-1">
                            <Button className="h-10 w-10 p-0 rounded-xl bg-indigo-600 text-white text-[10px] font-black">1</Button>
                        </div>
                        <Button variant="outline" className="h-10 w-10 p-0 rounded-xl border-slate-100 text-slate-400" disabled>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
