'use client';

import { useState, useEffect } from 'react';
import {
    Ticket,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Trash2,
    Calendar,
    Users,
    Zap,
    Loader2,
    CheckCircle2,
    XCircle,
    Info,
    ArrowRight,
    Sparkles,
    CircleDollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        minOrderAmount: '0',
        usageLimit: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/marketing/coupons?q=${searchQuery}`);
            const result = await res.json();
            if (result.success) {
                setCoupons(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch promotions:', error);
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

    const handleCreateCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            const res = await fetch('/api/marketing/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await res.json();
            if (result.success) {
                setShowCreateModal(false);
                fetchCoupons();
                setFormData({
                    code: '',
                    description: '',
                    discountType: 'PERCENTAGE',
                    discountValue: '',
                    minOrderAmount: '0',
                    usageLimit: '',
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                });
            }
        } catch (error) {
            console.error('Manifestation failed:', error);
        } finally {
            setCreating(false);
        }
    };

    const deleteCoupon = async (id: string) => {
        if (!confirm('Are you sure you want to terminate this promotional manifest?')) return;
        try {
            const res = await fetch(`/api/marketing/coupons/${id}`, { method: 'DELETE' });
            if (res.ok) fetchCoupons();
        } catch (error) {
            console.error('Termination failed:', error);
        }
    };

    return (
        <div className="space-y-12">
            {/* Master Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-gray-100 pb-12">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic">Promotions</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-3">Architect limited-time incentive manifests</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="h-16 px-10 bg-black text-white rounded-3xl text-[10px] font-black uppercase tracking-widest gap-3 shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus className="h-5 w-5" />
                    Inject Promotion
                </Button>
            </div>

            {/* Matrix Console */}
            <div className="bg-white rounded-[3rem] border border-gray-100 p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Trace promotion by code or narrative..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-gray-50 border border-transparent rounded-2xl text-base focus:bg-white focus:border-indigo-100 outline-none transition-all font-bold placeholder:text-gray-300"
                        />
                    </div>
                </div>
            </div>

            {/* Manifest List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="h-64 bg-gray-50 rounded-[3rem] animate-pulse" />
                    ))
                ) : coupons.map((coupon) => (
                    <div key={coupon.id} className="bg-white rounded-[3rem] border border-gray-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-900/5 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[8rem] opacity-30 group-hover:scale-110 transition-transform" />

                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                                <Ticket className="h-7 w-7" />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => deleteCoupon(coupon.id)}
                                    className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 mb-6">
                            <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">{coupon.code}</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed line-clamp-1">{coupon.description || 'No operational narrative'}</p>
                        </div>

                        <div className="flex items-center gap-4 py-6 border-y border-gray-50">
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Incentive Value</p>
                                <h4 className="text-2xl font-black text-indigo-600 tracking-tighter">
                                    {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `৳${Number(coupon.discountValue).toLocaleString()}`}
                                </h4>
                            </div>
                            <div className="w-px h-10 bg-gray-100" />
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Utilization</p>
                                <h4 className="text-2xl font-black text-gray-900 tracking-tighter">{coupon.currentUsage} <span className="text-xs text-gray-300">/ {coupon.usageLimit || '∞'}</span></h4>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-gray-300" />
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                    {new Date(coupon.endDate).toLocaleDateString()}
                                </span>
                            </div>
                            <Badge className={coupon.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'}>
                                {coupon.isActive ? 'Active' : 'Latent'}
                            </Badge>
                        </div>
                    </div>
                ))}
            </div>

            {/* Creation Modal Interface */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowCreateModal(false)} />
                    <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-12 bg-gray-50/50 border-b border-gray-50 flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic">Promotional Injector</h2>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Configure new incentive manifest</p>
                            </div>
                            <button onClick={() => setShowCreateModal(false)} className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateCoupon} className="p-12 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Codename</label>
                                    <input
                                        required
                                        placeholder="e.g. FLASH50"
                                        className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-black text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none uppercase"
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Incentive Type</label>
                                    <select
                                        className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-black text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none appearance-none cursor-pointer"
                                        value={formData.discountType}
                                        onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                                    >
                                        <option value="PERCENTAGE">Percentage (%)</option>
                                        <option value="FIXED_AMOUNT">Fixed Amount (৳)</option>
                                        <option value="FREE_SHIPPING">Free Shipping</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Numerical Valuation</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-black text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                        value={formData.discountValue}
                                        onChange={e => setFormData({ ...formData, discountValue: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Threshold Authorization (Min Order)</label>
                                    <input
                                        type="number"
                                        className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-black text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                        value={formData.minOrderAmount}
                                        onChange={e => setFormData({ ...formData, minOrderAmount: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Temporal Initiation</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Temporal Termination</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                        value={formData.endDate}
                                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Button
                                disabled={creating}
                                className="w-full h-20 bg-black text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all gap-4"
                            >
                                {creating ? <Loader2 className="h-6 w-6 animate-spin" /> : <Sparkles className="h-6 w-6" />}
                                {creating ? 'Manifesting Intelligence...' : 'Authorize Global Promotion'}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
