import type { Product } from "@bigbazar/shared"
import { ProductCard } from "./product-card"

interface RelatedProductsProps {
    products: Product[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
    if (!products || products.length === 0) return null

    return (
        <section className="pt-8">
            <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 no-scrollbar pb-8 -mx-6 px-6 md:mx-0 md:px-0">
                {products.map((product) => (
                    <div key={product.id} className="min-w-[280px] md:min-w-0">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    )
}
