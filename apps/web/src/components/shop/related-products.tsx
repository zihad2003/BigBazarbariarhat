import type { Product } from "@bigbazar/shared"
import { ProductGrid } from "./product-grid"

interface RelatedProductsProps {
    products: Product[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
    if (!products || products.length === 0) return null

    return (
        <section className="pt-8">
            <ProductGrid products={products} />
        </section>
    )
}
