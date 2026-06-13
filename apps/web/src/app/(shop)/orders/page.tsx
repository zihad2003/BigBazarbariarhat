'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function OrdersRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Redirecting to the centralized account orders protocol
        router.replace('/account/orders');
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-900 mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
                Redirecting to your orders...
            </p>
        </div>
    );
}
