'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Image as ImageIcon,
    Save,
    Loader2,
    Layout,
    Monitor,
    Smartphone,
    Link as LinkIcon,
    Type
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';

const bannerSchema = z.object({
    title: z.string().min(3, 'Title is required'),
    subtitle: z.string().optional(),
    imageDesktop: z.string().url('Invalid URL').min(1, 'Desktop image is required'),
    imageMobile: z.string().url('Invalid URL').optional().or(z.literal('')),
    linkUrl: z.string().optional(),
    linkText: z.string().optional(),
    position: z.enum(['HOME_HERO', 'HOME_SECONDARY', 'CATEGORY_TOP', 'PRODUCT_SIDEBAR', 'CHECKOUT_TOP']),
    displayOrder: z.string().refine((val) => !isNaN(Number(val)), 'Sequence must be numeric'),
    isActive: z.boolean().default(true),
});

type BannerFormValues = z.infer<typeof bannerSchema>;

export default function NewBannerPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<BannerFormValues>({
        resolver: zodResolver(bannerSchema),
        defaultValues: {
            isActive: true,
            displayOrder: '0',
            position: 'HOME_HERO',
            linkText: 'Learn More'
        }
    });

    const onSubmit = async (data: BannerFormValues) => {
        setSaving(true);
        try {
            const payload = {
                ...data,
                displayOrder: parseInt(data.displayOrder),
            };

            const res = await fetch('/api/marketing/banners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();
            if (result.success) {
                toast({ title: 'Success', description: 'Visual asset manifested successfully.' });
                router.push('/marketing/banners');
            } else {
                toast({ title: 'Error', description: result.error || 'Failed to create asset.', variant: 'destructive' });
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
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">New Asset</h1>
                            <ImageIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">configure visual intelligence</p>
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
                        {saving ? 'Manifesting...' : 'Authorize Asset'}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
                {/* Core Narrative */}
                <section className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-bl-[10rem] opacity-30" />
                    <h3 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-6 uppercase tracking-widest flex items-center gap-3">
                        <Type className="h-5 w-5 text-indigo-600" />
                        Narrative & Position
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Primary Narrative (Title)</label>
                            <input
                                {...register('title')}
                                className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-black text-xl text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none placeholder:text-gray-300"
                                placeholder="Returns & Exchanges"
                            />
                            {errors.title && <p className="text-rose-500 text-xs font-bold uppercase tracking-widest ml-4">{errors.title.message}</p>}
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Secondary Narrative (Subtitle)</label>
                            <input
                                {...register('subtitle')}
                                className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                placeholder="Hassle-free policy"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Structural Position</label>
                            <select
                                {...register('position')}
                                className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-black text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none appearance-none cursor-pointer"
                            >
                                <option value="HOME_HERO">Home Hero</option>
                                <option value="HOME_SECONDARY">Home Secondary</option>
                                <option value="CATEGORY_TOP">Category Top</option>
                                <option value="PRODUCT_SIDEBAR">Product Sidebar</option>
                                <option value="CHECKOUT_TOP">Checkout Top</option>
                            </select>
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
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Live in storefront</div>
                                </div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Visual Artifacts */}
                <section className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden">
                    <h3 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-6 uppercase tracking-widest flex items-center gap-3">
                        <Layout className="h-5 w-5 text-indigo-600" />
                        Visual Artifacts
                    </h3>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                                <Monitor className="h-3 w-3" /> Desktop Artifact URL
                            </label>
                            <input
                                {...register('imageDesktop')}
                                className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-indigo-600 focus:bg-white focus:border-indigo-600 transition-all outline-none placeholder:text-indigo-200"
                                placeholder="https://..."
                            />
                            {errors.imageDesktop && <p className="text-rose-500 text-xs font-bold uppercase tracking-widest ml-4">{errors.imageDesktop.message}</p>}
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                                <Smartphone className="h-3 w-3" /> Mobile Artifact URL (Optional)
                            </label>
                            <input
                                {...register('imageMobile')}
                                className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-indigo-600 focus:bg-white focus:border-indigo-600 transition-all outline-none placeholder:text-indigo-200"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </section>

                {/* Routing Logic */}
                <section className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden">
                    <h3 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-6 uppercase tracking-widest flex items-center gap-3">
                        <LinkIcon className="h-5 w-5 text-indigo-600" />
                        Action Routing
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Destination URL</label>
                            <input
                                {...register('linkUrl')}
                                className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                placeholder="/shop/new-arrivals"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Action Label</label>
                            <input
                                {...register('linkText')}
                                className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                placeholder="Shop Now"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Display Sequence</label>
                            <input
                                {...register('displayOrder')}
                                type="number"
                                className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                            />
                        </div>
                    </div>
                </section>
            </form>
        </div>
    );
}
