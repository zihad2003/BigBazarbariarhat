'use client';

import { useState, useEffect } from 'react';
import {
    Package,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Search,
    RefreshCw,
    Edit3,
    Database,
    Loader2,
    Save,
    X,
    TrendingDown,
    Layers
} from 'lucide-react';

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

    const handleUpdateStock = async (id: string, quantity: string) => {
        if (!quantity || isNaN(Number(quantity))) return;

        setUpdating(true);
        try {
            const res = await fetch('/api/inventory', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, stockQuantity: quantity }),
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

    const getStockStatus = (quantity: number) => {
        if (quantity <= 0) return { label: 'Out of Stock', class: 'bg-rose-50 text-rose-600 border-rose-100', icon: XCircle };
        if (quantity <= 10) return { label: 'Low Stock', class: 'bg-amber-50 text-amber-600 border-amber-100', icon: AlertTriangle };
        return { label: 'In Stock', class: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2 };
    };

    const counts = {
        total: variants.length,
        low: variants.filter(v => v.stockQuantity > 0 && v.stockQuantity <= 10).length,
        out: variants.filter(v => v.stockQuantity <= 0).length
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-border">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Inventory</h1>
                    <p className="text-[13px] text-muted-foreground mt-0.5">Manage your product stock levels and availability.</p>
                </div>
                <button
                    onClick={() => fetchInventory()}
                    className="px-4 py-2 border border-border rounded-lg text-[13px] font-medium hover:bg-muted/60 transition flex items-center gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Total Items', value: counts.total, icon: Layers, color: 'text-primary bg-primary/10' },
                    { label: 'Low Stock', value: counts.low, icon: TrendingDown, color: 'text-amber-600 bg-amber-50' },
                    { label: 'Out of Stock', value: counts.out, icon: XCircle, color: 'text-rose-600 bg-rose-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-5 shadow-sm">
                        <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                            <stat.icon className="w-4 h-4" />
                        </div>
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                        <p className="text-[20px] font-bold text-foreground mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by SKU or product name..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                    />
                </div>
                <div className="flex items-center gap-1.5 p-1 bg-muted/40 rounded-lg border border-border">
                    {['ALL', 'LOW_STOCK', 'OUT_OF_STOCK'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setStatusFilter(f)}
                            className={`px-4 py-1.5 rounded-md text-[12px] font-semibold transition-all ${statusFilter === f ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {f === 'ALL' ? 'All Items' : f.replace(/_/g, ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/20 border-b border-border">
                                <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">SKU</th>
                                <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-4 text-right text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading && variants.length === 0 ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-6 h-20 bg-muted/5"></td>
                                    </tr>
                                ))
                            ) : variants.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                                        <p className="text-[13px] text-muted-foreground">No inventory items found.</p>
                                    </td>
                                </tr>
                            ) : variants.map((v) => {
                                const status = getStockStatus(v.stockQuantity);
                                const Icon = status.icon;
                                return (
                                    <tr key={v.id} className="hover:bg-muted/10 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-muted rounded-lg border border-border flex-shrink-0 overflow-hidden">
                                                    {v.images?.[0] ? <img src={v.images[0]} className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-muted-foreground m-auto" />}
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-semibold text-foreground">{v.product.name}</p>
                                                    <p className="text-[11px] text-primary font-medium">{v.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-[11px] font-bold text-muted-foreground">{v.sku}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[12px] text-muted-foreground">{v.product.category?.name || 'Uncategorized'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold border flex items-center gap-1.5 w-fit ${status.class}`}>
                                                <Icon className="w-3 h-3" />
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {editingId === v.id ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="w-16 h-8 px-2 bg-background border border-primary rounded text-[13px] font-bold outline-none ring-2 ring-primary/20"
                                                        value={newStock}
                                                        autoFocus
                                                        onChange={e => setNewStock(e.target.value)}
                                                        onKeyDown={e => {
                                                            if (e.key === 'Enter') handleUpdateStock(v.id, newStock);
                                                            if (e.key === 'Escape') setEditingId(null);
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <p className={`text-[15px] font-bold ${v.stockQuantity <= 10 ? 'text-amber-600' : 'text-foreground'}`}>
                                                    {v.stockQuantity}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {editingId === v.id ? (
                                                    <>
                                                        <button
                                                            onClick={() => setEditingId(null)}
                                                            className="p-1.5 hover:bg-muted rounded text-muted-foreground"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStock(v.id, newStock)}
                                                            disabled={updating}
                                                            className="p-1.5 bg-primary text-primary-foreground rounded shadow-sm"
                                                        >
                                                            {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(v.id);
                                                            setNewStock(v.stockQuantity.toString());
                                                        }}
                                                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                )}
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
