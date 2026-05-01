import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
    return (
        <div className="group relative bg-white p-4 rounded-[2.5rem] border border-gray-100 h-full flex flex-col">
            {/* Visual Module Skeleton */}
            <div className="relative aspect-[3/4] w-full bg-gray-50 rounded-[2rem] overflow-hidden mb-6">
                <Skeleton className="absolute inset-0 w-full h-full" />
                {/* Badge Skeleton */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <Skeleton className="h-6 w-16 rounded-lg" />
                </div>
            </div>

            {/* Information Module Skeleton */}
            <div className="px-2 space-y-3 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-3 w-20 rounded-full" />
                    <Skeleton className="h-3 w-10 rounded-full" />
                </div>

                <div className="space-y-2 mb-4">
                    <Skeleton className="h-6 w-full rounded-lg" />
                    <Skeleton className="h-6 w-2/3 rounded-lg" />
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-24 rounded-lg" />
                    </div>
                </div>
            </div>

            {/* Button Skeleton */}
            <div className="mt-6">
                <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
        </div>
    )
}
