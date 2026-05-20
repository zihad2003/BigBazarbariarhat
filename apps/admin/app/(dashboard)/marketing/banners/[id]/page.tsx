'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    Image as ImageIcon,
    Save,
    Loader2,
    Layout,
    Monitor,
    Smartphone,
    Link as LinkIcon,
    Trash2,
    Type,
    CheckCircle2,
    Layers
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

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

export default function EditBannerPage() {
    const router = useRouter();
    const params = useParams();
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<BannerFormValues>({
        resolver: zodResolver(bannerSchema)
    });

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const res = await fetch(`/api/marketing/banners/${params.id}`);
                const result = await res.json();
                if (result.success) {
                    const b = result.data;
                    reset({
                        title: b.title,
                        subtitle: b.subtitle || '',
                        imageDesktop: b.imageDesktop,
                        imageMobile: b.imageMobile || '',
                        linkUrl: b.linkUrl || '',
                        linkText: b.linkText || '',
                        position: b.position,
                        displayOrder: b.displayOrder.toString(),
                        isActive: b.isActive,
                    });
                }
            } catch (error) {
                console.error('Failed to load banner:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) fetchBanner();
    }, [params.id, reset]);

    const onSubmit = async (data: BannerFormValues) => {
        setSaving(true);
        try {
            const payload = {
                ...data,
                displayOrder: parseInt(data.displayOrder),
            };

            const res = await fetch(`/api/marketing/banners/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();
            if (result.success) {
                router.push('/marketing/banners');
            }
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/marketing/banners/${params.id}`, { method: 'DELETE' });
            if (res.ok) {
                router.push('/marketing/banners');
            }
        } catch (error) {
            console.error('Delete failed:', error);
        } finally {
            setConfirmOpen(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-[13px] text-muted-foreground">Loading banner details...</p>
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
                        <h1 className="text-xl font-semibold text-foreground">Edit Banner</h1>
                        <p className="text-[13px] text-muted-foreground mt-0.5">Modify your promotional banner.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setConfirmOpen(true)}
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
                    {/* Banner Content */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                            <Type className="w-4 h-4 text-primary" />
                            Banner Content
                        </h2>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Title</label>
                                    <input
                                        {...register('title')}
                                        className="w-full h-11 px-4 bg-muted/20 border border-border rounded-lg text-[14px] font-medium text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition placeholder:text-muted-foreground/50"
                                        placeholder="e.g. New Summer Collection"
                                    />
                                    {errors.title && <p className="text-destructive text-[11px] font-medium">{errors.title.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Subtitle</label>
                                    <input
                                        {...register('subtitle')}
                                        className="w-full h-11 px-4 bg-muted/20 border border-border rounded-lg text-[14px] font-medium text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition placeholder:text-muted-foreground/50"
                                        placeholder="e.g. Up to 50% off on all items"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-primary" />
                            Images
                        </h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    <Monitor className="w-3.5 h-3.5" /> Desktop Image URL
                                </label>
                                <input
                                    {...register('imageDesktop')}
                                    className="w-full h-11 px-4 bg-muted/20 border border-border rounded-lg text-[13px] font-medium text-primary outline-none focus:ring-2 focus:ring-primary/20 transition"
                                    placeholder="https://example.com/banner-desktop.jpg"
                                />
                                {errors.imageDesktop && <p className="text-destructive text-[11px] font-medium">{errors.imageDesktop.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    <Smartphone className="w-3.5 h-3.5" /> Mobile Image URL (Optional)
                                </label>
                                <input
                                    {...register('imageMobile')}
                                    className="w-full h-11 px-4 bg-muted/20 border border-border rounded-lg text-[13px] font-medium text-primary outline-none focus:ring-2 focus:ring-primary/20 transition"
                                    placeholder="https://example.com/banner-mobile.jpg"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Link & Ordering */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                            <LinkIcon className="w-4 h-4 text-primary" />
                            Link & Ordering
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Link URL</label>
                                <input
                                    {...register('linkUrl')}
                                    className="w-full h-11 px-4 bg-muted/20 border border-border rounded-lg text-[13px] font-medium text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition"
                                    placeholder="/shop/new-arrivals"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Button Text</label>
                                <input
                                    {...register('linkText')}
                                    className="w-full h-11 px-4 bg-muted/20 border border-border rounded-lg text-[13px] font-medium text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition"
                                    placeholder="Shop Now"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Sort Order</label>
                                <input
                                    {...register('displayOrder')}
                                    type="number"
                                    className="w-full h-11 px-4 bg-muted/20 border border-border rounded-lg text-[13px] font-medium text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition"
                                />
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
                                <p className="text-[11px] text-muted-foreground">Show this banner on the website</p>
                            </div>
                        </label>
                    </div>

                    {/* Placement */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-primary" />
                            Placement
                        </h2>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Position</label>
                            <select
                                {...register('position')}
                                className="w-full h-10 px-3 bg-muted/20 border border-border rounded-lg text-[13px] font-medium outline-none focus:ring-2 focus:ring-primary/20 transition appearance-none cursor-pointer"
                            >
                                <option value="HOME_HERO">Home Hero</option>
                                <option value="HOME_SECONDARY">Home Secondary</option>
                                <option value="CATEGORY_TOP">Category Top</option>
                                <option value="PRODUCT_SIDEBAR">Product Sidebar</option>
                                <option value="CHECKOUT_TOP">Checkout Top</option>
                            </select>
                        </div>
                    </div>
                </div>
            </form>

            <ConfirmDialog
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Delete Promotional Banner?"
                description="Are you sure you want to delete this promotional banner? This action cannot be undone, and the banner will instantly disappear from the storefront."
                confirmText="Delete Banner"
                variant="danger"
            />
        </div>
    );
}
