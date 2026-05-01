'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Ticket,
    Save,
    Loader2,
    Sparkles,
    Calendar,
    DollarSign,
    Percent,
    Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';

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

export default function NewCouponPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<CouponFormValues>({
        resolver: zodResolver(couponSchema),
        defaultValues: {
            discountType: 'PERCENTAGE',
            discountValue: '0',
            minOrderAmount: '0',
            isActive: true,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        }
    });

    const discountType = watch('discountType');

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

            const res = await fetch('/api/marketing/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();
            if (result.success) {
                toast({ title: 'Success', description: 'Promotion manifest activated successfully.' });
                router.push('/marketing/coupons');
            } else {
                toast({ title: 'Error', description: result.error || 'Failed to create promotion.', variant: 'destructive' });
            }
        } catch (error) {
            console.error('Submission failed:', error);
            toast({ title: 'Error', description: 'Network anomaly detected.', variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-gray-100 pb-10">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">New Promotion</h1>
                            <Sparkles className="h-6 w-6 text-indigo-600" />
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">configure incentive manifest</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => router.back()} className="h-14 px-8 border-2 rounded-2xl text-xs font-black uppercase tracking-widest">
                        Discard
                    </Button>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        disabled={saving}
                        className="h-14 px-10 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest gap-3 shadow-2xl shadow-black/10 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        {saving ? 'Manifesting...' : 'Authorize Promotion'}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
                {/* Core Details */}
                <section className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-bl-[10rem] opacity-30" />
                    <h3 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-6 uppercase tracking-widest flex items-center gap-3">
                        <Ticket className="h-5 w-5 text-indigo-600" />
                        Promotion Identity
                    </h3>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Codename (Required)</label>
                                <input
                                    {...register('code')}
                                    className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-black text-xl text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none uppercase placeholder:text-gray-300"
                                    placeholder="e.g. SUMMER2024"
                                />
                                {errors.code && <p className="text-rose-500 text-xs font-bold uppercase tracking-widest ml-4">{errors.code.message}</p>}
                            </div>

                            <div className="space-y-4 flex flex-col justify-center">
                                <label className="flex items-center gap-4 p-4 bg-gray-50 rounded-[1.5rem] cursor-pointer hover:bg-gray-100 transition-all">
                                    <input
                                        type="checkbox"
                                        {...register('isActive')}
                                        className="w-6 h-6 rounded-lg accent-indigo-600"
                                    />
                                    <div>
                                        <div className="text-sm font-black text-gray-900 uppercase tracking-widest">Active Status</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Enable immediately</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Narrative Description</label>
                            <textarea
                                {...register('description')}
                                rows={3}
                                className="w-full p-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-medium text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none resize-none"
                                placeholder="Internal notes regarding this promotion..."
                            />
                        </div>
                    </div>
                </section>

                {/* Value & Logic */}
                <section className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden">
                    <h3 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-6 uppercase tracking-widest flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-emerald-500" />
                        Incentive Logic
                    </h3>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Mechanism</label>
                                <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2 rounded-[1.5rem]">
                                    {['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setValue('discountType', type as any)}
                                            className={`h-12 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center ${discountType === type ? 'bg-white shadow-md text-indigo-600' : 'text-gray-400 hover:text-gray-900'}`}
                                        >
                                            {type === 'PERCENTAGE' && <Percent className="h-4 w-4" />}
                                            {type === 'FIXED_AMOUNT' && <DollarSign className="h-4 w-4" />}
                                            {type === 'FREE_SHIPPING' && <Truck className="h-4 w-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 md:col-span-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                                    {discountType === 'PERCENTAGE' ? 'Percentage Value (%)' : 'Monetary Value (৳)'}
                                </label>
                                <input
                                    {...register('discountValue')}
                                    type="number"
                                    disabled={discountType === 'FREE_SHIPPING'}
                                    className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-black text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none disabled:opacity-50"
                                    placeholder="0"
                                />
                                {errors.discountValue && <p className="text-rose-500 text-xs font-bold uppercase tracking-widest ml-4">{errors.discountValue.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Minimum Cart Value</label>
                                <input
                                    {...register('minOrderAmount')}
                                    type="number"
                                    className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Total Usage Limit</label>
                                <input
                                    {...register('usageLimit')}
                                    type="number"
                                    className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                    placeholder="Unlimited"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Timeline */}
                <section className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden">
                    <h3 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-6 uppercase tracking-widest flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                        Temporal Parameters
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Initiation Date</label>
                            <input
                                {...register('startDate')}
                                type="date"
                                className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                            />
                            {errors.startDate && <p className="text-rose-500 text-xs font-bold uppercase tracking-widest ml-4">{errors.startDate.message}</p>}
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Termination Date</label>
                            <input
                                {...register('endDate')}
                                type="date"
                                className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                            />
                            {errors.endDate && <p className="text-rose-500 text-xs font-bold uppercase tracking-widest ml-4">{errors.endDate.message}</p>}
                        </div>
                    </div>
                </section>
            </form>
        </div>
    );
}
