'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Save,
    Image as ImageIcon,
    Plus,
    Trash2,
    Check,
    Loader2,
    Eye,
    Tag,
    DollarSign,
    Box,
    Layers,
    Search as SearchIcon,
    AlertCircle,
    Sparkles,
    GripVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const productSchema = z.object({
    name: z.string().min(3, 'Portfolio name must be at least 3 characters'),
    slug: z.string().min(3, 'URI Slug is required'),
    shortDescription: z.string().optional(),
    description: z.string().optional(),
    categoryId: z.string().min(1, 'Classification category is required'),
    brandId: z.string().optional(),
    sku: z.string().min(1, 'Identification SKU is required'),
    barcode: z.string().optional(),
    basePrice: z.string().refine((val) => !isNaN(Number(val)), 'Valuation must be a numeric value'),
    salePrice: z.string().optional(),
    costPrice: z.string().optional(),
    stockQuantity: z.string().refine((val) => !isNaN(Number(val)), 'Volume must be numeric'),
    lowStockThreshold: z.string().optional(),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    isNewArrival: z.boolean().default(true),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewProductPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('basic');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [variants, setVariants] = useState<any[]>([]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            isActive: true,
            isFeatured: false,
            isNewArrival: true,
            stockQuantity: '0',
            lowStockThreshold: '10',
        }
    });

    const watchName = watch('name');

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [catsRes, brandsRes] = await Promise.all([
                    fetch('/api/categories'),
                    fetch('/api/brands')
                ]);
                const catsData = await catsRes.json();
                const brandsData = await brandsRes.json();
                if (catsData.success) setCategories(catsData.data);
                if (brandsData.success) setBrands(brandsData.data);
            } catch (error) {
                console.error('Failed to load metadata:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMeta();
    }, []);

    const onProductSubmit = async (data: ProductFormValues) => {
        setSaving(true);
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (result.success) {
                router.push('/products');
            }
        } catch (error) {
            console.error('Submission failed:', error);
        } finally {
            setSaving(false);
        }
    };

    const generateSlug = () => {
        if (!watchName) return;
        const slug = watchName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        setValue('slug', slug);
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <Loader2 className="h-16 w-16 animate-spin text-indigo-600" />
                <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">Preparing Workspace...</p>
            </div>
        );
    }



    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const tabs = [
        { id: 'basic', label: 'Identity', icon: Tag },
        { id: 'pricing', label: 'Valuation', icon: DollarSign },
        { id: 'stock', label: 'Volume', icon: Box },
        { id: 'media', label: 'Visuals', icon: ImageIcon },
        { id: 'variants', label: 'Variants', icon: Layers },
        { id: 'seo', label: 'SEO Metadata', icon: SearchIcon },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            {/* Navigation Header */}
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
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">New Masterpiece</h1>
                            <Sparkles className="h-6 w-6 text-indigo-600" />
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Curation Pipeline: <span className="text-gray-900">{watchName || 'Awaiting Input'}</span></p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => router.back()} className="h-14 px-8 border-2 rounded-2xl text-xs font-black uppercase tracking-widest">
                        Discard
                    </Button>
                    <Button
                        onClick={handleSubmit(onProductSubmit)}
                        disabled={saving}
                        className="h-14 px-10 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest gap-3 shadow-2xl shadow-black/10 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        {saving ? 'Archiving...' : 'Publish Masterpiece'}
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-16">
                {/* Sidemenu Tabs */}
                <aside className="lg:w-64 shrink-0">
                    <nav className="flex lg:flex-col gap-2 p-2 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 sticky top-10">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-4 px-6 py-4 rounded-3xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                    ? 'bg-white text-indigo-600 shadow-xl shadow-indigo-500/10 border border-gray-100 scale-105'
                                    : 'text-gray-400 hover:text-gray-900 hover:bg-white/50'
                                    }`}
                            >
                                <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-indigo-600' : ''}`} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Form Content */}
                <form className="flex-1 space-y-10">
                    {activeTab === 'basic' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <section className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-bl-[10rem] opacity-30" />
                                <h3 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-6 uppercase tracking-widest flex items-center gap-3">
                                    <Tag className="h-5 w-5 text-indigo-600" />
                                    Identity Profile
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Portfolio Name</label>
                                        <input
                                            {...register('name')}
                                            onBlur={generateSlug}
                                            className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                            placeholder="e.g. Premium Silk Panjabi"
                                        />
                                        {errors.name && <p className="text-rose-500 text-xs font-bold uppercase tracking-widest ml-4">{errors.name.message}</p>}
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">URI Slug Integration</label>
                                        <input
                                            {...register('slug')}
                                            className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                            placeholder="premium-silk-panjabi"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Primary Classification</label>
                                        <select
                                            {...register('categoryId')}
                                            className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none appearance-none"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Artisan Entity (Brand)</label>
                                        <select
                                            {...register('brandId')}
                                            className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none appearance-none"
                                        >
                                            <option value="">Big Bazar Originals</option>
                                            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm">
                                <h3 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-6 uppercase tracking-widest flex items-center gap-3">
                                    <SearchIcon className="h-5 w-5 text-indigo-600" />
                                    Narrative Context
                                </h3>

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center ml-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Abridged Narrative</label>
                                            <div className="flex gap-2">
                                                <button type="button" className="p-1 hover:bg-gray-100 rounded text-[10px] font-bold uppercase">B</button>
                                                <button type="button" className="p-1 hover:bg-gray-100 rounded text-[10px] font-bold uppercase italic">I</button>
                                            </div>
                                        </div>
                                        <textarea
                                            {...register('shortDescription')}
                                            rows={2}
                                            className="w-full p-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none resize-none"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center ml-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Comprehensive Narrative</label>
                                            <div className="flex gap-2">
                                                <button type="button" className="p-1 hover:bg-gray-100 rounded text-[10px] font-bold uppercase">B</button>
                                                <button type="button" className="p-1 hover:bg-gray-100 rounded text-[10px] font-bold uppercase italic">I</button>
                                                <button type="button" className="p-1 hover:bg-gray-100 rounded text-[10px] font-bold uppercase">List</button>
                                            </div>
                                        </div>
                                        <textarea
                                            {...register('description')}
                                            rows={8}
                                            className="w-full p-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none resize-none"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'pricing' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <section className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-bl-[10rem] opacity-30" />
                                <h3 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-6 uppercase tracking-widest flex items-center gap-3">
                                    <DollarSign className="h-5 w-5 text-emerald-600" />
                                    Financial Valuation
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Market Valuation (Base Price)</label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-400">৳</span>
                                            <input
                                                {...register('basePrice')}
                                                className="w-full h-16 pl-12 pr-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-black text-gray-900 focus:bg-white focus:border-emerald-600 transition-all outline-none"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Offer Incentive (Sale Price)</label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-400">৳</span>
                                            <input
                                                {...register('salePrice')}
                                                className="w-full h-16 pl-12 pr-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-black text-gray-900 focus:bg-white focus:border-amber-600 transition-all outline-none"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Acquisition Overheads (Cost)</label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-400">৳</span>
                                            <input
                                                {...register('costPrice')}
                                                className="w-full h-16 pl-12 pr-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-black text-gray-900 focus:bg-white focus:border-gray-900 transition-all outline-none"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'stock' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <section className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm">
                                <h3 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-6 uppercase tracking-widest flex items-center gap-3">
                                    <Box className="h-5 w-5 text-indigo-600" />
                                    Logistics Meta
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Identification SKU</label>
                                        <input
                                            {...register('sku')}
                                            className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-black text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                            placeholder="TR-001-BLACK"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Authentication Barcode</label>
                                        <input
                                            {...register('barcode')}
                                            className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                            placeholder="12345678"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-10 bg-gray-50/50 rounded-[2.5rem] border border-gray-50">
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Initial Inventory</h4>
                                        <div className="flex items-center gap-6">
                                            <div className="flex-1 space-y-4">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Operational Volume</label>
                                                <input
                                                    {...register('stockQuantity')}
                                                    type="number"
                                                    className="w-full h-14 px-6 bg-white border border-gray-100 rounded-[1.25rem] font-black text-2xl text-gray-900 focus:border-indigo-600 outline-none"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Alert Threshold</label>
                                                <input
                                                    {...register('lowStockThreshold')}
                                                    type="number"
                                                    className="w-full h-14 px-6 bg-white border border-gray-100 rounded-[1.25rem] font-black text-2xl text-amber-600 focus:border-amber-600 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'media' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <section className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden">
                                <h3 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-6 uppercase tracking-widest flex items-center gap-3">
                                    <ImageIcon className="h-5 w-5 text-indigo-600" />
                                    Visual Portfolio
                                </h3>

                                <div className="text-center py-20 px-10 border-4 border-dashed border-gray-50 rounded-[3rem] bg-gray-50/30">
                                    {imagePreview ? (
                                        <div className="relative w-64 h-64 mx-auto mb-6 rounded-3xl overflow-hidden shadow-2xl">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setImagePreview(null)}
                                                className="absolute top-4 right-4 p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/5 group cursor-pointer hover:scale-110 transition-transform">
                                            <ImageIcon className="h-10 w-10 text-gray-300 group-hover:text-indigo-600 transition-colors" />
                                        </div>
                                    )}
                                    <h4 className="text-2xl font-black text-gray-900 mb-2">Manifest Visuals</h4>
                                    <p className="text-gray-400 font-medium mb-10 max-w-xs mx-auto">Upload high-resolution artifacts. The primary image will be used for catalog manifestation.</p>
                                    <div className="relative inline-block">
                                        <Button type="button" className="h-14 px-10 border-2 border-black bg-transparent text-black hover:bg-black hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                                            {imagePreview ? 'Replace Asset' : 'Upload Assets'}
                                        </Button>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'variants' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <section className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm">
                                <div className="flex justify-between items-center mb-10 border-b border-gray-50 pb-6">
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                                        <Layers className="h-5 w-5 text-indigo-600" />
                                        Configuration Matrix
                                    </h3>
                                    <Button
                                        type="button"
                                        onClick={() => setVariants([...variants, { id: Date.now().toString(), size: '', color: '', sku: '', stockQuantity: 0, priceAdjustment: 0 }])}
                                        className="bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest h-10 px-6"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Inject Variant
                                    </Button>
                                </div>

                                {variants.length === 0 ? (
                                    <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                            <Layers className="h-8 w-8 text-gray-200" />
                                        </div>
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No variants manifest found.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {variants.map((v, idx) => (
                                            <div key={v.id} className="flex items-center gap-4 p-6 bg-gray-50/50 rounded-2xl border border-gray-50 group hover:bg-white hover:border-indigo-100 transition-all">
                                                <GripVertical className="h-5 w-5 text-gray-300" />
                                                <div className="flex-1 grid grid-cols-5 gap-4">
                                                    <input
                                                        placeholder="Size"
                                                        aria-label="Variant Size"
                                                        className="h-12 px-4 bg-white border border-gray-100 rounded-xl text-xs font-bold"
                                                        value={v.size}
                                                        onChange={(e) => {
                                                            const newV = [...variants];
                                                            newV[idx].size = e.target.value;
                                                            setVariants(newV);
                                                        }}
                                                    />
                                                    <input
                                                        placeholder="Color"
                                                        aria-label="Variant Color"
                                                        className="h-12 px-4 bg-white border border-gray-100 rounded-xl text-xs font-bold"
                                                        value={v.color}
                                                        onChange={(e) => {
                                                            const newV = [...variants];
                                                            newV[idx].color = e.target.value;
                                                            setVariants(newV);
                                                        }}
                                                    />
                                                    <input
                                                        placeholder="SKU"
                                                        aria-label="Variant SKU"
                                                        className="h-12 px-4 bg-white border border-gray-100 rounded-xl text-xs font-bold"
                                                        value={v.sku}
                                                        onChange={(e) => {
                                                            const newV = [...variants];
                                                            newV[idx].sku = e.target.value;
                                                            setVariants(newV);
                                                        }}
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Stock"
                                                        aria-label="Variant Stock Quantity"
                                                        className="h-12 px-4 bg-white border border-gray-100 rounded-xl text-xs font-bold"
                                                        value={v.stockQuantity}
                                                        onChange={(e) => {
                                                            const newV = [...variants];
                                                            newV[idx].stockQuantity = parseInt(e.target.value);
                                                            setVariants(newV);
                                                        }}
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Price +/-"
                                                        aria-label="Variant Price Adjustment"
                                                        className="h-12 px-4 bg-white border border-gray-100 rounded-xl text-xs font-bold"
                                                        value={v.priceAdjustment}
                                                        onChange={(e) => {
                                                            const newV = [...variants];
                                                            newV[idx].priceAdjustment = parseFloat(e.target.value);
                                                            setVariants(newV);
                                                        }}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setVariants(variants.filter((_, i) => i !== idx))}
                                                    className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>
                    )}

                    {activeTab === 'seo' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <section className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-50 rounded-bl-[10rem] opacity-30" />
                                <h3 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-6 uppercase tracking-widest flex items-center gap-3">
                                    <SearchIcon className="h-5 w-5 text-indigo-600" />
                                    Search Engine Optimization
                                </h3>

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Meta Title</label>
                                        <input
                                            {...register('metaTitle')}
                                            className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                            placeholder="SEO Title"
                                        />
                                        <p className="text-[10px] text-gray-400 ml-4">Recommended length: 50-60 characters</p>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Meta Description</label>
                                        <textarea
                                            {...register('metaDescription')}
                                            rows={4}
                                            className="w-full p-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none resize-none"
                                            placeholder="SEO Description"
                                        />
                                        <p className="text-[10px] text-gray-400 ml-4">Recommended length: 150-160 characters</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
