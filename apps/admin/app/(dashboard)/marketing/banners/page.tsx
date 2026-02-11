'use client';

import { useState, useEffect } from 'react';
import {
    Image as ImageIcon,
    Plus,
    Trash2,
    Eye,
    Layout,
    ArrowRight,
    Loader2,
    CheckCircle2,
    XCircle,
    Monitor,
    Smartphone,
    ExternalLink,
    Move
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function BannersPage() {
    const [banners, setBanners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        imageDesktop: '',
        imageMobile: '',
        linkUrl: '',
        linkText: 'Learn More',
        position: 'HOME_HERO',
        displayOrder: '0',
    });

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/marketing/banners');
            const result = await res.json();
            if (result.success) {
                setBanners(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch assets:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleCreateBanner = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            const res = await fetch('/api/marketing/banners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await res.json();
            if (result.success) {
                setShowCreateModal(false);
                fetchBanners();
                setFormData({
                    title: '',
                    subtitle: '',
                    imageDesktop: '',
                    imageMobile: '',
                    linkUrl: '',
                    linkText: 'Learn More',
                    position: 'HOME_HERO',
                    displayOrder: '0',
                });
            }
        } catch (error) {
            console.error('Manifestation failed:', error);
        } finally {
            setCreating(false);
        }
    };

    const deleteBanner = async (id: string) => {
        if (!confirm('Are you sure you want to decommission this visual asset?')) return;
        try {
            const res = await fetch(`/api/marketing/banners/${id}`, { method: 'DELETE' });
            if (res.ok) fetchBanners();
        } catch (error) {
            console.error('Decommissioning failed:', error);
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
            console.error('Status update failed:', error);
        }
    };

    return (
        <div className="space-y-12">
            {/* Master Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-gray-100 pb-12">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic">Visual Assets</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-3">Curate the aesthetic manifestation of the storefront</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="h-16 px-10 bg-black text-white rounded-3xl text-[10px] font-black uppercase tracking-widest gap-3 shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus className="h-5 w-5" />
                    Inject Asset
                </Button>
            </div>

            {/* Asset Matrix List */}
            <div className="space-y-12">
                {loading ? (
                    <div className="py-40 text-center">
                        <Loader2 className="h-16 w-16 animate-spin mx-auto text-indigo-600 mb-6" />
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Interrogating Asset Hub...</p>
                    </div>
                ) : banners.length === 0 ? (
                    <div className="bg-white rounded-[4rem] border-4 border-dashed border-gray-50 flex flex-col items-center justify-center py-40">
                        <ImageIcon className="h-20 w-20 text-gray-100 mb-6" />
                        <h3 className="text-2xl font-black text-gray-900 tracking-tighter">No Visual Assets Found</h3>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2 uppercase">Initial manifestation awaiting input</p>
                        <Button onClick={() => setShowCreateModal(true)} className="mt-8">Inject First Asset</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-10">
                        {banners.map((banner) => (
                            <div key={banner.id} className="bg-white rounded-[3.5rem] border border-gray-100 overflow-hidden shadow-2xl shadow-indigo-900/5 group">
                                <div className="grid grid-cols-1 lg:grid-cols-12">
                                    {/* Preview Block */}
                                    <div className="lg:col-span-5 relative h-[300px] lg:h-auto overflow-hidden bg-gray-900">
                                        <img
                                            src={banner.imageDesktop}
                                            alt=""
                                            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-10">
                                            <Badge className="w-fit mb-4 bg-white/20 backdrop-blur-md text-white border-white/10 uppercase tracking-widest text-[9px] font-black">
                                                {banner.position.replace(/_/g, ' ')}
                                            </Badge>
                                            <h3 className="text-3xl font-black text-white tracking-tighter italic">{banner.title}</h3>
                                            <p className="text-white/60 text-sm font-bold mt-2 truncate">{banner.subtitle}</p>
                                        </div>
                                    </div>
                                    {/* Intelligence Block */}
                                    <div className="lg:col-span-7 p-10 lg:p-14 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Asset Configuration</p>
                                                <h4 className="text-xl font-black text-gray-900 tracking-tight italic">Order Position: {banner.displayOrder}</h4>
                                            </div>
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => toggleActive(banner)}
                                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border ${banner.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-300 border-gray-100'}`}
                                                >
                                                    <CheckCircle2 className="h-6 w-6" />
                                                </button>
                                                <button
                                                    onClick={() => deleteBanner(banner.id)}
                                                    className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
                                                >
                                                    <Trash2 className="h-6 w-6" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8 mt-10">
                                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <Monitor className="h-3 w-3" /> Desktop Manifest
                                                </p>
                                                <p className="text-xs font-bold text-gray-900 truncate italic">{banner.imageDesktop}</p>
                                            </div>
                                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <Smartphone className="h-3 w-3" /> Mobile Hybrid
                                                </p>
                                                <p className="text-xs font-bold text-gray-900 truncate italic">{banner.imageMobile || 'Implicit Sync'}</p>
                                            </div>
                                        </div>

                                        <div className="mt-10 flex items-center justify-between pt-8 border-t border-gray-50">
                                            <div className="flex items-center gap-4 text-indigo-600">
                                                <ExternalLink className="h-4 w-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{banner.linkUrl || 'Standalone Artifact'}</span>
                                            </div>
                                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">Logical ID: {banner.id}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Creation Modal Interface */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowCreateModal(false)} />
                    <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="p-12 bg-gray-50/50 border-b border-gray-50 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic">Asset Manifestation</h2>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Configure new visual intelligence for storefront</p>
                            </div>
                            <button onClick={() => setShowCreateModal(false)} className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateBanner} className="p-12 space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Primary Narrative (Title)</label>
                                    <input
                                        required
                                        className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-black text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Secondary Narrative (Subtitle)</label>
                                    <input
                                        className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                        value={formData.subtitle}
                                        onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Desktop Artifact (Image URL)</label>
                                    <input
                                        required
                                        className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-indigo-600 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                        value={formData.imageDesktop}
                                        onChange={e => setFormData({ ...formData, imageDesktop: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Mobile Artifact (Image URL)</label>
                                    <input
                                        className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-indigo-600 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                        value={formData.imageMobile}
                                        onChange={e => setFormData({ ...formData, imageMobile: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Structural Position</label>
                                    <select
                                        className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-black text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none appearance-none"
                                        value={formData.position}
                                        onChange={e => setFormData({ ...formData, position: e.target.value })}
                                    >
                                        <option value="HOME_HERO">Home Hero</option>
                                        <option value="HOME_SECONDARY">Home Secondary</option>
                                        <option value="CATEGORY_TOP">Category Top</option>
                                        <option value="PRODUCT_SIDEBAR">Product Sidebar</option>
                                        <option value="CHECKOUT_TOP">Checkout Top</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Display Sequence</label>
                                    <input
                                        type="number"
                                        className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-black text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                        value={formData.displayOrder}
                                        onChange={e => setFormData({ ...formData, displayOrder: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Destination Link URL</label>
                                    <input
                                        className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                        value={formData.linkUrl}
                                        onChange={e => setFormData({ ...formData, linkUrl: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Action Narrative (Button Text)</label>
                                    <input
                                        className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-black text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                        value={formData.linkText}
                                        onChange={e => setFormData({ ...formData, linkText: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Button
                                disabled={creating}
                                className="w-full h-24 bg-black text-white rounded-[2.5rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-4 mt-8"
                            >
                                {creating ? <Loader2 className="h-7 w-7 animate-spin" /> : <Layout className="h-7 w-7" />}
                                {creating ? 'Manifesting Intelligence...' : 'Inject Visual Asset Globally'}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
