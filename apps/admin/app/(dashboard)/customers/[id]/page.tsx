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
    Image as ImageIcon,
    Edit3
} from 'lucide-react';

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
                console.error('Failed to fetch customer:', error);
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
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-[13px] text-muted-foreground">Loading customer details...</p>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <AlertCircle className="w-10 h-10 text-destructive" />
                <h2 className="text-lg font-semibold">Customer Not Found</h2>
                <button onClick={() => router.back()} className="text-primary text-[13px] font-medium hover:underline">
                    Back to Customers
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-[1100px] mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl overflow-hidden border border-border shadow-sm">
                            {customer.avatar ? <img src={customer.avatar} className="w-full h-full object-cover" /> : (customer.firstName?.[0] || 'U')}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-semibold text-foreground">{customer.firstName} {customer.lastName}</h1>
                                {customer.stats.totalSpent > 5000 && (
                                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                                        Loyal Customer
                                    </span>
                                )}
                            </div>
                            <p className="text-[13px] text-muted-foreground mt-0.5">{customer.email}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition flex items-center gap-2"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-2 bg-muted text-foreground rounded-lg text-[13px] font-semibold hover:bg-muted/80 transition flex items-center gap-2 border border-border"
                        >
                            <Edit3 className="w-4 h-4" />
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Activity */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'Total Spent', value: `৳${customer.stats.totalSpent.toLocaleString()}`, icon: Trophy, color: 'text-amber-600 bg-amber-50' },
                            { label: 'Orders', value: customer.stats.orderCount, icon: ShoppingBag, color: 'text-indigo-600 bg-indigo-50' },
                            { label: 'Avg. Order', value: `৳${Math.round(customer.stats.averageOrderValue).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
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

                    {/* Recent Orders */}
                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                        <div className="p-5 border-b border-border bg-muted/20 flex items-center justify-between">
                            <h2 className="text-sm font-semibold flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                Recent Orders
                            </h2>
                            <span className="text-[11px] text-muted-foreground font-medium">Last 10 orders</span>
                        </div>
                        <div className="divide-y divide-border">
                            {customer.orders.length === 0 ? (
                                <div className="p-12 text-center">
                                    <ShoppingBag className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                                    <p className="text-[13px] text-muted-foreground">No orders yet.</p>
                                </div>
                            ) : customer.orders.map((order: any) => (
                                <div key={order.id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-[12px] font-mono text-muted-foreground font-bold">
                                            #{order.orderNumber.slice(-4)}
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-bold text-foreground">৳{Number(order.totalAmount).toLocaleString()}</p>
                                            <p className="text-[11px] text-muted-foreground mt-0.5">#{order.orderNumber} • {new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                            {order.status}
                                        </span>
                                        <Link href={`/orders/${order.id}`}>
                                            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews */}
                    {customer.reviews && customer.reviews.length > 0 && (
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-primary" />
                                Customer Reviews
                            </h2>
                            <div className="space-y-4">
                                {customer.reviews.map((review: any) => (
                                    <div key={review.id} className="p-4 bg-muted/20 rounded-xl border border-border relative group">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted/20'}`} />
                                                ))}
                                            </div>
                                            <span className="text-[11px] text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-[13px] text-foreground italic leading-relaxed">&quot;{review.comment}&quot;</p>
                                        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
                                            <p className="text-[11px] font-bold text-primary truncate">Product: {review.product.name}</p>
                                            <Link href={`/products/${review.product.id}`}>
                                                <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary transition-colors" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Details & Management */}
                <div className="space-y-6">
                    {/* General Info */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            Contact Information
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-[13px] text-foreground">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span>{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[13px] text-foreground">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span>{customer.phone || 'No phone number'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[13px] text-foreground">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Addresses */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            Saved Addresses
                        </h2>
                        <div className="space-y-4">
                            {customer.addresses.length === 0 ? (
                                <p className="text-[12px] text-muted-foreground italic text-center py-4">No addresses saved.</p>
                            ) : customer.addresses.map((address: any) => (
                                <div key={address.id} className="p-4 bg-muted/20 border border-border rounded-xl relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${address.isDefault ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border'}`}>
                                            {address.isDefault ? 'Primary' : 'Additional'}
                                        </span>
                                    </div>
                                    <p className="text-[13px] text-foreground leading-relaxed">
                                        {address.addressLine1},<br />
                                        {address.city}, {address.state} {address.postalCode},<br />
                                        {address.country}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="bg-zinc-950 text-white rounded-xl p-6 shadow-lg shadow-black/20">
                        <h2 className="text-sm font-semibold mb-6 flex items-center gap-2 text-primary">
                            <AlertCircle className="w-4 h-4" />
                            Manage Customer
                        </h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Admin Note</label>
                                <textarea
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-[12px] text-zinc-300 outline-none focus:bg-white/10 transition h-24 resize-none"
                                    placeholder="Add internal notes about this customer..."
                                />
                            </div>
                            <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold hover:bg-primary/90 transition">
                                Save Note
                            </button>
                            <div className="pt-4 border-t border-white/10">
                                <button className="w-full py-2 bg-rose-600/10 text-rose-500 border border-rose-600/20 rounded-lg text-[13px] font-bold hover:bg-rose-600/20 transition">
                                    Deactivate Customer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
