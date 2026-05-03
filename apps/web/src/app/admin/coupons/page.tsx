'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminCouponsRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Redirecting to the marketing matrix for coupon authorization
        router.replace('/admin/marketing/coupons');
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                Authorizing Marketing Matrix...
            </p>
        </div>
    );
}
