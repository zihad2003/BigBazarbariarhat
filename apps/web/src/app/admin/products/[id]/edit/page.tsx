'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import ProductForm from '../../product-form';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('admin-products') || '[]');
        const found = saved.find((p: any) => p.id === id);
        if (found) {
            setProduct(found);
        }
        setIsLoading(false);
    }, [id]);

    if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-indigo-600" /></div>;

    if (!product) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-black uppercase">Artifact Not Found</h2>
            <Link href="/admin/products" className="text-indigo-600 font-bold hover:underline mt-4 inline-block">Return to Collection</Link>
        </div>
    );

    return (
        <div className="space-y-10">
            <div className="flex flex-col gap-4">
                <Link href="/admin/products" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Collection
                </Link>
                <div className="flex items-center gap-4">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Modify Artifact Manifest</h1>
                    <div className="h-px flex-1 bg-slate-100" />
                    <span className="text-xs font-mono font-black text-slate-300">ID: {product.id}</span>
                </div>
            </div>

            <ProductForm initialData={product} isEdit={true} />
        </div>
    );
}
