'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Package,
    Search,
    AlertTriangle,
    CheckCircle2,
    ArrowUpDown,
    Loader2,
    RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface InventoryItem {
    id: string;
    name: string;
    sku: string;
    stockQuantity: number;
    category: string;
    basePrice: number;
    isActive: boolean;
}

function StockBadge({ stock }: { stock: number }) {
    if (stock <= 0)
        return <Badge className="bg-red-100 text-red-700 border-red-200 font-bold">Out of Stock</Badge>;
    if (stock <= 10)
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200 font-bold">Low Stock ({stock})</Badge>;
    return <Badge className="bg-green-100 text-green-700 border-green-200 font-bold">In Stock ({stock})</Badge>;
}

export default function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
    const [sortBy, setSortBy] = useState<'stock_asc' | 'stock_desc' | 'name'>('stock_asc');

    const fetchInventory = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ search, filter, sortBy });
            const res = await fetch(`/api/admin/inventory?${params}`);
            const result = await res.json();
            if (result.success) {
                setItems(result.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
            // Mock data for development
            setItems([
                { id: '1', name: 'Premium Cotton Kurta', sku: 'KRT-001', stockQuantity: 45, category: "Men's Fashion", basePrice: 899, isActive: true },
                { id: '2', name: 'Classic White Sneaker', sku: 'SNK-002', stockQuantity: 5, category: 'Footwear', basePrice: 2499, isActive: true },
                { id: '3', name: 'Silk Saree Elegance', sku: 'SRE-003', stockQuantity: 0, category: "Women's Fashion", basePrice: 1799, isActive: true },
                { id: '4', name: 'Bamboo Watch Set', sku: 'WCH-004', stockQuantity: 2, category: 'Accessories', basePrice: 1199, isActive: true },
                { id: '5', name: 'Denim Jogger Pants', sku: 'JGR-005', stockQuantity: 78, category: "Men's Fashion", basePrice: 699, isActive: true },
                { id: '6', name: 'Summer Floral Dress', sku: 'DRS-006', stockQuantity: 3, category: "Women's Fashion", basePrice: 999, isActive: true },
                { id: '7', name: 'Leather Crossbody Bag', sku: 'BAG-007', stockQuantity: 22, category: 'Accessories', basePrice: 1099, isActive: true },
                { id: '8', name: 'Organic Cotton T-Shirt', sku: 'TSH-008', stockQuantity: 0, category: "Men's Fashion", basePrice: 499, isActive: false },
            ]);
        } finally {
            setLoading(false);
        }
    }, [search, filter, sortBy]);

    useEffect(() => {
        const timer = setTimeout(fetchInventory, 300);
        return () => clearTimeout(timer);
    }, [fetchInventory]);

    const filteredItems = items.filter(item => {
        if (filter === 'low') return item.stockQuantity > 0 && item.stockQuantity <= 10;
        if (filter === 'out') return item.stockQuantity <= 0;
        return true;
    });

    const outOfStock = items.filter(i => i.stockQuantity <= 0).length;
    const lowStock = items.filter(i => i.stockQuantity > 0 && i.stockQuantity <= 10).length;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">Inventory</h1>
                    <p className="text-gray-500 font-medium mt-1">Monitor and manage product stock levels</p>
                </div>
                <Button variant="outline" onClick={fetchInventory} className="gap-2 rounded-xl">
                    <RefreshCw className="h-4 w-4" /> Refresh
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Package className="h-5 w-5 text-blue-500" />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Products</span>
                    </div>
                    <p className="text-3xl font-black">{items.length}</p>
                </div>
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Low Stock</span>
                    </div>
                    <p className="text-3xl font-black text-amber-700">{lowStock}</p>
                </div>
                <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Out of Stock</span>
                    </div>
                    <p className="text-3xl font-black text-red-700">{outOfStock}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by name or SKU..."
                        className="pl-10 rounded-xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                    {(['all', 'low', 'out'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${filter === f ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {f === 'all' ? 'All' : f === 'low' ? 'Low Stock' : 'Out of Stock'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-gray-300" />
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                                <th className="text-left px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">SKU</th>
                                <th className="text-left px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="text-left px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                                    <button className="flex items-center gap-1" onClick={() => setSortBy(sortBy === 'stock_asc' ? 'stock_desc' : 'stock_asc')}>
                                        Stock <ArrowUpDown className="h-3 w-3" />
                                    </button>
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Price</th>
                                <th className="text-left px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-sm">{item.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="text-xs bg-gray-100 px-2 py-1 rounded-lg font-bold text-gray-500">{item.sku}</code>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{item.category}</td>
                                    <td className="px-6 py-4 font-black text-lg">{item.stockQuantity}</td>
                                    <td className="px-6 py-4 font-bold text-sm">৳{item.basePrice.toLocaleString()}</td>
                                    <td className="px-6 py-4"><StockBadge stock={item.stockQuantity} /></td>
                                </tr>
                            ))}
                            {filteredItems.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-gray-400 font-medium">
                                        <CheckCircle2 className="h-8 w-8 mx-auto mb-3 text-green-400" />
                                        No items found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
