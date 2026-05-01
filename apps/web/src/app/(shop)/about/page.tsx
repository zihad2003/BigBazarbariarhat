'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
    return (
        <main className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-gray-50 text-center">
            <div className="max-w-xl space-y-6 bg-white p-12 shadow-sm border border-gray-100">
                <h1 className="text-4xl font-playfair font-black text-foreground uppercase tracking-widest">
                    About
                </h1>
                <div className="h-1 w-16 bg-destructive mx-auto" />
                <p className="text-muted-foreground leading-relaxed">
                    This page is currently under development. The full about content and functionality will be available in a future update.
                </p>
                <div className="pt-8">
                    <Link href="/">
                        <Button className="bg-foreground text-white hover:bg-destructive uppercase tracking-widest font-bold px-8">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Shop
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}