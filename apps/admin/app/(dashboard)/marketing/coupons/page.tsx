'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Ticket,
    Plus,
    Search,
    Trash2,
    Calendar,
    Edit3,
    ArrowRight,
    Loader2,
    TrendingUp,
    Users
} from 'lucide-react';

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/marketing/coupons?q=${searchQuery}`);
            const result = await res.json();
            if (result.success) {
                setCoupons(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCoupons();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const deleteCoupon = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        try {
            const res = await fetch(`/api/marketing/coupons/${id}`, { method: 'DELETE' });
            if (res.ok) fetchCoupons();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-border">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Coupons</h1>
                    <p className="text-[13px] text-muted-foreground mt-0.5">Create and manage discount codes for your customers.</p>
                </div>
                <Link href="/marketing/coupons/new">
                    <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Coupon
                    </button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by code or description..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                    />
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && coupons.length === 0 ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="h-48 bg-muted/20 border border-border rounded-xl animate-pulse" />
                    ))
                ) : coupons.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-card border border-border rounded-xl">
                        <Ticket className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-[13px] text-muted-foreground">No coupons found.</p>
                    </div>
                ) : coupons.map((coupon) => (
                    <Link
                        href={`/marketing/coupons/${coupon.id}`}
                        key={coupon.id}
                        className="bg-card border border-border rounded-xl p-6 shadow-sm hover:border-primary/30 transition-all group relative overflow-hidden block"
                    >
                        {/* Ticket Notch Effect */}
                        <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 bg-background border border-border rounded-full" />
                        <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-background border border-border rounded-full" />

                        <div className="flex justify-between items-start mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                <Ticket className="w-5 h-5" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${coupon.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-muted text-muted-foreground border-border'}`}>
                                    {coupon.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <button
                                    onClick={(e) => deleteCoupon(e, coupon.id)}
                                    className="p-1.5 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors relative z-20"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1 mb-6">
                            <h3 className="text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">{coupon.code}</h3>
                            <p className="text-[12px] text-muted-foreground line-clamp-1">{coupon.description || 'No description provided'}</p>
                        </div>

                        <div className="flex items-center gap-6 py-4 border-y border-border border-dashed">
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Discount</p>
                                <p className="text-[18px] font-bold text-primary">
                                    {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `৳${Number(coupon.discountValue).toLocaleString()}`}
                                </p>
                            </div>
                            <div className="w-px h-8 bg-border" />
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Usage</p>
                                <p className="text-[18px] font-bold text-foreground">{coupon.currentUsage} <span className="text-[11px] text-muted-foreground font-normal">/ {coupon.usageLimit || '∞'}</span></p>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between text-[11px] text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Expires {new Date(coupon.endDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1 text-primary font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                Edit <ArrowRight className="w-3 h-3" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
