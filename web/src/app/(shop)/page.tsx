import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductGrid } from '@/components/shop/product-grid'

// Sample products data
const featuredProducts = [
    { id: '1', name: 'Signature Tee', price: 999, image: '/products/tee-1.jpg', category: 'men' },
    { id: '2', name: 'Essential Polo', price: 1299, image: '/products/polo-1.jpg', category: 'men' },
    { id: '3', name: 'Classic Dress', price: 1899, image: '/products/dress-1.jpg', category: 'women' },
    { id: '4', name: 'Premium Shirt', price: 1499, image: '/products/shirt-1.jpg', category: 'men' },
]

export default function HomePage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 text-center max-w-3xl px-6">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6">
                        Elevated Essentials
                    </h1>
                    <p className="text-lg md:text-xl font-light mb-8 text-gray-300">
                        Premium quality basics designed for the boardroom, the beach, and everywhere in between.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/men">
                            <Button size="lg" className="text-sm uppercase tracking-wider font-bold px-8">
                                Shop Men
                            </Button>
                        </Link>
                        <Link href="/women">
                            <Button size="lg" variant="outline" className="text-sm uppercase tracking-wider font-bold px-8 border-white text-white hover:bg-white hover:text-black">
                                Shop Women
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Category Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2">
                <Link href="/men" className="relative h-[600px] group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-950" />
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 text-white z-10">
                        <h2 className="text-4xl font-bold uppercase mb-4">The Men's Shop</h2>
                        <Button variant="secondary" className="uppercase tracking-wider font-semibold">
                            Explore Now
                        </Button>
                    </div>
                </Link>
                <Link href="/women" className="relative h-[600px] group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-900 to-rose-950" />
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 text-white z-10">
                        <h2 className="text-4xl font-bold uppercase mb-4">The Women's Shop</h2>
                        <Button variant="secondary" className="uppercase tracking-wider font-semibold">
                            Explore Now
                        </Button>
                    </div>
                </Link>
            </section>

            {/* Featured Products */}
            <section className="py-20 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold uppercase text-center mb-12">
                        Trending Now
                    </h2>
                    <ProductGrid products={featuredProducts} />
                </div>
            </section>

            {/* Video Section */}
            <section className="py-20 px-6 lg:px-8 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold uppercase mb-8">
                        Process in Motion
                    </h2>
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <iframe
                            src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1338035440550507%2F&show_text=false&width=500"
                            className="w-full h-full"
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            allowFullScreen
                            title="Big Bazar Shop Video"
                        />
                    </div>
                </div>
            </section>

            {/* Connect Section */}
            <section className="py-20 px-6 lg:px-8 bg-gray-100">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold uppercase mb-8">
                        Stay Connected
                    </h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-8">
                        <a
                            href="https://www.facebook.com/profile.php?id=100063541603515"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-3 text-gray-600 hover:text-black transition-colors"
                        >
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-xl">📱</span>
                            </div>
                            <span className="text-sm font-semibold uppercase">Facebook</span>
                        </a>
                        <a
                            href="https://www.google.com/maps?q=22.894359,91.535009"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-3 text-gray-600 hover:text-black transition-colors"
                        >
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-xl">📍</span>
                            </div>
                            <span className="text-sm font-semibold uppercase">Stores</span>
                        </a>
                    </div>
                </div>
            </section>
        </>
    )
}
