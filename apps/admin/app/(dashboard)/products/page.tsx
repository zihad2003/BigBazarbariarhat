'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Plus,
    Search,
    Filter,
    Download,
    Upload,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Package
} from 'lucide-react';

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });

    const [selectedCategory, setSelectedCategory] = useState('');

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                q: searchQuery,
                category: selectedCategory
            });
            const res = await fetch(`/api/products?${queryParams.toString()}`);
            const result = await res.json();
            if (result.success) {
                setProducts(result.data);
                setPagination({
                    page: result.pagination.page,
                    totalPages: result.pagination.totalPages,
                    totalItems: result.pagination.total
                });
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => fetchProducts(1), 500);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategory]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Products</h1>
                    <p className="text-[13px] text-muted-foreground mt-0.5">Manage all items in your store.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-3.5 py-2 text-[13px] font-medium border border-border rounded-lg hover:bg-muted/60 transition-colors flex items-center gap-2">
                        <Download className="w-3.5 h-3.5" />
                        Export
                    </button>
                    <Link
                        href="/products/new"
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Product
                    </Link>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="h-10 px-3 bg-card border border-border rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                    >
                        <option value="">All Categories</option>
                        <option value="panjabi">Panjabi</option>
                        <option value="saree">Saree</option>
                        <option value="salwar-kameez">Salwar Kameez</option>
                        <option value="lungi">Lungi</option>
                        <option value="kids">Kid's Wear</option>
                        <option value="accessories">Accessories</option>
                        <option value="wedding">Wedding Touch</option>
                    </select>
                    <button className="px-4 h-10 border border-border rounded-lg flex items-center gap-2 text-[13px] font-medium hover:bg-muted/60 transition-colors">
                        <Filter className="w-4 h-4" />
                        More Filters
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border bg-muted/20">
                                <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Product</th>
                                <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">SKU</th>
                                <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                                <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                                <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Stock</th>
                                <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-4 py-8"><div className="h-4 bg-muted rounded w-1/3" /></td>
                                    </tr>
                                ))
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-20 text-center">
                                        <Package className="w-10 h-10 text-muted/30 mx-auto mb-3" />
                                        <p className="text-[13px] text-muted-foreground">No products found.</p>
                                    </td>
                                </tr>
                            ) : products.map(product => (
                                <tr key={product.id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border">
                                                {product.images?.[0] ? (
                                                    <img src={product.images[0].url} className="w-full h-full object-cover" />
                                                ) : <Package className="w-5 h-5 text-muted-foreground" />}
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-medium text-foreground">{product.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-[13px] font-mono text-muted-foreground">{product.sku}</td>
                                    <td className="px-4 py-4">
                                        <span className="px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[11px] font-semibold">
                                            {product.category?.name || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-[13px] font-semibold">৳{product.salePrice || product.basePrice}</td>
                                    <td className="px-4 py-4">
                                        <span className={`text-[13px] font-medium ${product.stockQuantity < 10 ? 'text-amber-600' : 'text-foreground'}`}>
                                            {product.stockQuantity}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/products/${product.id}`} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="px-4 py-3 border-t border-border flex items-center justify-between bg-muted/10">
                    <p className="text-[11px] text-muted-foreground">
                        Showing {(pagination.page - 1) * 10 + 1} to {Math.min(pagination.page * 10, pagination.totalItems)} of {pagination.totalItems} products
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => fetchProducts(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="p-1.5 border border-border rounded-md disabled:opacity-50 hover:bg-card"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => fetchProducts(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                            className="p-1.5 border border-border rounded-md disabled:opacity-50 hover:bg-card"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
