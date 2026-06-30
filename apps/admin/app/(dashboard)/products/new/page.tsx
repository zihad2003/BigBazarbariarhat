'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
    Upload,
    Palette
} from 'lucide-react';

/* ──────────────────── Color Suggestions (Bangla + English) ──────────────────── */

const BANGLA_COLOR_SUGGESTIONS = [
    { name: 'সাদা (White)', hex: '#FFFFFF' },
    { name: 'কালো (Black)', hex: '#000000' },
    { name: 'লাল (Red)', hex: '#DC2626' },
    { name: 'নীল (Blue)', hex: '#2563EB' },
    { name: 'সবুজ (Green)', hex: '#16A34A' },
    { name: 'হলুদ (Yellow)', hex: '#EAB308' },
    { name: 'কমলা (Orange)', hex: '#EA580C' },
    { name: 'বেগুনি (Purple)', hex: '#9333EA' },
    { name: 'গোলাপি (Pink)', hex: '#EC4899' },
    { name: 'ধূসর (Grey)', hex: '#6B7280' },
    { name: 'বাদামি (Brown)', hex: '#92400E' },
    { name: 'মেরুন (Maroon)', hex: '#7F1D1D' },
    { name: 'নেভি (Navy)', hex: '#1E3A5F' },
    { name: 'আকাশি (Sky Blue)', hex: '#38BDF8' },
    { name: 'জলপাই (Olive)', hex: '#65A30D' },
    { name: 'ক্রিম (Cream)', hex: '#FFFDD0' },
    { name: 'পিচ (Peach)', hex: '#FFDAB9' },
    { name: 'সোনালি (Golden)', hex: '#D4A017' },
    { name: 'রুপালি (Silver)', hex: '#C0C0C0' },
    { name: 'ম্যাজেন্টা (Magenta)', hex: '#FF00FF' },
    { name: 'তামাটে (Copper)', hex: '#B87333' },
    { name: 'টিল (Teal)', hex: '#0D9488' },
    { name: 'অফ-হোয়াইট (Off-White)', hex: '#FAF9F6' },
    { name: 'কয়লা (Charcoal)', hex: '#36454F' },
    { name: 'রাণী (Rani)', hex: '#D63384' },
];

interface Category { id: string; name: string; }

/* ──────────────────── Page ──────────────────── */

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [stock, setStock] = useState('0');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [instagramReelUrl, setInstagramReelUrl] = useState('');
    
    // Structured clothing variant states
    const [structuredSizes, setStructuredSizes] = useState<string[]>([]);
    const [newSizeInput, setNewSizeInput] = useState('');
    const [structuredColors, setStructuredColors] = useState<{ name: string, hex: string, stock: number, image: string }[]>([]);
    const [colorSuggestionIdx, setColorSuggestionIdx] = useState<number | null>(null);
    const colorInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [fabric, setFabric] = useState('');
    const [care, setCare] = useState('');

    // Flags
    const [featured, setFeatured] = useState(false);
    const [isSale, setIsSale] = useState(false);
    const [isHot, setIsHot] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [isActive, setIsActive] = useState(true);

    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                const result = await res.json();
                if (result.success) {
                    setCategories(result.data);
                }
            } catch (error) {
                console.error('Failed to load categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Format categories hierarchically for dropdown selection
    const getFormattedCategories = () => {
        const rootCategories = categories.filter(c => !c.parentId);
        const formatted: { id: string; name: string }[] = [];

        rootCategories.forEach(parent => {
            formatted.push({
                id: parent.id,
                name: parent.name
            });
            const children = categories.filter(c => c.parentId === parent.id);
            children.forEach(child => {
                formatted.push({
                    id: child.id,
                    name: `  ↳ ${child.name}`
                });
            });
        });

        // Add any categories with missing parent ID mapping
        categories.forEach(c => {
            if (c.parentId && !formatted.some(f => f.id === c.id)) {
                formatted.push({
                    id: c.id,
                    name: c.name
                });
            }
        });

        return formatted;
    };

    const handleSave = async () => {
        if (!name || !price || !category) {
            alert('Please fill in the product name, price, and category.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name,
                description,
                price,
                salePrice: salePrice || null,
                stock,
                categoryId: category,
                instagramReelUrl,
                variants: {
                    sizes: structuredSizes,
                    colors: structuredColors,
                    fabric,
                    care
                },
                featured,
                isSale,
                isHot,
                isNew,
                isActive,
                images: imagePreview ? [imagePreview] : []
            };

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();
            if (result.success) {
                router.push('/products');
            } else {
                alert(result.message || 'Failed to save product');
            }
        } catch (error) {
            console.error('Failed to create product:', error);
            alert('An error occurred while creating the product.');
        } finally {
            setLoading(false);
        }
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
        <div className="max-w-[1000px] mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <div>
                        <h1 className="text-xl font-semibold text-foreground">Add New Product</h1>
                        <p className="text-[13px] text-muted-foreground">Fill in the details to list a new item.</p>
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
                        {uploading ? 'Uploading...' : (loading ? 'Saving...' : 'Save Product')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Media & Video */}
                    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                        <div>
                            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-primary" />
                                Product Photo
                            </h2>
                            <div className="aspect-video w-full bg-muted/40 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center p-6 relative overflow-hidden group cursor-pointer hover:bg-muted/60 transition">
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
                                        if (file) handleUpload(file);
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 border-t border-border pt-6">
                            <label className="text-[12px] font-medium text-muted-foreground flex items-center gap-1.5">
                                Instagram Reel URL (Optional)
                            </label>
                            <input
                                type="url"
                                placeholder="https://www.instagram.com/reel/..."
                                value={instagramReelUrl}
                                onChange={e => setInstagramReelUrl(e.target.value)}
                                className="w-full h-11 px-4 bg-background border border-input rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                            />
                            <p className="text-[10px] text-muted-foreground mt-1">Paste an Instagram reel URL to display the video on the product page.</p>
                        </div>

                        {/* Storefront Image & Video Guidelines Card */}
                        <div className="p-4 bg-muted/40 border border-border rounded-xl space-y-3">
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-foreground flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5 text-primary" />
                                Image & Video Guidelines
                            </h4>
                            <div className="space-y-2 text-[11px] text-muted-foreground leading-relaxed">
                                <p>
                                    <strong className="text-foreground font-semibold">🔴 Instagram Reel Covers / CDNs:</strong> Direct CDN links from Instagram reels expire after a few hours due to security signatures. 
                                </p>
                                <p>
                                    <strong className="text-foreground font-semibold">🟢 Recommended Action:</strong> For permanent, instant, and high-speed loading on the storefront, please <span className="text-foreground underline decoration-primary font-medium">download</span> the cover frame/image and physically upload it under the <strong className="text-foreground">Product Photo</strong> section above.
                                </p>
                                <p>
                                    <strong className="text-foreground font-semibold">🎬 Product Video Previews:</strong> Make sure the pasted Reel URL is a public link. Our system automatically processes and embeds the player directly into the storefront product tabs.
                                </p>
                            </div>
                        </div>
                    </div>

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
                                    placeholder="e.g. Premium Cotton Panjabi"
                                    className="w-full h-11 px-4 bg-background border border-input rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-medium text-muted-foreground">Description</label>
                                <textarea
                                    rows={5}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Tell customers about this product..."
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
                                    placeholder="0.00"
                                    className="w-full h-11 px-4 bg-background border border-input rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-medium text-muted-foreground">Sale Price (৳)</label>
                                <input
                                    type="number"
                                    value={salePrice}
                                    onChange={e => setSalePrice(e.target.value)}
                                    placeholder="0.00"
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

                    {/* Clothing Variants & Specifications */}
                    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                        <div>
                            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                <LayoutGrid className="w-4 h-4 text-primary" />
                                Sizes (সাইজ)
                            </h2>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {structuredSizes.map(size => (
                                    <span key={size} className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-lg flex items-center gap-1.5">
                                        {size}
                                        <button 
                                            type="button" 
                                            onClick={() => setStructuredSizes(structuredSizes.filter(s => s !== size))}
                                            className="text-primary hover:text-rose-600 transition-colors"
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add size (e.g. S, M, L, 38, 40)"
                                    value={newSizeInput}
                                    onChange={e => setNewSizeInput(e.target.value)}
                                    className="flex-1 h-9 px-3 bg-background border border-input rounded-lg text-xs outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (newSizeInput && !structuredSizes.includes(newSizeInput.trim())) {
                                            setStructuredSizes([...structuredSizes, newSizeInput.trim()]);
                                            setNewSizeInput('');
                                        }
                                    }}
                                    className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors"
                                >
                                    Add Size
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-border pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold flex items-center gap-2">
                                    <Palette className="w-4 h-4 text-primary" />
                                    Colors & Stock (রঙ ও স্টক)
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setStructuredColors([...structuredColors, { name: '', hex: '#000000', stock: 0, image: '' }])}
                                    className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors flex items-center gap-1.5"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add Color
                                </button>
                            </div>
                            {structuredColors.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                                    <Palette className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                                    <p className="text-[12px] text-muted-foreground">No colors added yet.</p>
                                    <p className="text-[11px] text-muted-foreground/60 mt-0.5">Click "Add Color" to define color variants.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {structuredColors.map((color, idx) => (
                                        <div key={idx} className="bg-muted/30 border border-border/50 p-3 rounded-xl space-y-3">
                                            {/* Row 1: Color name with suggestions + hex picker swatch */}
                                            <div className="flex gap-3 items-start">
                                                <div className="relative flex-1">
                                                    <input
                                                        ref={el => { colorInputRefs.current[idx] = el; }}
                                                        type="text"
                                                        placeholder="রঙের নাম লিখুন (e.g. সাদা, লাল, নীল)"
                                                        value={color.name}
                                                        onChange={e => {
                                                            const updated = [...structuredColors];
                                                            updated[idx].name = e.target.value;
                                                            setStructuredColors(updated);
                                                            setColorSuggestionIdx(e.target.value.length > 0 ? idx : null);
                                                        }}
                                                        onFocus={() => { if (color.name.length > 0) setColorSuggestionIdx(idx); }}
                                                        onBlur={() => setTimeout(() => setColorSuggestionIdx(null), 150)}
                                                        className="w-full h-9 px-3 bg-background border border-input rounded-lg text-xs outline-none focus:ring-2 focus:ring-ring transition"
                                                    />
                                                    {/* Bangla color suggestions dropdown */}
                                                    {colorSuggestionIdx === idx && color.name.length > 0 && (() => {
                                                        const q = color.name.toLowerCase();
                                                        const matches = BANGLA_COLOR_SUGGESTIONS.filter(s =>
                                                            s.name.toLowerCase().includes(q)
                                                        ).slice(0, 6);
                                                        if (matches.length === 0) return null;
                                                        return (
                                                            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl overflow-hidden">
                                                                {matches.map((s, si) => (
                                                                    <button
                                                                        key={si}
                                                                        type="button"
                                                                        onMouseDown={(e) => {
                                                                            e.preventDefault();
                                                                            const updated = [...structuredColors];
                                                                            updated[idx].name = s.name;
                                                                            updated[idx].hex = s.hex;
                                                                            setStructuredColors(updated);
                                                                            setColorSuggestionIdx(null);
                                                                        }}
                                                                        className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-muted/60 transition-colors text-left"
                                                                    >
                                                                        <span
                                                                            className="w-5 h-5 rounded-full border border-border/60 shrink-0"
                                                                            style={{ backgroundColor: s.hex }}
                                                                        />
                                                                        <span className="text-xs font-medium text-foreground">{s.name}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        );
                                                    })()}
                                                </div>

                                                {/* Color picker swatch */}
                                                <div className="relative shrink-0">
                                                    <div
                                                        className="w-9 h-9 rounded-lg border-2 border-border cursor-pointer shadow-sm hover:scale-110 transition-transform"
                                                        style={{ backgroundColor: color.hex }}
                                                        title="Pick color"
                                                    />
                                                    <input
                                                        type="color"
                                                        value={color.hex}
                                                        onChange={e => {
                                                            const updated = [...structuredColors];
                                                            updated[idx].hex = e.target.value;
                                                            setStructuredColors(updated);
                                                        }}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                </div>

                                                {/* Stock input */}
                                                <input
                                                    type="number"
                                                    placeholder="Stock"
                                                    value={color.stock}
                                                    onChange={e => {
                                                        const updated = [...structuredColors];
                                                        updated[idx].stock = parseInt(e.target.value) || 0;
                                                        setStructuredColors(updated);
                                                    }}
                                                    className="w-20 h-9 px-3 bg-background border border-input rounded-lg text-xs shrink-0"
                                                />

                                                {/* Delete */}
                                                <button
                                                    type="button"
                                                    onClick={() => setStructuredColors(structuredColors.filter((_, i) => i !== idx))}
                                                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Row 2: Color photo upload */}
                                            <div className="flex items-center gap-3 pl-0.5">
                                                {color.image ? (
                                                    <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-border group">
                                                        <img src={color.image} className="w-full h-full object-cover" alt={color.name} />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const updated = [...structuredColors];
                                                                updated[idx].image = '';
                                                                setStructuredColors(updated);
                                                            }}
                                                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 text-white" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <label className="flex items-center gap-2 px-3 py-2 bg-background border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/40 transition-colors">
                                                        <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                                                        <span className="text-[11px] text-muted-foreground font-medium">Color Photo</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (!file) return;
                                                                try {
                                                                    const formData = new FormData();
                                                                    formData.append('file', file);
                                                                    const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                                                    const result = await res.json();
                                                                    if (result.success) {
                                                                        const updated = [...structuredColors];
                                                                        updated[idx].image = result.url;
                                                                        setStructuredColors(updated);
                                                                    }
                                                                } catch (err) {
                                                                    console.error('Color image upload failed:', err);
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                )}
                                                <span className="text-[10px] text-muted-foreground/60">Optional: upload a swatch or fabric photo for this color</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="border-t border-border pt-6 grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-medium text-muted-foreground">Fabric (কাপড়)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Cotton, Linen"
                                    value={fabric}
                                    onChange={e => setFabric(e.target.value)}
                                    className="w-full h-11 px-4 bg-background border border-input rounded-lg text-[13px] outline-none"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-medium text-muted-foreground">Care Instructions (যত্ন)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Hand wash, Machine wash"
                                    value={care}
                                    onChange={e => setCare(e.target.value)}
                                    className="w-full h-11 px-4 bg-background border border-input rounded-lg text-[13px] outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Settings & Photos */}
                <div className="space-y-6">
                    {/* Organization */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                            <Box className="w-4 h-4 text-primary" />
                            Organization
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-medium text-muted-foreground">Category</label>
                                <select 
                                    value={category} 
                                    onChange={e => setCategory(e.target.value)} 
                                    className="w-full h-10 px-3 bg-background border border-input rounded-lg text-[13px] outline-none"
                                >
                                    <option value="">Select Category</option>
                                    {getFormattedCategories().map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-medium text-muted-foreground">Status</label>
                                <select 
                                    value={isActive ? "active" : "draft"} 
                                    onChange={e => setIsActive(e.target.value === "active")} 
                                    className={`w-full h-10 px-3 bg-background border border-input rounded-lg text-[13px] outline-none font-semibold ${isActive ? "text-emerald-600" : "text-amber-600"}`}
                                >
                                    <option value="active" className="text-emerald-600">Active (Visible)</option>
                                    <option value="draft" className="text-amber-600">Draft (Hidden)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Flags */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                            <Tag className="w-4 h-4 text-primary" />
                            Product Badges
                        </h2>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg cursor-pointer">
                                <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-4 h-4 rounded text-primary focus:ring-primary" />
                                <span className="text-[13px] font-medium text-foreground">Featured (Exclusive)</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg cursor-pointer">
                                <input type="checkbox" checked={isSale} onChange={e => setIsSale(e.target.checked)} className="w-4 h-4 rounded text-primary focus:ring-primary" />
                                <span className="text-[13px] font-medium text-foreground">On Sale</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg cursor-pointer">
                                <input type="checkbox" checked={isHot} onChange={e => setIsHot(e.target.checked)} className="w-4 h-4 rounded text-primary focus:ring-primary" />
                                <span className="text-[13px] font-medium text-foreground">Hot Item</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg cursor-pointer">
                                <input type="checkbox" checked={isNew} onChange={e => setIsNew(e.target.checked)} className="w-4 h-4 rounded text-primary focus:ring-primary" />
                                <span className="text-[13px] font-medium text-foreground">New Arrival</span>
                            </label>
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
