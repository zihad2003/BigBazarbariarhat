'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function ShopLoading() {
    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 lg:py-20">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
                    <div className="space-y-6">
                        <Skeleton className="h-4 w-32 bg-gray-100 rounded-full" />
                        <Skeleton className="h-16 w-80 bg-gray-100 rounded-2xl" />
                    </div>
                    <Skeleton className="h-14 w-full md:w-96 bg-gray-100 rounded-2xl" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Sidebar Skeleton */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-12">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-6">
                                <Skeleton className="h-6 w-32 bg-gray-100 rounded-full" />
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map((j) => (
                                        <Skeleton key={j} className="h-8 w-full bg-gray-100 rounded-xl" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </aside>

                    {/* Grid Skeleton */}
                    <div className="lg:col-span-9">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="space-y-6">
                                    <Skeleton className="aspect-[3/4] w-full bg-gray-100 rounded-[2.5rem]" />
                                    <div className="space-y-3">
                                        <Skeleton className="h-4 w-2/3 bg-gray-100 rounded-full" />
                                        <Skeleton className="h-6 w-1/3 bg-gray-100 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
