'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Image as ImageIcon,
    Plus,
    Trash2,
    Monitor,
    Smartphone,
    ExternalLink,
    CheckCircle2,
    Loader2,
    ArrowRight,
    Edit3
} from 'lucide-react';

export default function BannersPage() {
    const [banners, setBanners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/marketing/banners');
            const result = await res.json();
            if (result.success) {
                setBanners(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch banners:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const deleteBanner = async (id: string) => {
        if (!confirm('Are you sure you want to delete this banner?')) return;
        try {
            const res = await fetch(`/api/marketing/banners/${id}`, { method: 'DELETE' });
            if (res.ok) fetchBanners();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const toggleActive = async (banner: any) => {
        try {
            const res = await fetch(`/api/marketing/banners/${banner.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !banner.isActive }),
            });
            if (res.ok) fetchBanners();
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-border">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Banners</h1>
                    <p className="text-[13px] text-muted-foreground mt-0.5">Manage your store's promotional banners and visuals.</p>
                </div>
                <Link href="/marketing/banners/new">
                    <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Banner
                    </button>
                </Link>
            </div>

            {/* List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="py-20 text-center flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-[13px] text-muted-foreground">Loading banners...</p>
                    </div>
                ) : banners.length === 0 ? (
                    <div className="bg-card border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center py-20 text-center">
                        <ImageIcon className="w-12 h-12 text-muted-foreground/30 mb-4" />
                        <h3 className="text-[16px] font-bold text-foreground">No Banners Found</h3>
                        <p className="text-[13px] text-muted-foreground mt-1 max-w-[280px]">You haven't added any promotional banners yet.</p>
                        <Link href="/marketing/banners/new" className="mt-6">
                            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition">
                                Create Your First Banner
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {banners.map((banner) => (
                            <div key={banner.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm group hover:border-primary/30 transition-all">
                                <div className="grid grid-cols-1 lg:grid-cols-12">
                                    {/* Preview */}
                                    <div className="lg:col-span-5 relative h-48 lg:h-auto bg-muted overflow-hidden">
                                        <img
                                            src={banner.imageDesktop}
                                            alt=""
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                                            <span className="w-fit px-2 py-0.5 bg-black/40 backdrop-blur-md text-white rounded text-[10px] font-bold uppercase tracking-wider mb-2">
                                                {banner.position.replace(/_/g, ' ')}
                                            </span>
                                            <h3 className="text-lg font-bold text-white tracking-tight">{banner.title}</h3>
                                            <p className="text-white/70 text-[12px] line-clamp-1">{banner.subtitle}</p>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="lg:col-span-7 p-6 lg:p-8 flex flex-col">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Banner Settings</p>
                                                <p className="text-[15px] font-bold text-foreground mt-1">Sort Order: {banner.displayOrder}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => toggleActive(banner)}
                                                    className={`p-2 rounded-lg border transition-all ${banner.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-muted text-muted-foreground border-border hover:text-foreground'}`}
                                                    title={banner.isActive ? 'Active' : 'Inactive'}
                                                >
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </button>
                                                <Link href={`/marketing/banners/${banner.id}`}>
                                                    <button className="p-2 bg-muted text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors">
                                                        <Edit3 className="w-5 h-5" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => deleteBanner(banner.id)}
                                                    className="p-2 bg-rose-50 text-rose-500 border border-rose-100 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-muted/20 rounded-xl border border-border">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                                                    <Monitor className="w-3 h-3" /> Desktop
                                                </p>
                                                <p className="text-[11px] text-foreground truncate font-medium">{banner.imageDesktop}</p>
                                            </div>
                                            <div className="p-4 bg-muted/20 rounded-xl border border-border">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                                                    <Smartphone className="w-3 h-3" /> Mobile
                                                </p>
                                                <p className="text-[11px] text-foreground truncate font-medium">{banner.imageMobile || 'Standard Resizing'}</p>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-6 flex items-center justify-between border-t border-border">
                                            <div className="flex items-center gap-2 text-[12px] text-primary font-medium">
                                                <ExternalLink className="w-4 h-4" />
                                                <span className="truncate max-w-[200px]">{banner.linkUrl || 'No Link'}</span>
                                            </div>
                                            <Link href={`/marketing/banners/${banner.id}`} className="flex items-center gap-1 text-[11px] font-bold uppercase text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                                Edit Banner <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
