'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ArrowLeft,
    Image as ImageIcon,
    Loader2,
    Plus,
    Tag,
    Check
} from 'lucide-react';

export default function NewCategoryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryParentId = searchParams.get('parentId');
    const [loading, setLoading] = useState(false);
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
                        disabled={loading}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Save Category
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
                        <div className="w-32 h-32 bg-muted/40 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-pointer hover:bg-muted/60 transition">
                            {imagePreview ? (
                                <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" />
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
                            <p className="text-[13px] font-medium text-foreground">Upload a cover photo</p>
                            <p className="text-[12px] text-muted-foreground mt-1">This image will show at the top of the category page.</p>
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
