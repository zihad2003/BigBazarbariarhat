'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ArrowLeft,
    Image as ImageIcon,
    Loader2,
    Plus,
    Tag,
    Check,
    Trash2
} from 'lucide-react';

function NewCategoryPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryParentId = searchParams.get('parentId');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [parentCategories, setParentCategories] = useState<any[]>([]);

    // Form State
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [parentId, setParentId] = useState<string>('');

    useEffect(() => {
        if (queryParentId) {
            setParentId(queryParentId);
        }
    }, [queryParentId]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                const result = await res.json();
                if (result.success) {
                    // Only allow selecting top-level categories as parent
                    setParentCategories(result.data.filter((c: any) => !c.parentId));
                }
            } catch (error) {
                console.error('Failed to load categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload = {
                name,
                slug,
                description,
                image: imagePreview,
                parentId: parentId || null
            };

            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            
            if (result.success) {
                router.push('/categories');
            }
        } catch (error) {
            console.error('Failed to save:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = () => {
        const s = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        setSlug(s);
    };

    const handleUpload = async (file: File) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const result = await res.json();
            if (result.success) {
                setImagePreview(result.url);
            }
        } catch (error) {
            console.error('Failed to upload image:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-[800px] mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <div>
                        <h1 className="text-xl font-semibold text-foreground">Add New Category</h1>
                        <p className="text-[13px] text-muted-foreground">Create a new group or subcategory.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="px-4 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading || uploading}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition flex items-center gap-2"
                    >
                        {loading || uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        {uploading ? 'Uploading...' : 'Save Category'}
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
                                    placeholder="e.g. Wedding Wear"
                                    className="w-full h-11 px-4 bg-background border border-input rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-medium text-muted-foreground">Slug (URL)</label>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={e => setSlug(e.target.value)}
                                    placeholder="wedding-wear"
                                    className="w-full h-11 px-4 bg-background border border-input rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition text-muted-foreground"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-[12px] font-medium text-muted-foreground">Parent Category (Optional)</label>
                            <select 
                                value={parentId} 
                                onChange={e => setParentId(e.target.value)} 
                                className="w-full h-11 px-3 bg-background border border-input rounded-lg text-[13px] outline-none transition"
                            >
                                <option value="">None (Top Level Category)</option>
                                {parentCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <p className="text-[11px] text-muted-foreground mt-1">Select a parent to make this a subcategory (e.g. "T-Shirts" under "Men Collection").</p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[12px] font-medium text-muted-foreground">Description</label>
                            <textarea
                                rows={4}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Describe what products belong here..."
                                className="w-full p-4 bg-background border border-input rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition resize-none"
                            />
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
                        <div className="w-32 h-32 bg-muted/40 rounded-xl border border-border flex flex-col items-center justify-center text-center relative overflow-hidden group">
                            {imagePreview ? (
                                <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <>
                                    <Plus className="w-6 h-6 text-muted-foreground" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (file) handleUpload(file);
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-[13px] font-medium text-foreground">Upload a cover photo</p>
                            <p className="text-[12px] text-muted-foreground mt-1">This image will show at the top of the category page.</p>
                            <div className="flex items-center gap-3 mt-4">
                                <button className="px-4 py-2 border border-border rounded-lg text-[12px] font-bold hover:bg-muted/60 transition relative overflow-hidden">
                                    Choose Photo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (file) handleUpload(file);
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </button>
                                {imagePreview && (
                                    <button
                                        type="button"
                                        onClick={() => setImagePreview(null)}
                                        className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg text-[12px] font-bold hover:bg-destructive/20 transition flex items-center gap-1.5"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Remove Photo
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default function NewCategoryPage() {
    return (
        <Suspense fallback={
            <div className="h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-[13px] font-medium text-muted-foreground animate-pulse">Loading category form...</p>
                </div>
            </div>
        }>
            <NewCategoryPageContent />
        </Suspense>
    );
}
