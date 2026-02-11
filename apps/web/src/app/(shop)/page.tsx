'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Sample data
const heroSlides = [
    {
        id: 1,
        title: 'Winter Collection 2026',
        subtitle: 'Embrace the Season in Style',
        description: 'Discover our premium winter essentials crafted for comfort and elegance.',
        image: '/banners/winter-collection.jpg',
        cta: { text: 'Shop Now', href: '/collections/winter' },
        gradient: 'from-blue-900/80 to-purple-900/80',
    },
    {
        id: 2,
        title: 'New Arrivals',
        subtitle: 'Fresh Styles, Bold Statements',
        description: 'Be the first to wear our latest designs from top brands.',
        image: '/banners/new-arrivals.jpg',
        cta: { text: 'Explore', href: '/new-arrivals' },
        gradient: 'from-rose-900/80 to-orange-900/80',
    },
    {
        id: 3,
        title: 'Sale Up to 50% Off',
        subtitle: 'Limited Time Offer',
        description: 'Grab your favorites before they\'re gone. Premium quality at unbeatable prices.',
        image: '/banners/sale.jpg',
        cta: { text: 'Shop Sale', href: '/sale' },
        gradient: 'from-red-900/80 to-pink-900/80',
    },
];

const categories = [
    { name: 'Men', image: '/categories/men.jpg', href: '/men', count: 1250 },
    { name: 'Women', image: '/categories/women.jpg', href: '/women', count: 1480 },
    { name: 'Kids', image: '/categories/kids.jpg', href: '/kids', count: 890 },
    { name: 'Accessories', image: '/categories/accessories.jpg', href: '/accessories', count: 560 },
];

const newArrivals = [
    { id: '1', name: 'Premium Wool Blazer', price: 4999, salePrice: 3999, image: '/products/blazer-1.jpg', rating: 4.8, reviews: 124, isNew: true },
    { id: '2', name: 'Silk Evening Dress', price: 5999, image: '/products/dress-2.jpg', rating: 4.9, reviews: 89, isNew: true },
    { id: '3', name: 'Cashmere Sweater', price: 3499, salePrice: 2799, image: '/products/sweater-1.jpg', rating: 4.7, reviews: 156, isNew: true },
    { id: '4', name: 'Designer Leather Jacket', price: 8999, image: '/products/jacket-1.jpg', rating: 4.9, reviews: 78, isNew: true },
    { id: '5', name: 'Tailored Trousers', price: 2499, image: '/products/trousers-1.jpg', rating: 4.6, reviews: 203, isNew: true },
    { id: '6', name: 'Linen Summer Shirt', price: 1999, salePrice: 1499, image: '/products/shirt-2.jpg', rating: 4.5, reviews: 312, isNew: true },
];

const bestSellers = [
    { id: '7', name: 'Classic Oxford Shirt', price: 1499, image: '/products/oxford-1.jpg', rating: 4.8, reviews: 567, sold: 1234 },
    { id: '8', name: 'Relaxed Fit Jeans', price: 2499, image: '/products/jeans-1.jpg', rating: 4.7, reviews: 432, sold: 987 },
    { id: '9', name: 'Essential Hoodie', price: 1999, image: '/products/hoodie-1.jpg', rating: 4.9, reviews: 678, sold: 1567 },
    { id: '10', name: 'Minimalist Watch', price: 3999, image: '/products/watch-1.jpg', rating: 4.8, reviews: 234, sold: 456 },
];

const brands = [
    { name: 'Zara', logo: '/brands/zara.png' },
    { name: 'H&M', logo: '/brands/hm.png' },
    { name: 'Uniqlo', logo: '/brands/uniqlo.png' },
    { name: 'Levis', logo: '/brands/levis.png' },
    { name: 'Nike', logo: '/brands/nike.png' },
    { name: 'Adidas', logo: '/brands/adidas.png' },
];

export default function HomePage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

    return (
        <main className="overflow-hidden">
            {/* Hero Section with Carousel */}
            <section ref={heroRef} className="relative h-screen">
                <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="absolute inset-0">
                    {heroSlides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} z-10`} />
                            <div className="absolute inset-0 bg-black/30 z-10" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10" />
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                        </div>
                    ))}

                    <div className="relative z-20 h-full flex items-center">
                        <div className="container mx-auto px-6 lg:px-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="max-w-2xl text-white"
                            >
                                <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-wider uppercase bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                                    {heroSlides[currentSlide].subtitle}
                                </span>
                                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6 leading-tight">
                                    {heroSlides[currentSlide].title}
                                </h1>
                                <p className="text-lg md:text-xl font-light mb-8 text-gray-200 max-w-lg">
                                    {heroSlides[currentSlide].description}
                                </p>
                                <Link href={heroSlides[currentSlide].cta.href}>
                                    <Button size="lg" className="group text-sm uppercase tracking-wider font-bold px-8 py-6 bg-white text-black hover:bg-gray-100">
                                        {heroSlides[currentSlide].cta.text}
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>

                    {/* Carousel Controls */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
                        <button
                            onClick={prevSlide}
                            className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div className="flex gap-2">
                            {heroSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'
                                        }`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={nextSlide}
                            className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Featured Categories */}
            <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
                            Shop by Category
                        </h2>
                        <p className="text-gray-600 max-w-lg mx-auto">
                            Explore our curated collections across all departments
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={category.href} className="group block relative overflow-hidden rounded-2xl aspect-[3/4]">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{category.name}</h3>
                                        <p className="text-white/70 text-sm">{category.count}+ Products</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* New Arrivals */}
            <section className="py-20 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-sm font-semibold text-rose-500 uppercase tracking-wider">Fresh Picks</span>
                            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
                                New Arrivals
                            </h2>
                        </motion.div>
                        <Link href="/new-arrivals">
                            <Button variant="outline" className="group">
                                View All
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                        {newArrivals.map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Promotional Banner */}
            <section className="py-20 px-6 lg:px-8 bg-gradient-to-r from-indigo-900 to-purple-900">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-white"
                        >
                            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-wider uppercase bg-white/10 rounded-full">
                                Limited Time Offer
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">
                                Flash Sale<br />Up to 50% Off
                            </h2>
                            <p className="text-lg text-gray-300 mb-8 max-w-md">
                                Don't miss out on incredible savings. Shop our biggest sale of the season.
                            </p>
                            <div className="flex gap-4 mb-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold">12</div>
                                    <div className="text-sm text-gray-400">Days</div>
                                </div>
                                <div className="text-3xl font-bold">:</div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold">08</div>
                                    <div className="text-sm text-gray-400">Hours</div>
                                </div>
                                <div className="text-3xl font-bold">:</div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold">45</div>
                                    <div className="text-sm text-gray-400">Mins</div>
                                </div>
                                <div className="text-3xl font-bold">:</div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold">30</div>
                                    <div className="text-sm text-gray-400">Secs</div>
                                </div>
                            </div>
                            <Link href="/sale">
                                <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                                    Shop the Sale
                                </Button>
                            </Link>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative aspect-square rounded-2xl overflow-hidden"
                        >
                            <Image
                                src="/banners/flash-sale.jpg"
                                alt="Flash Sale"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Best Sellers */}
            <section className="py-20 px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">Customer Favorites</span>
                            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
                                Best Sellers
                            </h2>
                        </motion.div>
                        <Link href="/best-sellers">
                            <Button variant="outline" className="group">
                                View All
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {bestSellers.map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Brands Section */}
            <section className="py-16 px-6 lg:px-8 border-y border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <motion.h3
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8"
                    >
                        Shop from Top Brands
                    </motion.h3>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                        {brands.map((brand, index) => (
                            <motion.div
                                key={brand.name}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
                            >
                                <Image
                                    src={brand.logo}
                                    alt={brand.name}
                                    width={120}
                                    height={60}
                                    className="object-contain"
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-20 px-6 lg:px-8 bg-black text-white">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
                            Join the Club
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                            Subscribe to our newsletter for exclusive offers, early access to sales, and style tips delivered straight to your inbox.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/40"
                            />
                            <Button size="lg" className="rounded-full px-8 bg-white text-black hover:bg-gray-100">
                                Subscribe
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Store Locator / Social */}
            <section className="py-20 px-6 lg:px-8 bg-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-2xl font-bold uppercase mb-6">Visit Our Store</h3>
                            <p className="text-gray-600 mb-6">
                                Experience our collections in person. Our flagship store offers personalized styling services and exclusive in-store offers.
                            </p>
                            <div className="aspect-video rounded-xl overflow-hidden bg-gray-300">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.0!2d91.535009!3d22.894359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDUzJzM5LjciTiA5McKwMzInMDYuMCJF!5e0!3m2!1sen!2sbd!4v1234567890"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-2xl font-bold uppercase mb-6">Stay Connected</h3>
                            <p className="text-gray-600 mb-6">
                                Follow us on social media for the latest updates, behind-the-scenes content, and community highlights.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <a
                                    href="https://www.facebook.com/profile.php?id=100063541603515"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
                                >
                                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                        <span className="text-xl">f</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold">Facebook</div>
                                        <div className="text-sm text-gray-500">Follow us</div>
                                    </div>
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white">
                                        <span className="text-xl">📷</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold">Instagram</div>
                                        <div className="text-sm text-gray-500">@bigbazar</div>
                                    </div>
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
                                >
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                                        <span className="text-xl">📱</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold">WhatsApp</div>
                                        <div className="text-sm text-gray-500">Chat with us</div>
                                    </div>
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
                                >
                                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white">
                                        <span className="text-xl">▶</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold">YouTube</div>
                                        <div className="text-sm text-gray-500">Watch videos</div>
                                    </div>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
}

// Product Card Component
function ProductCard({ product, index }: { product: any; index: number }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
        >
            <Card
                className="group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Link href={`/products/${product.id}`}>
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.isNew && (
                                <span className="px-2 py-1 text-xs font-bold bg-black text-white rounded">NEW</span>
                            )}
                            {product.salePrice && (
                                <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded">SALE</span>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                                <Heart className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Add to Cart Button */}
                        <div className={`absolute bottom-0 left-0 right-0 p-3 transition-transform ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
                            <Button className="w-full gap-2" size="sm">
                                <ShoppingBag className="h-4 w-4" />
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </Link>

                <CardContent className="p-4">
                    <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold text-sm mb-1 line-clamp-1 group-hover:text-gray-600">
                            {product.name}
                        </h3>
                    </Link>

                    <div className="flex items-center gap-1 mb-2">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-gray-600">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.reviews})</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {product.salePrice ? (
                            <>
                                <span className="font-bold text-red-600">৳{product.salePrice.toLocaleString()}</span>
                                <span className="text-sm text-gray-400 line-through">৳{product.price.toLocaleString()}</span>
                            </>
                        ) : (
                            <span className="font-bold">৳{product.price.toLocaleString()}</span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
