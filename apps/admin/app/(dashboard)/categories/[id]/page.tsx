'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    Image as ImageIcon,
    Loader2,
    Plus,
    Tag,
    Check,
    Trash2
} from 'lucide-react';

export default function EditCategoryPage(props: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [order, setOrder] = useState('0');
    const [status, setStatus] = useState('active');

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await fetch(`/api/categories/${params.id}`);
                const result = await res.json();
                if (result.success) {
                    const cat = result.data;
                    setName(cat.name);
                    setSlug(cat.slug);
                    setDescription(cat.description || '');
                    setOrder(cat.displayOrder.toString());
                    setStatus(cat.isActive ? 'active' : 'draft');
                    if (cat.image) setImagePreview(cat.image);
                }
            } catch (error) {
                console.error('Failed to load category:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) fetchCategory();
    }, [params.id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                name,
                slug,
                description,
                displayOrder: order,
                isActive: status === 'active',
                image: imagePreview
            };

            const res = await fetch(`/api/categories/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (result.success) {
                router.push('/categories');
            }
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setSaving(false);
        }
    };

    const generateSlug = () => {
        if (!name) return;
        const s = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        setSlug(s);
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-[13px] text-muted-foreground">Loading category...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[800px] mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <div>
                        <h1 className="text-xl font-semibold text-foreground">Edit Category</h1>
                        <p className="text-[13px] text-muted-foreground">Update the details of this category.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="px-4 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
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
                </div>
            </div>

            <div className="space-y-6">
                {/* Information */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary" />
                        Category Details
                    </h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-medium text-muted-foreground">Category Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    onBlur={generateSlug}
                                    className="w-full h-11 px-4 bg-background border border-input rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-medium text-muted-foreground">Slug (URL)</label>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={e => setSlug(e.target.value)}
                                    className="w-full h-11 px-4 bg-background border border-input rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition text-muted-foreground"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[12px] font-medium text-muted-foreground">Description</label>
                            <textarea
                                rows={4}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full p-4 bg-background border border-input rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-medium text-muted-foreground">Sort Order</label>
                                <input
                                    type="number"
                                    value={order}
                                    onChange={e => setOrder(e.target.value)}
                                    className="w-full h-11 px-4 bg-background border border-input rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-medium text-muted-foreground">Status</label>
                                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full h-11 px-3 bg-background border border-input rounded-lg text-[13px] outline-none font-semibold text-emerald-600">
                                    <option value="active">Active (Visible)</option>
                                    <option value="draft">Draft (Hidden)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Photo */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-primary" />
                        Category Image
                    </h2>
                    <div className="flex items-center gap-8">
                        <div className="w-32 h-32 bg-muted/40 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-pointer hover:bg-muted/60 transition">
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setImagePreview(null);
                                        }}
                                        className="absolute top-2 right-2 p-1.5 bg-destructive rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </>
                            ) : (
                                <Plus className="w-6 h-6 text-muted-foreground" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setImagePreview(reader.result as string);
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-[13px] font-medium text-foreground">Update category photo</p>
                            <p className="text-[12px] text-muted-foreground mt-1">PNG, JPG up to 5MB.</p>
                            <button className="mt-4 px-4 py-2 border border-border rounded-lg text-[12px] font-bold hover:bg-muted/60 transition relative overflow-hidden">
                                Choose Photo
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => setImagePreview(reader.result as string);
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
