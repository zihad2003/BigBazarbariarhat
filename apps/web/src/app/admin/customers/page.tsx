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
    UserPlus,
    Mail,
    ShoppingBag,
    Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomersService, Customer } from '@bigbazar/shared';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });

    const fetchCustomers = async (page = 1) => {
        setLoading(true);
        try {
            const response = await CustomersService.getCustomers({
                page,
                limit: 10,
                search: searchQuery
            });

            if (response.success && response.data) {
                setCustomers(response.data);
                if (response.pagination) {
                    setPagination({
                        page: response.pagination.page,
                        totalPages: response.pagination.totalPages,
                        totalItems: response.pagination.total
                    });
                }
            }
        } catch (error) {
            console.error('Failed to fetch entities:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCustomers(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    return (
        <div className="space-y-10">
            {/* Master Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-gray-100 pb-10">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Associates</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs mt-2">Manage customer identity and lifetime engagement</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-14 px-8 border-2 rounded-2xl text-[10px] font-black uppercase tracking-widest gap-3 shadow-sm hover:bg-black hover:text-white transition-all">
                        <Download className="h-4 w-4" />
                        Export Ledger
                    </Button>
                    <Button className="h-14 px-10 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest gap-3 shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all">
                        <UserPlus className="h-4 w-4" />
                        Internal Registration
                    </Button>
                </div>
            </div>

            {/* Matrix Filters */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full opacity-0 group-hover:opacity-30 transition-opacity" />
                <div className="flex flex-col lg:flex-row gap-6 relative z-10">
                    <div className="flex-1 relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Identify associate by name, email or global ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-[1.25rem] text-base focus:outline-none focus:bg-white focus:border-indigo-100 transition-all font-bold placeholder:text-gray-300"
                        />
                    </div>
                    <div className="flex gap-4">
                        <select className="px-6 py-4 bg-gray-50 border border-transparent rounded-[1.25rem] text-xs font-black uppercase tracking-widest focus:outline-none focus:bg-white focus:border-indigo-100 transition-all appearance-none cursor-pointer">
                            <option>All Segments</option>
                            <option>High Velocity</option>
                            <option>Latent Potential</option>
                            <option>Churn Risk</option>
                        </select>
                        <Button variant="outline" className="h-14 px-8 border-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                            <Filter className="h-4 w-4 mr-2" />
                            Refine
                        </Button>
                    </div>
                </div>
            </div>

            {/* Entity Manifest Table */}
            <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-2xl shadow-gray-200/50">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50 text-left">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Associate Profile</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Classification</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction Vol.</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Lifetime Valuation</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Registration</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Directives</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-24 text-center">
                                        <Loader2 className="h-12 w-12 animate-spin mx-auto text-indigo-600 mb-4" />
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Interrogating Entity Database...</p>
                                    </td>
                                </tr>
                            ) : customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50/80 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-indigo-50 border-2 border-white shadow-lg rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl overflow-hidden group-hover:scale-110 transition-transform">
                                                {customer.avatar ? <img src={customer.avatar} alt="" className="w-full h-full object-cover" /> : (customer.firstName?.[0] || 'U')}
                                            </div>
                                            <div>
                                                <div className="font-black text-gray-900 tracking-tight text-lg">{customer.firstName || 'Unknown'} {customer.lastName || ''}</div>
                                                <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-2">
                                                    <Mail className="h-3 w-3" />
                                                    {customer.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-indigo-100 uppercase tracking-widest text-[9px] w-fit">
                                                {customer.totalSpent > 5000 ? 'Platinum Partner' : 'Standard Tier'}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <ShoppingBag className="h-4 w-4 text-gray-300" />
                                            <span className="text-gray-900 font-black italic">{customer.orderCount} Manifests</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-black text-gray-900 tracking-tighter italic">৳{customer.totalSpent.toLocaleString()}</span>
                                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                                <Trophy className="h-3 w-3" /> Verified Capital
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                                        {new Date(customer.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                            <Link href={`/admin/customers/${customer.id}`}>
                                                <button className="p-3 bg-white shadow-xl border border-gray-100 rounded-2xl hover:bg-black hover:text-white transition-all">
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                            </Link>
                                            <button className="p-3 bg-white shadow-xl border border-gray-100 rounded-2xl hover:bg-gray-100 transition-all">
                                                <MoreVertical className="h-5 w-5 text-gray-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Ledger Navigation */}
                <div className="px-12 py-10 bg-gray-50/30 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] flex items-center gap-3">
                        Total Entity Count: <span className="text-gray-900 bg-white px-3 py-1 rounded-lg border border-gray-100">{pagination.totalItems}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => fetchCustomers(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="w-14 h-14 border-2 border-gray-100 rounded-[1.25rem] flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-20 disabled:hover:bg-transparent"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <div className="flex items-center gap-2 px-6">
                            {[...Array(pagination.totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => fetchCustomers(i + 1)}
                                    className={`w-12 h-12 rounded-xl font-black text-xs transition-all ${pagination.page === i + 1 ? 'bg-black text-white shadow-xl scale-110' : 'text-gray-400 hover:text-gray-900'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => fetchCustomers(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                            className="w-14 h-14 border-2 border-gray-100 rounded-[1.25rem] flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-20 disabled:hover:bg-transparent"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
