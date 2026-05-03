'use client';

import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import ProductForm from '../product-form';

export default function NewProductPage() {
    return (
        <div className="space-y-10">
            {/* Breadcrumbs & Title */}
            <div className="flex flex-col gap-4">
                <Link href="/admin/products" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Collection
                </Link>
                <div className="flex items-center gap-4">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Manifest New Artifact</h1>
                    <div className="h-px flex-1 bg-slate-100" />
                </div>
            </div>

            <ProductForm />
        </div>
    );
}
