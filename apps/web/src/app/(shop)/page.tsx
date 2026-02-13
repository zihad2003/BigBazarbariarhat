'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag, ArrowRight, TrendingUp, Sparkles, Zap, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const featuredProduct = {
    id: '1',
    name: 'Premium Wool Blazer',
    price: 4999,
    salePrice: 3999,
    image: '/products/blazer-1.jpg',
    rating: 4.8,
    reviews: 124,
};

const trendingProducts = [
    { id: '2', name: 'Silk Evening Dress', price: 5999, image: '/products/dress-2.jpg', rating: 4.9 },
    { id: '3', name: 'Cashmere Sweater', price: 3499, salePrice: 2799, image: '/products/sweater-1.jpg', rating: 4.7 },
];

const quickCategories = [
    { name: 'Men', href: '/men', icon: '👔', color: 'from-blue-500 to-cyan-500' },
    { name: 'Women', href: '/women', icon: '👗', color: 'from-pink-500 to-rose-500' },
    { name: 'Kids', href: '/kids', icon: '🧸', color: 'from-purple-500 to-indigo-500' },
    { name: 'Accessories', href: '/accessories', icon: '👜', color: 'from-amber-500 to-orange-500' },
];

const collections = [
    { name: 'Winter Collection', image: '/banners/winter-collection.jpg', href: '/collections/winter', tag: 'New' },
    { name: 'Flash Sale', image: '/banners/sale.jpg', href: '/sale', tag: '50% Off' },
];

const newArrivals = [
    { id: '4', name: 'Designer Leather Jacket', price: 8999, image: '/products/jacket-1.jpg', rating: 4.9 },
    { id: '5', name: 'Tailored Trousers', price: 2499, image: '/products/trousers-1.jpg', rating: 4.6 },
    { id: '6', name: 'Linen Summer Shirt', price: 1999, salePrice: 1499, image: '/products/shirt-2.jpg', rating: 4.5 },
    { id: '7', name: 'Classic Oxford Shirt', price: 1499, image: '/products/oxford-1.jpg', rating: 4.8 },
];

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-auto">
                    
                    {/* Hero Feature - Large Card (spans 2 columns, 2 rows on desktop) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-2 lg:row-span-2"
                    >
                        <Card className="relative h-full min-h-[500px] overflow-hidden border-0 shadow-lg group">
                            <div className="absolute inset-0">
                                <Image
                                    src={featuredProduct.image}
                                    alt={featuredProduct.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                            </div>
                            <div className="relative h-full flex flex-col justify-end p-6 md:p-8 text-white">
                                <span className="inline-flex items-center gap-2 w-fit px-3 py-1.5 mb-4 text-xs font-bold bg-white/20 backdrop-blur-sm rounded-full">
                                    <Sparkles className="h-3 w-3" />
                                    FEATURED
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold mb-2">{featuredProduct.name}</h2>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        <span className="text-sm">{featuredProduct.rating}</span>
                                    </div>
                                    <span className="text-sm text-gray-300">({featuredProduct.reviews} reviews)</span>
                                </div>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-2xl font-bold text-white">৳{featuredProduct.salePrice?.toLocaleString()}</span>
                                    {featuredProduct.salePrice && (
                                        <span className="text-lg text-gray-300 line-through">৳{featuredProduct.price.toLocaleString()}</span>
                                    )}
                                </div>
                                <Link href={`/products/${featuredProduct.id}`}>
                                    <Button size="lg" className="w-full md:w-auto bg-white text-black hover:bg-gray-100">
                                        Shop Now
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Quick Categories - Grid (2 columns on desktop) */}
                    {quickCategories.map((category, index) => (
                        <motion.div
                            key={category.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                            className="lg:col-span-1"
                        >
                            <Link href={category.href}>
                                <Card className={`relative h-full min-h-[140px] overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${category.color} group cursor-pointer`}>
                                    <CardContent className="p-6 h-full flex flex-col justify-between text-white">
                                        <span className="text-4xl mb-2">{category.icon}</span>
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                                            <div className="flex items-center gap-2 text-white/80 text-sm group-hover:gap-3 transition-all">
                                                <span>Shop Now</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}

                    {/* Trending Products (spans 2 columns on desktop) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="lg:col-span-2"
                    >
                        <Card className="h-full border-0 shadow-md">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp className="h-5 w-5 text-rose-500" />
                                    <h3 className="text-xl font-bold">Trending Now</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {trendingProducts.map((product) => (
                                        <Link key={product.id} href={`/products/${product.id}`}>
                                            <div className="group cursor-pointer">
                                                <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2 bg-gray-100">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    {product.salePrice && (
                                                        <span className="absolute top-2 left-2 px-2 py-1 text-xs font-bold bg-red-500 text-white rounded">
                                                            SALE
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="font-semibold text-sm mb-1 line-clamp-1">{product.name}</h4>
                                                <div className="flex items-center gap-2">
                                                    {product.salePrice ? (
                                                        <>
                                                            <span className="font-bold text-red-600 text-sm">৳{product.salePrice.toLocaleString()}</span>
                                                            <span className="text-xs text-gray-400 line-through">৳{product.price.toLocaleString()}</span>
                                                        </>
                                                    ) : (
                                                        <span className="font-bold text-sm">৳{product.price.toLocaleString()}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Flash Sale Banner (tall) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="lg:col-span-1 lg:row-span-2"
                    >
                        <Link href="/sale">
                            <Card className="relative h-full min-h-[400px] overflow-hidden border-0 shadow-lg group cursor-pointer">
                                <div className="absolute inset-0">
                                    <Image
                                        src="/banners/sale.jpg"
                                        alt="Flash Sale"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-red-900/90 via-red-900/50 to-transparent" />
                                </div>
                                <div className="relative h-full flex flex-col justify-end p-6 text-white">
                                    <Zap className="h-10 w-10 mb-3 text-yellow-400" />
                                    <h3 className="text-2xl font-bold mb-2">Flash Sale</h3>
                                    <p className="text-3xl font-black mb-2">50% OFF</p>
                                    <p className="text-sm text-white/80 mb-4">Limited time offer</p>
                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                        <span>Shop Now</span>
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </motion.div>

                    {/* Newsletter Signup */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="lg:col-span-1"
                    >
                        <Card className="h-full min-h-[140px] border-0 shadow-md bg-gradient-to-br from-indigo-500 to-purple-600">
                            <CardContent className="p-6 h-full flex flex-col justify-center text-white">
                                <Sparkles className="h-6 w-6 mb-2" />
                                <h3 className="text-lg font-bold mb-2">Join the Club</h3>
                                <p className="text-sm text-white/80 mb-3">Get exclusive offers</p>
                                <Button size="sm" className="w-full bg-white text-indigo-600 hover:bg-gray-100">
                                    Subscribe
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Collection Cards */}
                    {collections.map((collection, index) => (
                        <motion.div
                            key={collection.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                            className="lg:col-span-1"
                        >
                            <Link href={collection.href}>
                                <Card className="relative h-full min-h-[200px] overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
                                    <div className="absolute inset-0">
                                        <Image
                                            src={collection.image}
                                            alt={collection.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    </div>
                                    <div className="relative h-full flex flex-col justify-end p-4 text-white">
                                        <span className="inline-flex items-center gap-1 w-fit px-2 py-1 mb-2 text-xs font-bold bg-white/20 backdrop-blur-sm rounded-full">
                                            <Tag className="h-3 w-3" />
                                            {collection.tag}
                                        </span>
                                        <h3 className="text-lg font-bold">{collection.name}</h3>
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}

                    {/* New Arrivals Section (spans 4 columns) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1 }}
                        className="lg:col-span-4"
                    >
                        <Card className="border-0 shadow-md">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-1">New Arrivals</h3>
                                        <p className="text-gray-600 text-sm">Fresh styles just dropped</p>
                                    </div>
                                    <Link href="/new-arrivals">
                                        <Button variant="outline" className="group">
                                            View All
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {newArrivals.map((product, index) => (
                                        <ProductCard key={product.id} product={product} index={index} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Stats/Info Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.1 }}
                        className="lg:col-span-1"
                    >
                        <Card className="h-full min-h-[140px] border-0 shadow-md bg-gradient-to-br from-green-500 to-emerald-600">
                            <CardContent className="p-6 h-full flex flex-col justify-center text-white text-center">
                                <p className="text-4xl font-bold mb-1">Free</p>
                                <p className="text-sm">Shipping over ৳1000</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                        className="lg:col-span-1"
                    >
                        <Card className="h-full min-h-[140px] border-0 shadow-md bg-gradient-to-br from-orange-500 to-red-500">
                            <CardContent className="p-6 h-full flex flex-col justify-center text-white text-center">
                                <p className="text-4xl font-bold mb-1">24/7</p>
                                <p className="text-sm">Customer Support</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.3 }}
                        className="lg:col-span-1"
                    >
                        <Card className="h-full min-h-[140px] border-0 shadow-md bg-gradient-to-br from-blue-500 to-cyan-500">
                            <CardContent className="p-6 h-full flex flex-col justify-center text-white text-center">
                                <p className="text-4xl font-bold mb-1">30</p>
                                <p className="text-sm">Days Easy Returns</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.4 }}
                        className="lg:col-span-1"
                    >
                        <Card className="h-full min-h-[140px] border-0 shadow-md bg-gradient-to-br from-purple-500 to-pink-500">
                            <CardContent className="p-6 h-full flex flex-col justify-center text-white text-center">
                                <p className="text-4xl font-bold mb-1">100%</p>
                                <p className="text-sm">Secure Payment</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                </div>
            </div>
        </main>
    );
}

function ProductCard({ product, index }: { product: any; index: number }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
        >
            <div
                className="group relative cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Link href={`/products/${product.id}`}>
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg mb-2">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
                        />
                        
                        {product.salePrice && (
                            <span className="absolute top-2 left-2 px-2 py-1 text-xs font-bold bg-red-500 text-white rounded">
                                SALE
                            </span>
                        )}

                        <div className={`absolute top-2 right-2 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                                <Heart className="h-4 w-4" />
                            </button>
                        </div>

                        <div className={`absolute bottom-0 left-0 right-0 p-2 transition-transform ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
                            <Button className="w-full gap-2" size="sm">
                                <ShoppingBag className="h-4 w-4" />
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </Link>

                <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1 group-hover:text-gray-600">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-1 mb-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-gray-600">{product.rating}</span>
                </div>

                <div className="flex items-center gap-2">
                    {product.salePrice ? (
                        <>
                            <span className="font-bold text-red-600 text-sm">৳{product.salePrice.toLocaleString()}</span>
                            <span className="text-xs text-gray-400 line-through">৳{product.price.toLocaleString()}</span>
                        </>
                    ) : (
                        <span className="font-bold text-sm">৳{product.price.toLocaleString()}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
