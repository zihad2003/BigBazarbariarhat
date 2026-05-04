'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    Image as ImageIcon,
    Plus,
    Trash2,
    Loader2,
    Check,
    Tag,
    DollarSign,
    Box,
    LayoutGrid,
    Search,
    ChevronRight,
    AlertCircle,
    Eye
} from 'lucide-react';

/* ──────────────────── Types ──────────────────── */

interface Variant {
    id: string;
    size: string;
    color: string;
    sku: string;
    stock: number;
    price: number;
}

/* ──────────────────── Page ──────────────────── */

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [stock, setStock] = useState('0');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [variants, setVariants] = useState<Variant[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${params.id}`);
                const result = await res.json();
                if (result.success) {
                    const p = result.data;
                    setName(p.name);
                    setPrice(p.basePrice.toString());
                    setSalePrice(p.salePrice?.toString() || '');
                    setStock(p.stockQuantity.toString());
                    setCategory(p.categoryId);
                    setDescription(p.description || '');
                    setVariants(p.variants || []);
                    if (p.images?.[0]) setImagePreview(p.images[0].url);
                }
            } catch (error) {
                console.error('Failed to load product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [params.id]);

    const handleSave = async () => {
        setSaving(true);
        // Mock save
        await new Promise(r => setTimeout(r, 1000));
        router.push('/products');
    };

    const addVariant = () => {
        const newVariant: Variant = {
            id: Math.random().toString(36).substr(2, 9),
            size: '',
            color: '',
            sku: '',
            stock: 0,
            price: 0
        };
        setVariants([...variants, newVariant]);
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-[13px] text-muted-foreground">Loading product details...</p>
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
                        <h1 className="text-xl font-semibold text-foreground">Edit Product</h1>
                        <p className="text-[13px] text-muted-foreground">Update the details of your item.</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                            <Tag className="w-4 h-4 text-primary" />
                            General Information
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-medium text-muted-foreground">Product Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full h-11 px-4 bg-background border border-input rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-medium text-muted-foreground">Description</label>
                                <textarea
                                    rows={5}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full p-4 bg-background border border-input rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Stock */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary" />
                            Pricing & Stock
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-medium text-muted-foreground">Regular Price (৳)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    className="w-full h-11 px-4 bg-background border border-input rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-medium text-muted-foreground">Sale Price (৳)</label>
                                <input
                                    type="number"
                                    value={salePrice}
                                    onChange={e => setSalePrice(e.target.value)}
                                    className="w-full h-11 px-4 bg-background border border-input rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition text-emerald-600 font-semibold"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-medium text-muted-foreground">Available Stock</label>
                                <input
                                    type="number"
                                    value={stock}
                                    onChange={e => setStock(e.target.value)}
                                    className="w-full h-11 px-4 bg-background border border-input rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Variants */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-semibold flex items-center gap-2">
                                <LayoutGrid className="w-4 h-4 text-primary" />
                                Product Variants
                            </h2>
                            <button
                                onClick={addVariant}
                                className="text-[12px] font-semibold text-primary hover:underline flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" />
                                Add Variant
                            </button>
                        </div>

                        {variants.length === 0 ? (
                            <div className="text-center py-10 border-2 border-dashed border-border rounded-xl">
                                <p className="text-[13px] text-muted-foreground">No variants added yet (e.g. Sizes or Colors).</p>
                                <button onClick={addVariant} className="mt-3 text-[12px] font-bold text-primary px-4 py-1.5 bg-primary/5 rounded-full hover:bg-primary/10 transition">
                                    Add your first variant
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {variants.map((v, i) => (
                                    <div key={v.id} className="grid grid-cols-5 gap-3 p-3 bg-muted/30 rounded-lg group relative">
                                        <input
                                            placeholder="Size"
                                            defaultValue={v.size}
                                            className="h-9 px-3 bg-background border border-input rounded-md text-[12px]"
                                        />
                                        <input
                                            placeholder="Color"
                                            defaultValue={v.color}
                                            className="h-9 px-3 bg-background border border-input rounded-md text-[12px]"
                                        />
                                        <input
                                            placeholder="SKU"
                                            defaultValue={v.sku}
                                            className="h-9 px-3 bg-background border border-input rounded-md text-[12px]"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Stock"
                                            defaultValue={v.stock}
                                            className="h-9 px-3 bg-background border border-input rounded-md text-[12px]"
                                        />
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                placeholder="Price"
                                                defaultValue={v.price}
                                                className="flex-1 h-9 px-3 bg-background border border-input rounded-md text-[12px]"
                                            />
                                            <button
                                                onClick={() => setVariants(variants.filter(item => item.id !== v.id))}
                                                className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Settings & Photos */}
                <div className="space-y-6">
                    {/* Media */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-primary" />
                            Product Photo
                        </h2>
                        <div className="aspect-square w-full bg-muted/40 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center p-6 relative overflow-hidden group cursor-pointer hover:bg-muted/60 transition">
                            {imagePreview ? (
                                <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <>
                                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center mb-3 shadow-sm">
                                        <Plus className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <p className="text-[12px] font-medium text-foreground">Upload Photo</p>
                                    <p className="text-[11px] text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) setImagePreview(URL.createObjectURL(file));
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Organization */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                            <Box className="w-4 h-4 text-primary" />
                            Organization
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-medium text-muted-foreground">Category</label>
                                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full h-10 px-3 bg-background border border-input rounded-lg text-[13px] outline-none">
                                    <option value="">Select Category</option>
                                    <option value="panjabi">Panjabi</option>
                                    <option value="saree">Saree</option>
                                    <option value="salwar-kameez">Salwar Kameez</option>
                                    <option value="lungi">Lungi</option>
                                    <option value="kids">Kid's Wear</option>
                                    <option value="accessories">Accessories</option>
                                    <option value="wedding">Wedding Touch</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-medium text-muted-foreground">Status</label>
                                <select className="w-full h-10 px-3 bg-background border border-input rounded-lg text-[13px] outline-none font-semibold text-emerald-600">
                                    <option value="active">Active (Visible)</option>
                                    <option value="draft">Draft (Hidden)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                            <Search className="w-4 h-4 text-primary" />
                            Search Visibility
                        </h2>
                        <div className="space-y-3">
                            <div className="p-3 bg-muted/40 rounded-lg">
                                <p className="text-[11px] font-semibold text-primary truncate">{name || 'Product Name'}</p>
                                <p className="text-[10px] text-emerald-700 truncate">bigbazar.com/products/{name.toLowerCase().replace(/ /g, '-')}</p>
                                <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1">{description || 'No description provided yet.'}</p>
                            </div>
                            <button className="w-full py-2 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
                                Edit Search Info
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
