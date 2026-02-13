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
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop', // Man in suit
    rating: 4.8,
    reviews: 124,
};

const trendingProducts = [
    { id: '2', name: 'Silk Evening Dress', price: 5999, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop', rating: 4.9 }, // Elegant dress
    { id: '3', name: 'Cashmere Sweater', price: 3499, salePrice: 2799, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop', rating: 4.7 }, // Sweater
];

const quickCategories = [
    { name: 'Men', href: '/men', icon: '👔', color: 'from-luxury-black-card to-luxury-black-lighter' },
    { name: 'Women', href: '/women', icon: '👗', color: 'from-luxury-black-card to-luxury-black-lighter' },
    { name: 'Kids', href: '/kids', icon: '🧸', color: 'from-luxury-black-card to-luxury-black-lighter' },
    { name: 'Accessories', href: '/accessories', icon: '👜', color: 'from-luxury-black-card to-luxury-black-lighter' },
];

const collections = [
    { name: 'Winter Collection', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop', href: '/collections/winter', tag: 'New' }, // Winter fashion
    { name: 'Flash Sale', image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=800&auto=format&fit=crop', href: '/sale', tag: '50% Off' }, // Shopping bags
];

const newArrivals = [
    { id: '4', name: 'Designer Leather Jacket', price: 8999, image: 'https://images.unsplash.com/photo-1551028919-ac7f5db48e0d?q=80&w=800&auto=format&fit=crop', rating: 4.9 }, // Leather jacket
    { id: '5', name: 'Tailored Trousers', price: 2499, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop', rating: 4.6 }, // Trousers
    { id: '6', name: 'Linen Summer Shirt', price: 1999, salePrice: 1499, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop', rating: 4.5 }, // Linen shirt
    { id: '7', name: 'Classic Oxford Shirt', price: 1499, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop', rating: 4.8 }, // Oxford shirt
];

export default function HomePage() {
    return (
        <main className="min-h-screen bg-luxury-black text-gray-200">
            <div className="container mx-auto px-4 py-8 md:py-16">
                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 auto-rows-auto">

                    {/* Hero Feature - Large Card (spans 2 columns, 2 rows on desktop) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="lg:col-span-2 lg:row-span-2"
                    >
                        <Card className="relative h-full min-h-[500px] overflow-hidden border border-luxury-black-lighter shadow-2xl group cursor-pointer bg-luxury-black-card">
                            <div className="absolute inset-0">
                                <Image
                                    src={featuredProduct.image}
                                    alt={featuredProduct.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-transparent opacity-90" />
                            </div>
                            <div className="relative h-full flex flex-col justify-end p-8 md:p-10 text-white">
                                <span className="inline-flex items-center gap-2 w-fit px-4 py-1.5 mb-4 text-xs font-bold bg-luxury-gold/20 text-luxury-gold backdrop-blur-sm border border-luxury-gold/30 uppercase tracking-widest rounded-sm">
                                    <Sparkles className="h-3 w-3" />
                                    Featured
                                </span>
                                <h2 className="text-4xl md:text-5xl font-playfair font-black mb-3 leading-tight">
                                    {featuredProduct.name}
                                </h2>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-luxury-gold text-luxury-gold" />
                                        <span className="text-sm font-medium">{featuredProduct.rating}</span>
                                    </div>
                                    <span className="text-sm text-gray-300 border-l border-gray-600 pl-4">{featuredProduct.reviews} reviews</span>
                                </div>
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="text-3xl font-playfair font-bold text-luxury-gold">৳{featuredProduct.salePrice?.toLocaleString()}</span>
                                    {featuredProduct.salePrice && (
                                        <span className="text-xl text-gray-500 line-through">৳{featuredProduct.price.toLocaleString()}</span>
                                    )}
                                </div>
                                <Link href={`/products/${featuredProduct.id}`}>
                                    <Button size="lg" className="w-full md:w-auto bg-luxury-gold hover:bg-white text-luxury-black font-bold uppercase tracking-widest px-8 rounded-sm transition-all duration-300">
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
                                <Card className={`relative h-full min-h-[160px] overflow-hidden border border-luxury-black-lighter shadow-lg hover:border-luxury-gold transition-all duration-500 bg-gradient-to-br ${category.color} group cursor-pointer`}>
                                    <div className="absolute inset-0 bg-luxury-black-card/50 group-hover:bg-luxury-black-card/0 transition-colors duration-500"></div>
                                    <CardContent className="p-6 h-full flex flex-col justify-between text-white relative z-10">
                                        <span className="text-4xl mb-2 filter drop-shadow-md">{category.icon}</span>
                                        <div>
                                            <h3 className="text-xl font-playfair font-bold mb-1 uppercase tracking-wider group-hover:text-luxury-gold transition-colors">{category.name}</h3>
                                            <div className="flex items-center gap-2 text-gray-400 text-xs group-hover:gap-3 group-hover:text-white transition-all uppercase tracking-widest">
                                                <span>Explore</span>
                                                <ArrowRight className="h-3 w-3" />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <ArrowRight className="h-5 w-5 text-luxury-gold -rotate-45" />
                                    </div>
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
                        <Card className="h-full border border-luxury-black-lighter bg-luxury-black-card shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6 border-b border-luxury-black-lighter pb-4">
                                    <div className="flex items-center gap-3">
                                        <TrendingUp className="h-5 w-5 text-luxury-gold" />
                                        <h3 className="text-xl font-playfair font-bold text-white uppercase tracking-wider">Trending</h3>
                                    </div>
                                    <Link href="/trending" className="text-xs text-luxury-gold hover:text-white uppercase tracking-widest transition-colors">View All</Link>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    {trendingProducts.map((product) => (
                                        <Link key={product.id} href={`/products/${product.id}`}>
                                            <div className="group cursor-pointer">
                                                <div className="relative aspect-[3/4] overflow-hidden mb-3 bg-luxury-black-lighter border border-luxury-black-lighter group-hover:border-luxury-gold/50 transition-colors rounded-sm">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                    {product.salePrice && (
                                                        <span className="absolute top-2 left-2 px-2 py-1 text-[10px] font-bold bg-luxury-red text-white uppercase tracking-wider rounded-sm">
                                                            Sale
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="font-playfair text-white text-md mb-1 line-clamp-1 group-hover:text-luxury-gold transition-colors">{product.name}</h4>
                                                <div className="flex items-center gap-2">
                                                    {product.salePrice ? (
                                                        <>
                                                            <span className="font-bold text-luxury-gold text-sm">৳{product.salePrice.toLocaleString()}</span>
                                                            <span className="text-xs text-gray-500 line-through">৳{product.price.toLocaleString()}</span>
                                                        </>
                                                    ) : (
                                                        <span className="font-bold text-white text-sm">৳{product.price.toLocaleString()}</span>
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
                            <Card className="relative h-full min-h-[400px] overflow-hidden border border-luxury-red bg-luxury-red shadow-2xl group cursor-pointer">
                                <div className="absolute inset-0">
                                    <Image
                                        src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop"
                                        alt="Flash Sale"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 mix-blend-multiply"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-luxury-red-accent/90" />
                                </div>
                                <div className="relative h-full flex flex-col justify-center items-center p-6 text-white text-center border-2 border-luxury-gold/30 m-2">
                                    <Zap className="h-12 w-12 mb-4 text-luxury-gold animate-pulse" />
                                    <h3 className="text-2xl font-playfair font-black mb-1 uppercase tracking-widest text-luxury-gold">Flash Sale</h3>
                                    <p className="text-5xl font-black mb-4 text-white">50%<span className="text-2xl align-top text-luxury-gold">%</span> OFF</p>
                                    <p className="text-sm text-gray-200 mb-8 uppercase tracking-widest">Limited Time Only</p>
                                    <div className="flex items-center gap-2 text-sm font-bold bg-white text-luxury-red px-6 py-2 rounded-sm hover:bg-luxury-gold hover:text-luxury-black transition-colors uppercase tracking-wider">
                                        <span>Shop Now</span>
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
                        <Card className="h-full min-h-[160px] border border-luxury-gold/50 shadow-md bg-luxury-black-card overflow-hidden relative group">
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-luxury-gold/10 rounded-full blur-2xl group-hover:bg-luxury-gold/20 transition-all duration-700"></div>
                            <CardContent className="p-8 h-full flex flex-col justify-center text-white relative z-10">
                                <Sparkles className="h-6 w-6 mb-3 text-luxury-gold" />
                                <h3 className="text-xl font-playfair font-bold mb-2">The Inner Circle</h3>
                                <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider">Join for exclusive access</p>
                                <Button size="sm" className="w-full bg-luxury-black border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black uppercase tracking-widest font-bold text-xs">
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
                                <Card className="relative h-full min-h-[200px] overflow-hidden border border-luxury-black-lighter shadow-lg hover:border-luxury-gold transition-all duration-300 group cursor-pointer bg-luxury-black-card">
                                    <div className="absolute inset-0">
                                        <Image
                                            src={collection.image}
                                            alt={collection.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/40 to-transparent" />
                                    </div>
                                    <div className="relative h-full flex flex-col justify-end p-6 text-white">
                                        <span className="inline-flex items-center gap-1 w-fit px-2 py-1 mb-2 text-[10px] font-bold bg-white/10 backdrop-blur-sm border border-white/20 uppercase tracking-wider rounded-sm">
                                            <Tag className="h-3 w-3 text-luxury-gold" />
                                            {collection.tag}
                                        </span>
                                        <h3 className="text-xl font-playfair font-bold text-white group-hover:text-luxury-gold transition-colors">{collection.name}</h3>
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
                        className="lg:col-span-4 mt-8"
                    >
                        <Card className="border-0 shadow-none bg-transparent">
                            <CardContent className="p-0">
                                <div className="flex justify-between items-end mb-10 border-b border-luxury-black-lighter pb-4">
                                    <div>
                                        <h3 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-2">New Arrivals</h3>
                                        <p className="text-luxury-gold text-sm uppercase tracking-widest">Curated for the discerning</p>
                                    </div>
                                    <Link href="/new-arrivals">
                                        <Button variant="outline" className="group border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black uppercase tracking-widest text-xs font-bold px-6">
                                            View All
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                        <Card className="h-full min-h-[140px] border border-luxury-black-lighter shadow-md bg-luxury-black-card hover:border-luxury-gold transition-colors">
                            <CardContent className="p-6 h-full flex flex-col justify-center text-center">
                                <p className="text-3xl font-playfair font-bold mb-1 text-luxury-gold">Free</p>
                                <p className="text-xs text-gray-400 uppercase tracking-widest">Shipping over ৳1000</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                        className="lg:col-span-1"
                    >
                        <Card className="h-full min-h-[140px] border border-luxury-black-lighter shadow-md bg-luxury-black-card hover:border-luxury-gold transition-colors">
                            <CardContent className="p-6 h-full flex flex-col justify-center text-center">
                                <p className="text-3xl font-playfair font-bold mb-1 text-luxury-gold">24/7</p>
                                <p className="text-xs text-gray-400 uppercase tracking-widest">Concierge Support</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.3 }}
                        className="lg:col-span-1"
                    >
                        <Card className="h-full min-h-[140px] border border-luxury-black-lighter shadow-md bg-luxury-black-card hover:border-luxury-gold transition-colors">
                            <CardContent className="p-6 h-full flex flex-col justify-center text-center">
                                <p className="text-3xl font-playfair font-bold mb-1 text-luxury-gold">30</p>
                                <p className="text-xs text-gray-400 uppercase tracking-widest">Days Easy Returns</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.4 }}
                        className="lg:col-span-1"
                    >
                        <Card className="h-full min-h-[140px] border border-luxury-black-lighter shadow-md bg-luxury-black-card hover:border-luxury-gold transition-colors">
                            <CardContent className="p-6 h-full flex flex-col justify-center text-center">
                                <p className="text-3xl font-playfair font-bold mb-1 text-luxury-gold">100%</p>
                                <p className="text-xs text-gray-400 uppercase tracking-widest">Secure Payment</p>
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
                    <div className="relative aspect-[3/4] overflow-hidden bg-luxury-black-lighter rounded-sm mb-4 border border-luxury-black-lighter group-hover:border-luxury-gold/50 transition-colors duration-500">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                        />

                        {product.salePrice && (
                            <span className="absolute top-2 left-2 px-3 py-1 text-[10px] font-bold bg-luxury-red text-white uppercase tracking-wider rounded-sm">
                                Sale
                            </span>
                        )}

                        <div className={`absolute top-2 right-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                            <button className="p-2 bg-white text-luxury-black hover:text-luxury-red rounded-full shadow-md transition-colors">
                                <Heart className="h-4 w-4" />
                            </button>
                        </div>

                        <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-luxury-black/90 to-transparent transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
                            <Button className="w-full gap-2 bg-luxury-gold text-luxury-black hover:bg-white font-bold uppercase tracking-widest text-xs rounded-sm" size="sm">
                                <ShoppingBag className="h-3 w-3" />
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </Link>

                <div className="space-y-1">
                    <Link href={`/products/${product.id}`}>
                        <h3 className="font-playfair font-bold text-white text-lg leading-tight group-hover:text-luxury-gold transition-colors duration-300">
                            {product.name}
                        </h3>
                    </Link>

                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-luxury-gold text-luxury-gold' : 'text-gray-600'}`} />
                            ))}
                        </div>
                        <span className="text-[10px] text-gray-400 ml-1">({product.rating})</span>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                        {product.salePrice ? (
                            <>
                                <span className="font-playfair font-bold text-luxury-gold text-lg">৳{product.salePrice.toLocaleString()}</span>
                                <span className="text-xs text-gray-500 line-through">৳{product.price.toLocaleString()}</span>
                            </>
                        ) : (
                            <span className="font-playfair font-bold text-white text-lg">৳{product.price.toLocaleString()}</span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
