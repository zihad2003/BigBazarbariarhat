'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    ShoppingBag,
    Trophy,
    Clock,
    Star,
    MessageSquare,
    ExternalLink,
    Loader2,
    Calendar,
    ChevronRight,
    TrendingUp,
    ShieldCheck,
    Save,
    AlertCircle,
    User,
    Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CustomerDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const res = await fetch(`/api/customers/${params.id}`);
                const result = await res.json();
                if (result.success) {
                    setCustomer(result.data);
                    setEditForm({
                        firstName: result.data.firstName,
                        lastName: result.data.lastName,
                        phone: result.data.phone || '',
                        avatar: result.data.avatar || '',
                        role: result.data.role
                    });
                }
            } catch (error) {
                console.error('Failed to fetch associate:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [params.id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/customers/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            const result = await res.json();
            if (result.success) {
                setCustomer({ ...customer, ...editForm });
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        // ... keep existing loading state ...
    }

    if (!customer) {
        // ... keep existing not found state ...
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Master Identity Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-gray-100 pb-12">
                <div className="flex items-center gap-8">
                    <button
                        onClick={() => router.back()}
                        className="w-16 h-16 bg-white border border-gray-100 rounded-3xl flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm group"
                    >
                        <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="flex items-center gap-8">
                        <div className="w-24 h-24 bg-indigo-50 border-4 border-white shadow-2xl rounded-[2.5rem] flex items-center justify-center text-indigo-600 font-black text-3xl overflow-hidden">
                            {customer.avatar ? <img src={customer.avatar} alt="" className="w-full h-full object-cover" /> : (customer.firstName?.[0] || 'U')}
                        </div>
                        <div className="flex-1 min-w-[300px]">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <input
                                            className="flex-1 h-12 px-4 bg-gray-50 border rounded-xl font-black italic text-xl"
                                            value={editForm.firstName}
                                            placeholder="First Name"
                                            onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                                        />
                                        <input
                                            className="flex-1 h-12 px-4 bg-gray-50 border rounded-xl font-black italic text-xl"
                                            value={editForm.lastName}
                                            placeholder="Last Name"
                                            onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-1 relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                className="w-full h-12 pl-12 pr-4 bg-gray-50 border rounded-xl font-bold text-sm"
                                                value={editForm.phone}
                                                placeholder="Phone Node"
                                                onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex-1 relative">
                                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                className="w-full h-12 pl-12 pr-4 bg-gray-50 border rounded-xl font-bold text-sm"
                                                value={editForm.avatar}
                                                placeholder="Avatar Manifest URL"
                                                onChange={e => setEditForm({ ...editForm, avatar: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 mb-2">
                                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic">{customer.firstName} {customer.lastName}</h1>
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border border-emerald-100 flex items-center gap-2">
                                        <ShieldCheck className="h-3 w-3" />
                                        Verified Associate
                                    </span>
                                </div>
                            )}
                            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 mt-2">
                                <Mail className="h-3 w-3" /> {customer.email}
                                <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                <Phone className="h-3 w-3" /> {customer.phone || 'No Link'}
                                <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                Registered {new Date(customer.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    {isEditing ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                                className="h-16 px-8 border-2 rounded-3xl text-[10px] font-black uppercase tracking-widest gap-3 shadow-sm"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="h-16 px-10 bg-indigo-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest gap-3 shadow-2xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                Commit Changes
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(true)}
                                className="h-16 px-8 border-2 rounded-3xl text-[10px] font-black uppercase tracking-widest gap-3 shadow-sm"
                            >
                                Modify Profile
                            </Button>
                            <Button className="h-16 px-10 bg-black text-white rounded-3xl text-[10px] font-black uppercase tracking-widest gap-3 shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all">
                                Grant Credit
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Insights & Metrics */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Performance Banners */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Lifetime Valuation', value: `৳${customer.stats.totalSpent.toLocaleString()}`, icon: Trophy, color: 'text-amber-500 bg-amber-50' },
                            { label: 'Manifest Count', value: customer.stats.orderCount, icon: ShoppingBag, color: 'text-indigo-500 bg-indigo-50' },
                            { label: 'Mean Valuation', value: `৳${Math.round(customer.stats.averageOrderValue).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500 bg-emerald-50' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm relative group overflow-hidden">
                                <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-20 rounded-bl-[4rem] group-hover:scale-110 transition-transform`} />
                                <stat.icon className={`h-8 w-8 ${stat.color.split(' ')[0]} mb-6`} />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <h4 className="text-3xl font-black text-gray-900 tracking-tighter italic">{stat.value}</h4>
                            </div>
                        ))}
                    </div>

                    {/* Transaction History Manifest */}
                    <section className="bg-white rounded-[4rem] border border-gray-100 overflow-hidden shadow-2xl shadow-gray-200/50">
                        <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-4">
                                <Clock className="h-5 w-5 text-indigo-600" />
                                Order History
                            </h3>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visualizing Last 10 Manifests</span>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {customer.orders.length === 0 ? (
                                <div className="p-20 text-center">
                                    <ShoppingBag className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">No transaction records found in central registry.</p>
                                </div>
                            ) : customer.orders.map((order: any) => (
                                <div key={order.id} className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 font-black font-mono group-hover:bg-black group-hover:text-white transition-all text-sm">
                                            #{order.orderNumber.slice(-4)}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-gray-900 tracking-tighter italic">৳{Number(order.totalAmount).toLocaleString()}</h4>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                                Manifest #{order.orderNumber} • {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <Badge variant="secondary" className="bg-white border-gray-100 text-[9px] font-black uppercase tracking-widest">
                                            {order.status}
                                        </Badge>
                                        <Link href={`/orders/${order.id}`}>
                                            <button className="h-12 px-6 bg-gray-50 border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-black transition-all">
                                                Examine
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Intellectual Contributions (Reviews) */}
                    {customer.reviews && customer.reviews.length > 0 && (
                        <section className="bg-white rounded-[4rem] border border-gray-100 p-10 shadow-sm">
                            <h3 className="text-xl font-black text-gray-900 mb-10 border-b border-gray-50 pb-6 uppercase tracking-widest flex items-center gap-3">
                                <MessageSquare className="h-5 w-5 text-emerald-500" />
                                Intel & Feedback
                            </h3>
                            <div className="space-y-8">
                                {customer.reviews.map((review: any) => (
                                    <div key={review.id} className="space-y-4 p-8 bg-gray-50/30 rounded-[2.5rem] border border-gray-50 relative overflow-hidden group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900 italic">&quot;{review.comment}&quot;</p>
                                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Product: {review.product.name}</p>
                                            <ExternalLink className="h-3 w-3 text-gray-300 group-hover:text-black transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Logistics Context */}
                <div className="space-y-12">
                    {/* Destination Points (Addresses) */}
                    <section className="bg-white rounded-[4rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-rose-50 rounded-bl-[10rem] opacity-30 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-6 uppercase tracking-widest flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-rose-500" />
                            Logistics Nodes
                        </h3>
                        <div className="space-y-6">
                            {customer.addresses.length === 0 ? (
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest text-center py-10 italic">No destination nodes sync&apos;d.</p>
                            ) : customer.addresses.map((address: any) => (
                                <div key={address.id} className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-50 group/item relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                            {address.isDefault ? 'Primary' : 'Secondary'}
                                        </span>
                                    </div>
                                    <p className="text-sm font-black text-gray-900 leading-relaxed italic">
                                        {address.addressLine1},<br />
                                        {address.city}, {address.state} {address.postalCode},<br />
                                        {address.country}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Operational Intel (Notes) */}
                    <section className="bg-black rounded-[4rem] p-12 text-white shadow-2xl shadow-black/40 group overflow-hidden relative">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
                        <h3 className="text-xl font-black mb-10 border-b border-white/10 pb-6 uppercase tracking-widest flex items-center gap-3 text-indigo-400">
                            <AlertCircle className="h-5 w-5" />
                            Entity Directives
                        </h3>
                        <div className="space-y-8">
                            <div>
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Internal Intelligence Note</h4>
                                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 min-h-[120px] text-sm text-gray-400 font-medium leading-relaxed italic">
                                    No operational notes recorded for this entity associate.
                                </div>
                            </div>
                            <Button className="w-full h-14 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20">
                                Update Intel
                            </Button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
