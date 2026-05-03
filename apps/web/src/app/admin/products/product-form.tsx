'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { 
    Save, 
    X, 
    Upload, 
    Plus, 
    Trash2, 
    Info, 
    DollarSign, 
    Package, 
    Truck, 
    Search, 
    ChevronDown, 
    ChevronUp,
    Image as ImageIcon,
    LayoutGrid,
    MoveHorizontal,
    MoreHorizontal,
    Globe,
    CheckCircle2,
    Eye,
    Zap,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Import React Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface ProductFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit }: ProductFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('basic');

    // Form State
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        category: initialData?.category || 'Electronics',
        brand: initialData?.brand || '',
        tags: initialData?.tags || [],
        shortDescription: initialData?.shortDescription || '',
        fullDescription: initialData?.fullDescription || '',
        images: initialData?.images || [],
        regularPrice: initialData?.basePrice || '',
        salePrice: initialData?.salePrice || '',
        costPrice: initialData?.costPrice || '',
        taxClass: initialData?.taxClass || 'Standard',
        sku: initialData?.sku || '',
        stock: initialData?.stock || 0,
        lowStockThreshold: initialData?.lowStockThreshold || 5,
        backorders: initialData?.backorders || 'no',
        inStock: initialData?.inStock !== false,
        variantsEnabled: initialData?.variantsEnabled || false,
        variants: initialData?.variants || [],
        weight: initialData?.weight || '',
        dimensions: initialData?.dimensions || { l: '', w: '', h: '' },
        seo: initialData?.seo || { title: '', description: '', keyword: '' }
    });

    // Auto-generate slug
    useEffect(() => {
        if (!isEdit && formData.name) {
            const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.name, isEdit]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (parent: string, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [parent]: { ...prev[parent as keyof typeof prev] as any, [field]: value }
        }));
    };

    const handleSave = async (status: 'draft' | 'published') => {
        setIsLoading(true);
        try {
            // Mock Save Logic
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const savedProducts = JSON.parse(localStorage.getItem('admin-products') || '[]');
            const newProduct = {
                ...formData,
                id: initialData?.id || `ART-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                status: status,
                updatedAt: new Date().toISOString()
            };

            let updatedList;
            if (isEdit) {
                updatedList = savedProducts.map((p: any) => p.id === initialData.id ? newProduct : p);
            } else {
                updatedList = [newProduct, ...savedProducts];
            }

            localStorage.setItem('admin-products', JSON.stringify(updatedList));
            router.push('/admin/products');
        } catch (error) {
            console.error('Save failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    const sections = [
        { id: 'basic', label: 'Basic Info', icon: Info },
        { id: 'media', label: 'Media Hub', icon: ImageIcon },
        { id: 'pricing', label: 'Pricing Protocol', icon: DollarSign },
        { id: 'inventory', label: 'Inventory Matrix', icon: Package },
        { id: 'variants', label: 'Variant Matrix', icon: LayoutGrid },
        { id: 'shipping', label: 'Logistics', icon: Truck },
        { id: 'seo', label: 'Global SEO', icon: Globe },
    ];

    return (
        <div className="flex flex-col xl:flex-row gap-12">
            
            {/* Sidebar Navigation */}
            <aside className="xl:w-80 shrink-0">
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 sticky top-28 shadow-sm">
                    <div className="space-y-2">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={cn(
                                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                                    activeSection === section.id 
                                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                                        : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <section.icon className="h-5 w-5" />
                                    <span className="text-[11px] font-black uppercase tracking-widest">{section.label}</span>
                                </div>
                                <ChevronDown className={cn("h-4 w-4 transition-transform", activeSection === section.id ? "rotate-180" : "-rotate-90")} />
                            </button>
                        ))}
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-50 space-y-4">
                        <Button 
                            onClick={() => handleSave('published')}
                            disabled={isLoading}
                            className="w-full h-16 bg-black text-white hover:bg-slate-800 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-black/20 gap-3"
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />} 
                            Publish Artifact
                        </Button>
                        <Button 
                            onClick={() => handleSave('draft')}
                            variant="outline" 
                            className="w-full h-16 rounded-2xl border-slate-200 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-black"
                        >
                            Save as Draft
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Form Content */}
            <main className="flex-1 space-y-12 pb-24">
                
                {/* Section 1: Basic Info */}
                <section id="basic" className="bg-white rounded-[3rem] p-10 lg:p-12 border border-slate-200 shadow-sm scroll-mt-32">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                            <Info className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Basic Identification</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3 md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Artifact Designation *</label>
                            <input 
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-sm font-black"
                                placeholder="EX: HANDCRAFTED TERRACOTTA VASE"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">URL Manifest (Slug)</label>
                            <input 
                                value={formData.slug}
                                onChange={(e) => handleChange('slug', e.target.value)}
                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-sm font-black"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Logistics Sector (Category) *</label>
                            <select 
                                value={formData.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-sm font-black appearance-none"
                            >
                                <option>Electronics</option>
                                <option>Clothing</option>
                                <option>Home & Living</option>
                                <option>Food & Grocery</option>
                            </select>
                        </div>
                        <div className="space-y-3 md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Brief Manifest (Short Description)</label>
                            <textarea 
                                value={formData.shortDescription}
                                onChange={(e) => handleChange('shortDescription', e.target.value)}
                                rows={3}
                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-sm font-black resize-none"
                            />
                        </div>
                        <div className="space-y-3 md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Detailed Manifest (Full Description)</label>
                            <div className="rounded-[1.5rem] overflow-hidden border border-slate-100 bg-slate-50">
                                <ReactQuill 
                                    theme="snow"
                                    value={formData.fullDescription}
                                    onChange={(val) => handleChange('fullDescription', val)}
                                    className="min-h-[300px]"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: Media Hub */}
                <section id="media" className="bg-white rounded-[3rem] p-10 lg:p-12 border border-slate-200 shadow-sm scroll-mt-32">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                            <ImageIcon className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Visual Repository</h2>
                    </div>

                    <div className="space-y-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6">
                            {formData.images.map((img: any, idx: number) => (
                                <div key={idx} className="relative aspect-[3/4] rounded-2xl overflow-hidden group border border-slate-100">
                                    <Image src={typeof img === 'string' ? img : img.url} alt="" fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                                        <button className="p-2 bg-white rounded-lg text-slate-900"><MoreHorizontal className="h-4 w-4" /></button>
                                        <button className="p-2 bg-rose-500 rounded-lg text-white"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                    {idx === 0 && <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Primary</span>}
                                </div>
                            ))}
                            <button className="aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 hover:bg-slate-50 transition-all text-slate-400 hover:text-indigo-600 hover:border-indigo-200">
                                <Upload className="h-8 w-8" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Upload Signal</span>
                            </button>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center gap-4">
                            <Info className="h-5 w-5 text-indigo-500" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Drag artifacts to redefine visual hierarchy. First signal will be the primary identification.</p>
                        </div>
                    </div>
                </section>

                {/* Section 3: Pricing Protocol */}
                <section id="pricing" className="bg-white rounded-[3rem] p-10 lg:p-12 border border-slate-200 shadow-sm scroll-mt-32">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Pricing Protocol</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Regular Value *</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">৳</span>
                                <input 
                                    type="number"
                                    value={formData.regularPrice}
                                    onChange={(e) => handleChange('regularPrice', e.target.value)}
                                    className="w-full pl-12 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-sm font-black font-mono"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Sale Manifest Value</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">৳</span>
                                <input 
                                    type="number"
                                    value={formData.salePrice}
                                    onChange={(e) => handleChange('salePrice', e.target.value)}
                                    className="w-full pl-12 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-sm font-black font-mono"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Acquisition Cost</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">৳</span>
                                <input 
                                    type="number"
                                    value={formData.costPrice}
                                    onChange={(e) => handleChange('costPrice', e.target.value)}
                                    className="w-full pl-12 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-sm font-black font-mono"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 4: Inventory Matrix */}
                <section id="inventory" className="bg-white rounded-[3rem] p-10 lg:p-12 border border-slate-200 shadow-sm scroll-mt-32">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                            <Package className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Inventory Matrix</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Unique SKU (Identifier)</label>
                            <input 
                                value={formData.sku}
                                onChange={(e) => handleChange('sku', e.target.value)}
                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-sm font-black font-mono"
                                placeholder="ORD-XXXX-XXXX"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Volume Status (Stock)</label>
                            <input 
                                type="number"
                                value={formData.stock}
                                onChange={(e) => handleChange('stock', parseInt(e.target.value))}
                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-sm font-black font-mono"
                            />
                        </div>
                    </div>
                </section>

                {/* Section 5: Variants */}
                <section id="variants" className="bg-white rounded-[3rem] p-10 lg:p-12 border border-slate-200 shadow-sm scroll-mt-32">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                <LayoutGrid className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Configuration Matrix</h2>
                        </div>
                        <label className="flex items-center gap-4 cursor-pointer">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enable Matrix</span>
                            <div className="relative">
                                <input 
                                    type="checkbox" 
                                    checked={formData.variantsEnabled}
                                    onChange={(e) => handleChange('variantsEnabled', e.target.checked)}
                                    className="peer hidden" 
                                />
                                <div className="w-14 h-8 bg-slate-100 rounded-full peer-checked:bg-indigo-600 transition-all shadow-inner" />
                                <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all peer-checked:left-7 shadow-lg" />
                            </div>
                        </label>
                    </div>

                    {formData.variantsEnabled ? (
                        <div className="space-y-8">
                            <Button variant="outline" className="h-14 px-8 rounded-2xl border-slate-100 text-[10px] font-black uppercase tracking-widest gap-3">
                                <Plus className="h-4 w-4" /> Add Configuration Type
                            </Button>
                            <div className="p-10 border border-slate-100 rounded-[2.5rem] bg-slate-50/50 text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No configurations active. Define Size or Color to initiate matrix.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center gap-6">
                            <AlertCircle className="h-8 w-8 text-slate-300" />
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Matrix configurations are currently inactive. This artifact will manifest as a single standard unit.</p>
                        </div>
                    )}
                </section>

                {/* Section 6: Shipping */}
                <section id="shipping" className="bg-white rounded-[3rem] p-10 lg:p-12 border border-slate-200 shadow-sm scroll-mt-32">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                            <Truck className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Logistics Specification</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Mass (KG)</label>
                            <input value={formData.weight} onChange={(e) => handleChange('weight', e.target.value)} className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white transition-all text-sm font-black font-mono" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Length (CM)</label>
                            <input value={formData.dimensions.l} onChange={(e) => handleNestedChange('dimensions', 'l', e.target.value)} className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white transition-all text-sm font-black font-mono" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Width (CM)</label>
                            <input value={formData.dimensions.w} onChange={(e) => handleNestedChange('dimensions', 'w', e.target.value)} className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white transition-all text-sm font-black font-mono" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Height (CM)</label>
                            <input value={formData.dimensions.h} onChange={(e) => handleNestedChange('dimensions', 'h', e.target.value)} className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white transition-all text-sm font-black font-mono" />
                        </div>
                    </div>
                </section>

                {/* Section 7: SEO */}
                <section id="seo" className="bg-white rounded-[3rem] p-10 lg:p-12 border border-slate-200 shadow-sm scroll-mt-32">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                            <Globe className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Global Search Matrix</h2>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Meta Identification (Title)</label>
                            <input value={formData.seo.title} onChange={(e) => handleNestedChange('seo', 'title', e.target.value)} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white transition-all text-sm font-black" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Meta Manifest (Description)</label>
                            <textarea value={formData.seo.description} onChange={(e) => handleNestedChange('seo', 'description', e.target.value)} rows={3} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:bg-white transition-all text-sm font-black resize-none" />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

// Utility Loader
function Loader2({ className }: { className?: string }) {
    return <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><RefreshCcw className={className} /></motion.div>;
}
import { RefreshCcw } from 'lucide-react';
