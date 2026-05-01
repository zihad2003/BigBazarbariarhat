'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Save,
    Image as ImageIcon,
    Loader2,
    Sparkles,
    LayoutGrid,
    Type
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const categorySchema = z.object({
    name: z.string().min(3, 'Collection name must be at least 3 characters'),
    slug: z.string().min(3, 'URI Slug is required'),
    description: z.string().optional(),
    displayOrder: z.string().refine((val) => !isNaN(Number(val)), 'Sequence must be numeric'),
    isActive: z.boolean().default(true),
    // parentId: z.string().optional(), // Future implementation
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function NewCategoryPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            isActive: true,
            displayOrder: '0',
        }
    });

    const watchName = watch('name');

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

    const onCategorySubmit = async (data: CategoryFormValues) => {
        setSaving(true);
        try {
            // Include simulated image in payload if needed by backend, or mock it
            const payload = { ...data, image: imagePreview };

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

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
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
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">New Collection</h1>
                            <Sparkles className="h-6 w-6 text-indigo-600" />
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Taxonomy Node: <span className="text-gray-900">{watchName || 'Awaiting Input'}</span></p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => router.back()} className="h-14 px-8 border-2 rounded-2xl text-xs font-black uppercase tracking-widest">
                        Discard
                    </Button>
                    <Button
                        onClick={handleSubmit(onCategorySubmit)}
                        disabled={saving}
                        className="h-14 px-10 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest gap-3 shadow-2xl shadow-black/10 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        {saving ? 'Manifesting...' : 'Publish Collection'}
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-10">
                {/* Main Form Content */}
                <form className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <section className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-bl-[10rem] opacity-30" />
                        <h3 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-6 uppercase tracking-widest flex items-center gap-3">
                            <LayoutGrid className="h-5 w-5 text-indigo-600" />
                            Collection Profile
                        </h3>

                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Collection Name</label>
                                    <input
                                        {...register('name')}
                                        onBlur={generateSlug}
                                        className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                        placeholder="e.g. Urban Streetwear"
                                    />
                                    {errors.name && <p className="text-rose-500 text-xs font-bold uppercase tracking-widest ml-4">{errors.name.message}</p>}
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">URI Slug</label>
                                    <input
                                        {...register('slug')}
                                        className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                        placeholder="urban-streetwear"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center ml-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Narrative Description</label>
                                    <div className="flex gap-2">
                                        <button type="button" className="p-1 hover:bg-gray-100 rounded text-[10px] font-bold uppercase">B</button>
                                        <button type="button" className="p-1 hover:bg-gray-100 rounded text-[10px] font-bold uppercase italic">I</button>
                                    </div>
                                </div>
                                <textarea
                                    {...register('description')}
                                    rows={4}
                                    className="w-full p-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Display Sequence</label>
                                    <input
                                        {...register('displayOrder')}
                                        type="number"
                                        className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="space-y-4 flex flex-col justify-center">
                                    <label className="flex items-center gap-4 p-4 bg-gray-50 rounded-[1.5rem] cursor-pointer hover:bg-gray-100 transition-all">
                                        <input
                                            type="checkbox"
                                            {...register('isActive')}
                                            className="w-6 h-6 rounded-lg accent-indigo-600"
                                        />
                                        <div>
                                            <div className="text-sm font-black text-gray-900 uppercase tracking-widest">Active Status</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Visible in storefront</div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden">
                        <h3 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-6 uppercase tracking-widest flex items-center gap-3">
                            <ImageIcon className="h-5 w-5 text-indigo-600" />
                            Visual Identity
                        </h3>

                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="relative w-full md:w-64 aspect-square bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center group hover:border-indigo-200 transition-all">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-6">
                                        <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4 group-hover:text-indigo-400 transition-colors" />
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest group-hover:text-indigo-400">Cover Image</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    aria-label="Upload category image"
                                />
                            </div>
                            <div className="flex-1 space-y-4">
                                <h4 className="text-lg font-black text-gray-900">Collection Aesthetic</h4>
                                <p className="text-gray-400 font-medium leading-relaxed max-w-md">
                                    Upload a high-fidelity visual to represent this collection. This asset will be utilized in catalog headers and promotional cards.
                                </p>
                                <Button type="button" className="pointer-events-none bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest h-12 px-6">
                                    Recommended: 1200x600px
                                </Button>
                            </div>
                        </div>
                    </section>
                </form>
            </div>
        </div>
    );
}
