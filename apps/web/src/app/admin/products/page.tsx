'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Plus,
    Search,
    Filter,
    Download,
    Upload,
    Edit,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { ProductsService, Product } from '@bigbazar/shared';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            // ProductsService currently accepts ProductFilters
            // We can cast or update filters to accept 'q'.
            // For now passing generic object or respecting interface if compatible
            // The API route supports 'q'.
            // I'll assuming ProductsService.getProducts passes filters as query params.
            const response = await ProductsService.getProducts({
                page,
                limit: 10,
                // @ts-ignore
                q: searchQuery
            });

            if (response.success && response.data) {
                setProducts(response.data);
                const res = response as any;
                if (res.pagination) {
                    setPagination({
                        page: res.pagination.page,
                        totalPages: res.pagination.totalPages,
                        totalItems: res.pagination.total
                    });
                }
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const toggleSelectAll = () => {
        if (selectedProducts.length === products.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(products.map(p => p.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedProducts(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const getStatusBadge = (stockQuantity: number) => {
        if (stockQuantity === 0) {
            return <span className="px-3 py-1 bg-rose-100 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Out Stock</span>;
        }
        if (stockQuantity < 10) {
            return <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Low Stock</span>;
        }
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">In Stock</span>;
    };

    return (
        <div className="space-y-10">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Inventory</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs mt-2">Manage and monitor your product catalog</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest hover:shadow-md transition-all flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Bulk Import
                    </button>
                    <button className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest hover:shadow-md transition-all flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                    <Link
                        href="/admin/products/new"
                        className="px-8 py-3 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-3 shadow-xl shadow-black/10"
                    >
                        <Plus className="h-5 w-5" />
                        Launch Product
                    </Link>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Search */}
                    <div className="flex-1 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Find product by name, SKU or brand..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-base focus:outline-none focus:bg-white focus:border-gray-100 transition-all font-bold"
                        />
                    </div>

                    {/* Filter Button */}
                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        className={`px-8 py-4 border-2 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center gap-3 transition-all ${filterOpen ? 'bg-black text-white border-black' : 'hover:border-black'}`}
                    >
                        <Filter className="h-5 w-5" />
                        Refine Results
                    </button>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-8 py-6 text-left w-14">
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.length > 0 && selectedProducts.length === products.length}
                                        onChange={toggleSelectAll}
                                        className="w-5 h-5 rounded-lg border-2 border-gray-200 text-indigo-600 focus:ring-indigo-500"
                                    />
                                </th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Portfolio</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">SKU/ID</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Classification</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Valuation</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Volume</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Availability</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="py-20 text-center">
                                        <Loader2 className="h-10 w-10 animate-spin mx-auto text-indigo-600" />
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-4">Retrieving Masterpieces...</p>
                                    </td>
                                </tr>
                            ) : products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50/80 transition-all group">
                                    <td className="px-8 py-6">
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.includes(product.id)}
                                            onChange={() => toggleSelect(product.id)}
                                            className="w-5 h-5 rounded-lg border-2 border-gray-200 text-indigo-600 focus:ring-indigo-500"
                                        />
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-200 relative group-hover:scale-110 transition-transform">
                                                {product.images?.[0] ? (
                                                    <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                                                ) : <div className="w-full h-full flex items-center justify-center text-gray-300 font-black">PH</div>}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-black text-base text-gray-900 truncate">{product.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{product.brand?.name || 'Big Bazar Originals'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm text-gray-600 font-black font-mono tracking-tighter">{product.sku}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">{product.category?.name || 'General'}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-base font-black text-gray-900">৳{(product.salePrice || product.basePrice).toLocaleString()}</span>
                                            {product.salePrice && (
                                                <span className="text-[10px] text-gray-400 line-through font-bold">৳{product.basePrice.toLocaleString()}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`text-base font-black ${product.stockQuantity === 0 ? 'text-rose-600' : product.stockQuantity < 10 ? 'text-amber-600' : 'text-gray-900'}`}>
                                            {product.stockQuantity}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        {getStatusBadge(product.stockQuantity)}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                                            <button className="p-3 bg-white shadow-sm border border-gray-100 rounded-xl hover:bg-black hover:text-white transition-all" title="View">
                                                <Eye className="h-5 w-5" />
                                            </button>
                                            <Link href={`/admin/products/${product.id}`} className="p-3 bg-white shadow-sm border border-gray-100 rounded-xl hover:bg-indigo-600 hover:text-white transition-all" title="Edit">
                                                <Edit className="h-5 w-5" />
                                            </Link>
                                            <button className="p-3 bg-white shadow-sm border border-gray-100 rounded-xl hover:bg-rose-500 hover:text-white transition-all" title="Delete">
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={8} className="py-40 text-center">
                                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Search className="h-12 w-12 text-gray-200" />
                                        </div>
                                        <h4 className="text-2xl font-black text-gray-900">No Inventory Found</h4>
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Try adjusting your search filters</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-10 py-8 bg-gray-50/30 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                        Visualizing <span className="text-gray-900">{(pagination.page - 1) * 10 + 1} - {Math.min(pagination.page * 10, pagination.totalItems)}</span> of <span className="text-gray-900">{pagination.totalItems}</span> Masterpieces
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => fetchProducts(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className="p-3 border-2 border-gray-200 rounded-2xl hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-300 disabled:hover:border-gray-200"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <button
                            className={`w-12 h-12 rounded-2xl font-black text-sm transition-all bg-black text-white shadow-xl`}
                        >
                            {pagination.page}
                        </button>

                        <button
                            onClick={() => fetchProducts(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages}
                            className="p-3 border-2 border-gray-200 rounded-2xl hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-300 disabled:hover:border-gray-200"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
