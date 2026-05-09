'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import {
    Plus, Trash2, Edit3, Loader2, Eye, EyeOff, Save, X,
    Image as ImageIcon, ExternalLink, GripVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BannerItem {
    id: string;
    title: string;
    subtitle?: string;
    imageDesktop: string;
    imageMobile?: string;
    linkUrl?: string;
    linkText?: string;
    position: string;
    displayOrder: number;
    isActive: boolean;
}

export default function BannersPage() {
    const [banners, setBanners] = useState<BannerItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '', subtitle: '', imageDesktop: '', imageMobile: '',
        linkUrl: '', linkText: '', position: 'promo', displayOrder: '0', isActive: true,
    });

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/banners?includeInactive=true');
            const result = await res.json();
            if (result.success && result.data) setBanners(result.data);
        } catch (error) {
            console.error('Failed to fetch banners:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBanners(); }, []);

    const resetForm = () => {
        setFormData({ title: '', subtitle: '', imageDesktop: '', imageMobile: '', linkUrl: '', linkText: '', position: 'promo', displayOrder: '0', isActive: true });
        setEditingBanner(null);
    };

    const openEdit = (b: BannerItem) => {
        setEditingBanner(b);
        setFormData({
            title: b.title, subtitle: b.subtitle || '', imageDesktop: b.imageDesktop,
            imageMobile: b.imageMobile || '', linkUrl: b.linkUrl || '', linkText: b.linkText || '',
            position: b.position, displayOrder: String(b.displayOrder), isActive: b.isActive,
        });
        setShowModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const confirmMsg = editingBanner 
            ? 'Are you sure you want to save changes to this banner?' 
            : 'Are you sure you want to create this new banner?';
        
        if (!confirm(confirmMsg)) return;

        setSaving(true);
        const toastId = toast.loading(editingBanner ? 'Saving banner...' : 'Creating banner...');
        try {
            const url = editingBanner ? `/api/banners/${editingBanner.id}` : '/api/banners';
            const method = editingBanner ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method, headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await res.json();
            if (!result.success) {
                toast.error(result.error || 'Failed to save banner.', { id: toastId });
                return;
            }
            toast.success(editingBanner ? 'Banner updated successfully! 🎉' : 'Banner created successfully! 🎉', { id: toastId });
            setShowModal(false);
            resetForm();
            fetchBanners();
        } catch (error: any) {
            console.error('Save failed:', error);
            toast.error(error.message || 'An unexpected error occurred.', { id: toastId });
        } finally {
            setSaving(false);
        }
    };

    const deleteBanner = async (id: string) => {
        if (!confirm('Are you sure you want to delete this banner? This action is permanent.')) return;
        const toastId = toast.loading('Deleting banner...');
        try {
            const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (result.success) {
                toast.success('Banner deleted successfully! 🎉', { id: toastId });
                fetchBanners();
            } else {
                toast.error(result.error || 'Failed to delete banner.', { id: toastId });
            }
        } catch (error: any) {
            console.error('Delete failed:', error);
            toast.error(error.message || 'An unexpected error occurred.', { id: toastId });
        }
    };

    const toggleActive = async (b: BannerItem) => {
        const action = b.isActive ? 'hide' : 'show';
        if (!confirm(`Are you sure you want to ${action} this banner on the storefront?`)) return;

        const toastId = toast.loading('Updating banner status...');
        try {
            const res = await fetch(`/api/banners/${b.id}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !b.isActive }),
            });
            const result = await res.json();
            if (result.success) {
                toast.success(`Banner is now ${!b.isActive ? 'Hidden' : 'Visible'}! 🎉`, { id: toastId });
                fetchBanners();
            } else {
                toast.error(result.error || 'Failed to update banner.', { id: toastId });
            }
        } catch (error: any) {
            console.error('Toggle failed:', error);
            toast.error(error.message || 'An unexpected error occurred.', { id: toastId });
        }
    };

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-gray-100 pb-12">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic">Banners</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-3">
                        Manage homepage promotional banners and hero slides
                    </p>
                </div>
                <Button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="h-16 px-10 bg-black text-white rounded-3xl text-[10px] font-black uppercase tracking-widest gap-3 shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus className="h-5 w-5" /> Add Banner
                </Button>
            </div>

            {/* Banners Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
                </div>
            ) : banners.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-[3rem] border border-gray-100">
                    <ImageIcon className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-sm font-bold text-gray-400">No banners yet. Create your first one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {banners.map((banner) => (
                        <div key={banner.id} className={`bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group ${!banner.isActive ? 'opacity-60' : ''}`}>
                            {/* Image Preview */}
                            <div className="relative h-[200px] bg-gray-100">
                                <Image src={banner.imageDesktop} alt={banner.title} fill className="object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-6 text-white">
                                    {banner.subtitle && <span className="text-[10px] uppercase tracking-widest font-bold text-white/70 block mb-1">{banner.subtitle}</span>}
                                    <h3 className="text-xl font-black">{banner.title}</h3>
                                </div>
                                {!banner.isActive && (
                                    <div className="absolute top-4 left-4 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                        Hidden
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                    {banner.position}
                                </div>
                            </div>

                            {/* Details & Actions */}
                            <div className="p-6 flex items-center justify-between">
                                <div className="min-w-0">
                                    {banner.linkUrl && (
                                        <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest truncate flex items-center gap-1">
                                            <ExternalLink className="h-3 w-3" /> {banner.linkUrl}
                                        </p>
                                    )}
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                        Order: {banner.displayOrder}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => toggleActive(banner)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${banner.isActive ? 'bg-green-50 text-green-500 border-green-100' : 'bg-amber-50 text-amber-500 border-amber-100'}`}>
                                        {banner.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                    </button>
                                    <button onClick={() => openEdit(banner)} className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all border border-indigo-100">
                                        <Edit3 className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => deleteBanner(banner.id)} className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-100">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 text-black">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => { setShowModal(false); resetForm(); }} />
                    <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="p-10 bg-gray-50/50 border-b border-gray-50 flex justify-between items-center sticky top-0 z-10">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic">
                                    {editingBanner ? 'Edit Banner' : 'New Banner'}
                                </h2>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 italic">
                                    {editingBanner ? 'Update banner details' : 'Create a new promotional banner'}
                                </p>
                            </div>
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-10 space-y-6">
                            {/* Image Preview */}
                            {formData.imageDesktop && (
                                <div className="relative h-[180px] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                                    <Image src={formData.imageDesktop} alt="Preview" fill className="object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    <span className="absolute bottom-3 left-4 text-white text-[10px] font-black uppercase tracking-widest">Live Preview</span>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Title *</label>
                                    <input required placeholder="e.g. Summer Edit" className="w-full h-14 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none" value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Subtitle / Tag</label>
                                    <input placeholder="e.g. New Arrival, 50% Off" className="w-full h-14 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none" value={formData.subtitle}
                                        onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Desktop Image URL *</label>
                                <input required placeholder="https://images.unsplash.com/..." className="w-full h-14 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none text-xs" value={formData.imageDesktop}
                                    onChange={e => setFormData({ ...formData, imageDesktop: e.target.value })}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Mobile Image URL (Optional)</label>
                                <input placeholder="https://..." className="w-full h-14 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none text-xs" value={formData.imageMobile}
                                    onChange={e => setFormData({ ...formData, imageMobile: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Link URL</label>
                                    <input placeholder="/sale or /products?category=Men" className="w-full h-14 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none text-xs" value={formData.linkUrl}
                                        onChange={e => setFormData({ ...formData, linkUrl: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Link Text</label>
                                    <input placeholder="Shop Now" className="w-full h-14 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none" value={formData.linkText}
                                        onChange={e => setFormData({ ...formData, linkText: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Position *</label>
                                    <select className="w-full h-14 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none appearance-none" value={formData.position}
                                        onChange={e => setFormData({ ...formData, position: e.target.value })}
                                    >
                                        <option value="hero">Hero Slider</option>
                                        <option value="promo">Promo Section</option>
                                        <option value="sidebar">Sidebar</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Display Order</label>
                                    <input type="number" className="w-full h-14 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-black text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none" value={formData.displayOrder}
                                        onChange={e => setFormData({ ...formData, displayOrder: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="w-5 h-5 rounded-lg accent-indigo-600" />
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active (visible on storefront)</span>
                                </label>
                            </div>

                            <Button disabled={saving} className="w-full h-16 bg-black text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all gap-4">
                                {saving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-5 w-5 text-indigo-400" />}
                                {editingBanner ? 'Save Changes' : 'Create Banner'}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
