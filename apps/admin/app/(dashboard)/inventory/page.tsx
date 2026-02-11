'use client';

import { useState, useEffect } from 'react';
import {
    Package,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Search,
    Filter,
    ArrowUpDown,
    RefreshCw,
    Edit3,
    ArrowRight,
    Loader2,
    Database,
    Binary,
    TrendingDown,
    Activity,
    Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function InventoryPage() {
    const [variants, setVariants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newStock, setNewStock] = useState<string>('');
    const [updating, setUpdating] = useState(false);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/inventory?q=${searchQuery}&status=${statusFilter}`);
            const result = await res.json();
            if (result.success) {
                setVariants(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchInventory();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, statusFilter]);

    const handleUpdateStock = async (id: string) => {
        setUpdating(true);
        try {
            const res = await fetch('/api/inventory', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, stockQuantity: newStock }),
            });
            if (res.ok) {
                setEditingId(null);
                fetchInventory();
            }
        } catch (error) {
            console.error('Stock update failed:', error);
        } finally {
            setUpdating(false);
        }
    };

    const getStockBadge = (quantity: number) => {
        if (quantity <= 0) return { label: 'Depleted', class: 'bg-rose-50 text-rose-500 border-rose-100', icon: XCircle };
        if (quantity <= 10) return { label: 'Critical', class: 'bg-amber-50 text-amber-500 border-amber-100', icon: AlertTriangle };
        return { label: 'Optimal', class: 'bg-emerald-50 text-emerald-500 border-emerald-100', icon: CheckCircle2 };
    };

    const counts = {
        total: variants.length,
        low: variants.filter(v => v.stockQuantity > 0 && v.stockQuantity <= 10).length,
        out: variants.filter(v => v.stockQuantity <= 0).length
    };

    return (
        <div className="space-y-12">
            {/* Master Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-gray-100 pb-12">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic">Stock Intelligence</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-3 uppercase italic">Monitor and calibrate the physical manifest of the enterprise</p>
                </div>
                <div className="flex gap-4">
                    <Button
                        onClick={() => fetchInventory()}
                        variant="outline"
                        className="h-16 px-8 border-2 rounded-3xl text-[10px] font-black uppercase tracking-widest gap-3 shadow-sm"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Synchronize
                    </Button>
                </div>
            </div>

            {/* Performance Banners */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Total SKU Nodes', value: counts.total, icon: Database, color: 'text-indigo-600' },
                    { label: 'Critical Variance', value: counts.low, icon: AlertTriangle, color: 'text-amber-500' },
                    { label: 'Inert Artifacts', value: counts.out, icon: XCircle, color: 'text-rose-500' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-all text-black">
                            <stat.icon className="h-20 w-20" />
                        </div>
                        <stat.icon className={`h-8 w-8 ${stat.color} mb-6`} />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">{stat.label}</p>
                        <h4 className="text-4xl font-black text-gray-900 tracking-tighter italic">{stat.value}</h4>
                    </div>
                ))}
            </div>

            {/* Matrix Filters */}
            <div className="bg-white rounded-[3rem] border border-gray-100 p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Identify artifact by SKU, Variant ID or Name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-gray-50 border border-transparent rounded-[1.5rem] text-base focus:bg-white focus:border-indigo-100 outline-none transition-all font-bold placeholder:text-gray-300"
                        />
                    </div>
                    <div className="flex gap-4">
                        {['ALL', 'LOW_STOCK', 'OUT_OF_STOCK'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setStatusFilter(f)}
                                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === f ? 'bg-black text-white shadow-xl' : 'bg-gray-50 text-gray-400 hover:text-black'}`}
                            >
                                {f.replace(/_/g, ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Inventory Manifest Table */}
            <div className="bg-white rounded-[4rem] border border-gray-100 overflow-hidden shadow-2xl shadow-gray-200/50">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50 text-left">
                                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Artifact Manifest</th>
                                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Identification (SKU)</th>
                                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Collection Path</th>
                                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Inventory Status</th>
                                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Current Quantum</th>
                                <th className="px-10 py-8 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Directives</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-40 text-center">
                                        <Loader2 className="h-16 w-16 animate-spin mx-auto text-indigo-600 mb-6" />
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">Interrogating Logistics Grid...</p>
                                    </td>
                                </tr>
                            ) : variants.map((v) => {
                                const status = getStockBadge(v.stockQuantity);
                                const Icon = status.icon;
                                return (
                                    <tr key={v.id} className="hover:bg-gray-50/50 transition-all group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center p-2 shadow-sm overflow-hidden group-hover:scale-110 transition-transform">
                                                    {v.images?.[0] ? <img src={v.images[0]} alt="" className="w-full h-full object-cover rounded-lg" /> : <Package className="h-8 w-8 text-gray-100" />}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-gray-900 tracking-tight italic text-lg">{v.product.name}</h4>
                                                    <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-1 italic">{v.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="font-mono text-xs font-black text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">{v.sku}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] italic">{v.product.category?.name || 'Unclassified'}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border flex items-center gap-2 w-fit ${status.class}`}>
                                                <Icon className="h-3 w-3" />
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            {editingId === v.id ? (
                                                <input
                                                    type="number"
                                                    className="w-24 h-12 px-4 bg-white border-2 border-indigo-600 rounded-xl font-black text-lg focus:outline-none"
                                                    value={newStock}
                                                    autoFocus
                                                    onChange={e => setNewStock(e.target.value)}
                                                />
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className={`text-2xl font-black italic tracking-tighter ${v.stockQuantity <= 10 ? 'text-amber-500' : 'text-gray-900'}`}>
                                                        {v.stockQuantity} <span className="text-[10px] text-gray-300 not-italic uppercase tracking-widest ml-1 font-bold">Units</span>
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                                {editingId === v.id ? (
                                                    <button
                                                        onClick={() => handleUpdateStock(v.id)}
                                                        disabled={updating}
                                                        className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-110 active:scale-90 transition-all"
                                                    >
                                                        {updating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(v.id);
                                                            setNewStock(v.stockQuantity.toString());
                                                        }}
                                                        className="p-4 bg-white shadow-xl border border-gray-100 rounded-2xl hover:bg-black hover:text-white transition-all group/btn"
                                                    >
                                                        <Edit3 className="h-5 w-5" />
                                                    </button>
                                                )}
                                                <button className="p-4 bg-white shadow-xl border border-gray-100 rounded-2xl hover:bg-black hover:text-white transition-all">
                                                    <Activity className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
