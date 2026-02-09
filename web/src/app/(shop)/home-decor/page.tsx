import { ProductGrid } from '@/components/shop/product-grid'

const homeDecorProducts = [
    { id: '1', name: 'Premium Cushion', price: 599, image: '/products/cushion-1.jpg', category: 'home-decor' },
    { id: '2', name: 'Decorative Vase', price: 899, image: '/products/vase-1.jpg', category: 'home-decor' },
    { id: '3', name: 'Wall Art', price: 1299, image: '/products/art-1.jpg', category: 'home-decor' },
    { id: '4', name: 'Table Lamp', price: 1599, image: '/products/lamp-1.jpg', category: 'home-decor' },
]

export default function HomeDecorPage() {
    return (
        <>
            {/* Page Header */}
            <section className="py-16 px-6 lg:px-8 bg-gray-50 text-center">
                <h1 className="text-4xl font-bold uppercase mb-4">Home Decor</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Elevate your living space with premium decor
                </p>
            </section>

            {/* Products */}
            <section className="py-16 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <ProductGrid products={homeDecorProducts} />
                </div>
            </section>
        </>
    )
}
