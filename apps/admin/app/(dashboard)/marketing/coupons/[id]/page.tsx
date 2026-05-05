'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    Ticket,
    Save,
    Loader2,
    Calendar,
    DollarSign,
    Percent,
    Truck,
    Info,
    CheckCircle2,
    Trash2
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const couponSchema = z.object({
    code: z.string().min(3, 'Code must be at least 3 characters'),
    description: z.string().optional(),
    discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING']),
    discountValue: z.string().refine((val) => !isNaN(Number(val)), 'Value must be numeric'),
    minOrderAmount: z.string().default('0'),
    usageLimit: z.string().optional(),
    startDate: z.string(),
    endDate: z.string(),
    isActive: z.boolean().default(true),
});

type CouponFormValues = z.infer<typeof couponSchema>;

export default function EditCouponPage() {
    const router = useRouter();
    const params = useParams();
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors }
    } = useForm<CouponFormValues>({
        resolver: zodResolver(couponSchema)
    });

    const discountType = watch('discountType');

    useEffect(() => {
        const fetchCoupon = async () => {
            try {
                const res = await fetch(`/api/marketing/coupons/${params.id}`);
                const result = await res.json();
                if (result.success) {
                    const c = result.data;
                    reset({
                        code: c.code,
                        description: c.description || '',
                        discountType: c.discountType,
                        discountValue: c.discountValue.toString(),
                        minOrderAmount: c.minOrderAmount?.toString() || '0',
                        usageLimit: c.usageLimit?.toString() || '',
                        startDate: new Date(c.startDate).toISOString().split('T')[0],
                        endDate: new Date(c.endDate).toISOString().split('T')[0],
                        isActive: c.isActive,
                    });
                }
            } catch (error) {
                console.error('Failed to load coupon:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) fetchCoupon();
    }, [params.id, reset]);

    const onSubmit = async (data: CouponFormValues) => {
        setSaving(true);
        try {
            const payload = {
                ...data,
                code: data.code.toUpperCase(),
                discountValue: parseFloat(data.discountValue),
                minOrderAmount: parseFloat(data.minOrderAmount || '0'),
                usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
                startDate: new Date(data.startDate).toISOString(),
                endDate: new Date(data.endDate).toISOString(),
            };

            const res = await fetch(`/api/marketing/coupons/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();
            if (result.success) {
                router.push('/marketing/coupons');
            }
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this coupon? This action cannot be undone.')) return;

        try {
            const res = await fetch(`/api/marketing/coupons/${params.id}`, { method: 'DELETE' });
            if (res.ok) {
                router.push('/marketing/coupons');
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-[13px] text-muted-foreground">Loading coupon details...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1000px] mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <div>
                        <h1 className="text-xl font-semibold text-foreground">Edit Coupon</h1>
                        <p className="text-[13px] text-muted-foreground mt-0.5">Modify your existing discount code.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-[13px] font-medium text-rose-500 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={saving}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition flex items-center gap-2 shadow-sm"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Coupon Details */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                            <Ticket className="w-4 h-4 text-primary" />
                            Coupon Details
                        </h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Coupon Code</label>
                                <input
                                    {...register('code')}
                                    className="w-full h-12 px-4 bg-muted/20 border border-border rounded-lg text-[16px] font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition uppercase placeholder:text-muted-foreground/50"
                                    placeholder="e.g. SUMMER50"
                                />
                                {errors.code && <p className="text-destructive text-[11px] font-medium">{errors.code.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Description</label>
                                <textarea
                                    {...register('description')}
                                    rows={3}
                                    className="w-full p-4 bg-muted/20 border border-border rounded-lg text-[13px] text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition resize-none"
                                    placeholder="Add internal notes or public description..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Discount Rules */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary" />
                            Discount Rules
                        </h2>
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Discount Type</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'PERCENTAGE', label: 'Percentage', icon: Percent },
                                        { id: 'FIXED_AMOUNT', label: 'Fixed Amount', icon: DollarSign },
                                        { id: 'FREE_SHIPPING', label: 'Free Shipping', icon: Truck },
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setValue('discountType', type.id as any)}
                                            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${discountType === type.id ? 'bg-primary/5 border-primary text-primary' : 'bg-muted/20 border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground'}`}
                                        >
                                            <type.icon className="w-5 h-5" />
                                            <span className="text-[12px] font-bold uppercase tracking-wider">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
                                        {discountType === 'PERCENTAGE' ? 'Discount Percentage (%)' : 'Discount Amount (৳)'}
                                    </label>
                                    <div className="relative">
                                        <input
                                            {...register('discountValue')}
                                            type="number"
                                            disabled={discountType === 'FREE_SHIPPING'}
                                            className="w-full h-11 px-4 bg-muted/20 border border-border rounded-lg text-[14px] font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition disabled:opacity-50"
                                            placeholder="0"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            {discountType === 'PERCENTAGE' ? '%' : '৳'}
                                        </div>
                                    </div>
                                    {errors.discountValue && <p className="text-destructive text-[11px] font-medium">{errors.discountValue.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Minimum Order (৳)</label>
                                    <input
                                        {...register('minOrderAmount')}
                                        type="number"
                                        className="w-full h-11 px-4 bg-muted/20 border border-border rounded-lg text-[14px] font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Active Status */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            Visibility
                        </h2>
                        <label className="flex items-center gap-3 p-4 bg-muted/20 rounded-xl border border-border cursor-pointer hover:bg-muted/40 transition">
                            <input
                                type="checkbox"
                                {...register('isActive')}
                                className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                            />
                            <div>
                                <p className="text-[13px] font-bold text-foreground">Active</p>
                                <p className="text-[11px] text-muted-foreground">Live in checkout</p>
                            </div>
                        </label>
                    </div>

                    {/* Active Dates */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            Active Dates
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Start Date</label>
                                <input
                                    {...register('startDate')}
                                    type="date"
                                    className="w-full h-10 px-3 bg-muted/20 border border-border rounded-lg text-[13px] font-medium outline-none focus:ring-2 focus:ring-primary/20 transition"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">End Date</label>
                                <input
                                    {...register('endDate')}
                                    type="date"
                                    className="w-full h-10 px-3 bg-muted/20 border border-border rounded-lg text-[13px] font-medium outline-none focus:ring-2 focus:ring-primary/20 transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Usage Limit */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                            <Info className="w-4 h-4 text-primary" />
                            Usage Limit
                        </h2>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Total Uses</label>
                            <input
                                {...register('usageLimit')}
                                type="number"
                                className="w-full h-10 px-3 bg-muted/20 border border-border rounded-lg text-[13px] font-medium outline-none focus:ring-2 focus:ring-primary/20 transition"
                                placeholder="Unlimited"
                            />
                            <p className="text-[11px] text-muted-foreground mt-2">Leave blank for unlimited uses.</p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
