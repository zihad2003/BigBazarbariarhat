import { Product } from '@bigbazar/shared'
import { ProductCard } from './product-card'
import { ProductCardSkeleton } from './product-card-skeleton'
import { cn } from '@/lib/utils'

interface ProductGridProps {
    products: Product[]
    isLoading?: boolean
    viewMode?: 'grid' | 'list'
}

export function ProductGrid({ products, isLoading, viewMode = 'grid' }: ProductGridProps) {
    if (isLoading) {
        return (
            <div className={cn(
                "grid gap-6 animate-pulse",
                viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
            )}>
                {[...Array(8)].map((_, i) => (
                    // We can adjust skeleton height/layout based on viewMode if needed
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        )
    }

    if (!products.length) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem]">
                <p className="text-gray-500 text-lg font-medium">No products match your refined criteria.</p>
            </div>
        )
    }

    return (
        <div className={cn(
            "grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700",
            viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        )}>
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    layout={viewMode}
                />
            ))}
        </div>
    )
}
