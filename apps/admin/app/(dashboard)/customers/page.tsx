'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    Filter,
    Download,
    Eye,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Plus,
    Users,
    Mail,
    Phone,
    ShoppingBag,
    Trash2,
    User
} from 'lucide-react';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });

    const fetchCustomers = async (page = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/customers?page=${page}&limit=10&q=${searchQuery}`);
            const result = await res.json();
            if (result.success) {
                setCustomers(result.data);
                setPagination({
                    page: result.pagination.page,
                    totalPages: result.pagination.totalPages,
                    totalItems: result.pagination.total
                });
            }
        } catch (error) {
            console.error('Failed to fetch customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this customer?')) return;
        try {
            const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (result.success) {
                setCustomers(prev => prev.filter(c => c.id !== id));
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCustomers(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-border">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Customers</h1>
                    <p className="text-[13px] text-muted-foreground mt-0.5">Manage your customer list and order history.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 border border-border rounded-lg text-[13px] font-medium hover:bg-muted/60 transition flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <Link href="/customers/new">
                        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add Customer
                        </button>
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select className="h-10 px-3 bg-card border border-border rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition">
                        <option value="">All Segments</option>
                        <option value="loyal">Loyal Customers</option>
                        <option value="new">New Customers</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <button className="px-4 h-10 border border-border rounded-lg flex items-center gap-2 text-[13px] font-medium hover:bg-muted/60 transition-colors">
                        <Filter className="w-4 h-4" />
                        More Filters
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/20 border-b border-border">
                                <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Orders</th>
                                <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Total Spent</th>
                                <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-right text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading && customers.length === 0 ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-6 h-20 bg-muted/5"></td>
                                    </tr>
                                ))
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                                        <p className="text-[13px] text-muted-foreground">No customers found.</p>
                                    </td>
                                </tr>
                            ) : customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-muted/10 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-[14px]">
                                                {(customer.name?.[0] || 'U')}
                                            </div>
                                            <div>
                                                <p className="text-[14px] font-semibold text-foreground">{customer.name}</p>
                                                <p className="text-[12px] text-muted-foreground">{customer.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-[13px] text-foreground">
                                            <ShoppingBag className="w-3.5 h-3.5 text-muted-foreground" />
                                            {customer.orderCount}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-bold text-foreground">৳{customer.totalSpent.toLocaleString()}</span>
                                            {customer.totalSpent > 5000 && (
                                                <span className="text-[10px] font-bold text-primary uppercase">Loyal</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[13px] text-muted-foreground">
                                        {new Date(customer.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/customers/${customer.id}`}>
                                                <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(customer.id)}
                                                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-border bg-muted/10 flex items-center justify-between">
                    <p className="text-[12px] text-muted-foreground">
                        Showing <span className="font-bold text-foreground">{customers.length}</span> of <span className="font-bold text-foreground">{pagination.totalItems}</span> customers
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => fetchCustomers(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="p-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-1">
                            {[...Array(pagination.totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => fetchCustomers(i + 1)}
                                    className={`w-8 h-8 rounded-lg text-[12px] font-bold transition-all ${pagination.page === i + 1 ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => fetchCustomers(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                            className="p-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
