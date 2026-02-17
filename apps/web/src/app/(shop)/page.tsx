'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Star, Heart, ShoppingBag, ArrowRight, TrendingUp, Sparkles, Zap, Tag, Crown, Gem, Award, ShieldCheck, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, LuxuryCard } from '@/components/ui/card';
import { useLanguageStore, useTranslation } from '@bigbazar/shared';

const featuredProduct = {
    id: '1',
    name: 'Premium Wool Blazer',
    price: 4999,
    salePrice: 3999,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
    reviews: 124,
    tagline: 'Timeless Elegance',
};

const trendingProducts = [
    { id: '2', name: 'Silk Evening Dress', price: 5999, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop', rating: 4.9 },
    { id: '3', name: 'Cashmere Sweater', price: 3499, salePrice: 2799, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop', rating: 4.7 },
];

const quickCategories = [
    { key: 'men', href: '/men', icon: '👔', color: 'from-luxury-black-card to-luxury-black-lighter' },
    { key: 'women', href: '/women', icon: '👗', color: 'from-luxury-black-card to-luxury-black-lighter' },
    { key: 'kids', href: '/kids', icon: '🧸', color: 'from-luxury-black-card to-luxury-black-lighter' },
    { key: 'accessories', href: '/accessories', icon: '👜', color: 'from-luxury-black-card to-luxury-black-lighter' },
];

const collections = [
    { name: 'Winter Collection', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop', href: '/collections/winter', tag: 'New Arrival', tagColor: 'badge-luxury-gold' },
    { name: 'Flash Sale', image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=800&auto=format&fit=crop', href: '/sale', tag: '50% Off', tagColor: 'badge-luxury-red' },
];

const newArrivals = [
    { id: '4', name: 'Designer Leather Jacket', price: 8999, image: 'https://images.unsplash.com/photo-1551028919-ac7f5db48e0d?q=80&w=800&auto=format&fit=crop', rating: 4.9 },
    { id: '5', name: 'Tailored Trousers', price: 2499, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop', rating: 4.6 },
    { id: '6', name: 'Linen Summer Shirt', price: 1999, salePrice: 1499, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop', rating: 4.5 },
    { id: '7', name: 'Classic Oxford Shirt', price: 1499, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop', rating: 4.8 },
];

const features = [
    { icon: Award, key: 'premiumQuality', description: 'Crafted with finest materials' },
    { icon: Crown, key: 'exclusiveDesigns', description: 'Limited edition collections' },
    { icon: Gem, key: 'luxuryExperience', description: 'White-glove service' },
    { icon: ShieldCheck, key: 'authenticGuarantee', description: '100% genuine products' },
];

// Parallax Section Component
function ParallaxSection({ children, className }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

    return (
        <motion.div ref={ref} style={{ y }} className={className}>
            {children}
        </motion.div>
    );
}

export default function HomePage() {
    const [mounted, setMounted] = useState(false);
    const { language } = useLanguageStore();
    const t = useTranslation();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <main className="min-h-screen bg-luxury-black text-gray-200">
            {/* Hero Section with Parallax */}
            <section className="relative overflow-hidden py-12 md:py-20 lg:py-28">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-luxury-gradient opacity-50" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-luxury-gold/5 to-transparent" />
                <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-luxury-red/5 to-transparent" />

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-luxury-gold rounded-full opacity-20"
                            initial={{
                                x: Math.random() * window.innerWidth,
                                y: Math.random() * window.innerHeight,
                            }}
                            animate={{
                                y: [0, -100, 0],
                                opacity: [0.2, 0.5, 0.2],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        />
                    ))}
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    {/* Hero Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center mb-16"
                    >
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="h-px w-20 bg-gradient-to-r from-transparent to-luxury-gold" />
                            <span className="text-luxury-gold text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                                <Sparkles className="h-4 w-4" />
                                {t.hero.premiumCollection}
                                <Sparkles className="h-4 w-4" />
                            </span>
                            <div className="h-px w-20 bg-gradient-to-l from-transparent to-luxury-gold" />
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-black text-white mb-6 leading-tight">
                            <span className="text-gradient-gold">{t.hero.title}</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white max-w-2xl mx-auto font-lato leading-relaxed">
                            {t.hero.subtitle}
                        </p>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="glass-luxury border-luxury-gold/20 p-6 text-center card-luxury-hover"
                            >
                                <feature.icon className="h-8 w-8 text-luxury-gold mx-auto mb-4" />
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 font-playfair">
                                    {t.features[feature.key as keyof typeof t.features]}
                                </h3>
                                <p className="text-xs text-gray-300 leading-relaxed">
                                    {t.features[feature.key + 'Desc' as keyof typeof t.features] || feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 md:py-16">
                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 auto-rows-auto">

                    {/* Hero Feature - Large Card (spans 2 columns, 2 rows on desktop) */}
                    <ParallaxSection className="lg:col-span-2 lg:row-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <Link href={`/products/${featuredProduct.id}`}>
                                <LuxuryCard variant="gold" className="relative h-full min-h-[500px] overflow-hidden group cursor-pointer">
                                    <div className="absolute inset-0">
                                        <Image
                                            src={featuredProduct.image}
                                            alt={featuredProduct.name}
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                            quality={95}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/60 to-transparent opacity-90" />
                                    </div>
                                    <div className="relative h-full flex flex-col justify-end p-8 md:p-10 text-white">
                                        <span className="inline-flex items-center gap-2 w-fit px-4 py-1.5 mb-4 text-xs font-bold bg-luxury-gold/20 text-luxury-gold backdrop-blur-sm border border-luxury-gold/30 uppercase tracking-widest rounded-sm">
                                            <Sparkles className="h-3 w-3" />
                                            {t.hero.featured}
                                        </span>
                                        <p className="text-luxury-gold/80 text-sm uppercase tracking-widest mb-2 font-lato">{featuredProduct.tagline}</p>
                                        <h2 className="text-4xl md:text-5xl font-playfair font-black mb-3 leading-tight group-hover:text-gradient-gold transition-all duration-500">
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
                                            <span className="text-3xl font-playfair font-bold text-gradient-gold">৳{featuredProduct.salePrice?.toLocaleString()}</span>
                                            {featuredProduct.salePrice && (
                                                <span className="text-xl text-gray-500 line-through decoration-luxury-red/50">৳{featuredProduct.price.toLocaleString()}</span>
                                            )}
                                        </div>
                                        <Button variant="luxury" size="lg" className="w-full md:w-auto font-bold uppercase tracking-widest px-8 rounded-sm">
                                            {t.hero.cta}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </LuxuryCard>
                            </Link>
                        </motion.div>
                    </ParallaxSection>

                    {/* Quick Categories - Grid (2 columns on desktop) */}
                    {quickCategories.map((category, index) => (
                        <motion.div
                            key={category.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                            className="lg:col-span-1"
                        >
                            <Link href={category.href}>
                                <LuxuryCard variant="glass" className={`relative h-full min-h-[160px] overflow-hidden group cursor-pointer`}>
                                    <div className="absolute inset-0 bg-gradient-to-br ${category.color} group-hover:opacity-0 transition-opacity duration-500"></div>
                                    <CardContent className="p-6 h-full flex flex-col justify-between text-white relative z-10">
                                        <span className="text-4xl mb-2 filter drop-shadow-md">{category.icon}</span>
                                        <div>
                                            <h3 className="text-xl font-playfair font-bold mb-1 uppercase tracking-wider group-hover:text-gradient-gold transition-all duration-300 text-white">{t.categories[category.key as keyof typeof t.categories] || category.key}</h3>
                                            <p className="text-xs text-gray-200 mb-2 group-hover:text-white transition-colors">{t.categories[category.key + 'Desc' as keyof typeof t.categories]}</p>
                                            <div className="flex items-center gap-2 text-luxury-gold text-xs group-hover:gap-3 transition-all uppercase tracking-widest">
                                                <span>{language === 'en' ? 'Explore' : 'অন্বেষণ করুন'}</span>
                                                <ArrowRight className="h-3 w-3" />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <ArrowRight className="h-5 w-5 text-luxury-gold -rotate-45" />
                                    </div>
                                </LuxuryCard>
                            </Link>
                        </motion.div>
                    ))}

                    {/* Trending Products (spans 2 columns on desktop) */}
                    <ParallaxSection className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <LuxuryCard variant="gold" className="h-full">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-6 border-b border-luxury-black-lighter pb-4">
                                        <div className="flex items-center gap-3">
                                            <TrendingUp className="h-5 w-5 text-luxury-gold" />
                                            <h3 className="text-xl font-playfair font-bold text-white uppercase tracking-wider">{t.trending.title}</h3>
                                        </div>
                                        <Link href="/trending" className="text-xs text-luxury-gold hover:text-white uppercase tracking-widest link-luxury transition-colors">{t.trending.viewAll}</Link>
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
                                                            className="object-cover img-luxury-zoom"
                                                            quality={90}
                                                        />
                                                        {product.salePrice && (
                                                            <span className="absolute top-2 left-2 badge-luxury badge-luxury-red">Sale</span>
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
                            </LuxuryCard>
                        </motion.div>
                    </ParallaxSection>

                    {/* Flash Sale Banner (tall) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="lg:col-span-1 lg:row-span-2"
                    >
                        <Link href="/sale">
                            <LuxuryCard variant="red" className="relative h-full min-h-[400px] overflow-hidden group cursor-pointer animate-pulse-gold">
                                <div className="absolute inset-0">
                                    <Image
                                        src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop"
                                        alt="Flash Sale"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-40 mix-blend-multiply"
                                        quality={90}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-luxury-red-accent/90" />
                                </div>
                                <div className="relative h-full flex flex-col justify-center items-center p-6 text-white text-center border-2 border-luxury-gold/20 m-2">
                                    <Zap className="h-12 w-12 mb-4 text-luxury-gold animate-pulse" />
                                    <h3 className="text-2xl font-playfair font-black mb-1 uppercase tracking-widest text-gradient-gold">Flash Sale</h3>
                                    <p className="text-5xl font-black mb-4 text-white">50%<span className="text-2xl align-top text-luxury-gold">%</span> OFF</p>
                                    <p className="text-sm text-gray-200 mb-8 uppercase tracking-widest">Limited Time Only</p>
                                    <Button variant="luxuryRed" className="w-full uppercase tracking-widest font-bold">
                                        Shop Now
                                    </Button>
                                </div>
                            </LuxuryCard>
                        </Link>
                    </motion.div>

                    {/* Newsletter Signup */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="lg:col-span-1"
                    >
                        <LuxuryCard variant="gold" className="h-full min-h-[160px] overflow-hidden relative group">
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-luxury-gold/10 rounded-full blur-2xl group-hover:bg-luxury-gold/20 transition-all duration-700"></div>
                            <CardContent className="p-8 h-full flex flex-col justify-center text-white relative z-10">
                                <Sparkles className="h-6 w-6 mb-3 text-luxury-gold" />
                                <h3 className="text-xl font-playfair font-bold mb-2">The Inner Circle</h3>
                                <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider">Join for exclusive access</p>
                                <Button variant="outline" size="sm" className="w-full uppercase tracking-widest font-bold text-xs">
                                    Subscribe
                                </Button>
                            </CardContent>
                        </LuxuryCard>
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
                                <LuxuryCard variant="gold" className="relative h-full min-h-[200px] overflow-hidden group cursor-pointer">
                                    <div className="absolute inset-0">
                                        <Image
                                            src={collection.image}
                                            alt={collection.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                                            quality={90}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/40 to-transparent" />
                                    </div>
                                    <div className="relative h-full flex flex-col justify-end p-6 text-white">
                                        <span className={`inline-flex items-center gap-1 w-fit px-2 py-1 mb-2 text-[10px] font-bold bg-white/10 backdrop-blur-sm border border-white/20 uppercase tracking-wider rounded-sm ${collection.tagColor}`}>
                                            <Tag className="h-3 w-3 text-luxury-gold" />
                                            {collection.tag}
                                        </span>
                                        <h3 className="text-xl font-playfair font-bold text-white group-hover:text-gradient-gold transition-all duration-300">{collection.name}</h3>
                                    </div>
                                </LuxuryCard>
                            </Link>
                        </motion.div>
                    ))}

                    {/* New Arrivals Section (spans 4 columns) */}
                    <ParallaxSection className="lg:col-span-4 mt-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1 }}
                        >
                            <Card className="border-0 shadow-none bg-transparent">
                                <CardContent className="p-0">
                                    <div className="flex justify-between items-end mb-10 border-b border-luxury-black-lighter pb-4">
                                        <div>
                                            <h3 className="text-3xl md:text-4xl font-playfair font-bold text-gradient-gold mb-2">{t.newArrivals.title}</h3>
                                            <p className="text-luxury-gold text-sm uppercase tracking-widest">{t.newArrivals.subtitle}</p>
                                        </div>
                                        <Link href="/new-arrivals">
                                            <Button variant="outline" className="group border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black uppercase tracking-widest text-xs font-bold px-6">
                                                {t.newArrivals.viewAll}
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
                    </ParallaxSection>

                    {/* Stats/Info Cards */}
                    {[
                        { key: 'freeShipping', value: language === 'en' ? 'Free' : 'ফ্রি', labelKey: 'freeShippingDesc' },
                        { key: 'support', value: language === 'en' ? '24/7' : '২৪/৭', labelKey: 'supportDesc' },
                        { key: 'returns', value: language === 'en' ? '30' : '৩০', labelKey: 'returnsDesc' },
                        { key: 'secure', value: language === 'en' ? '100%' : '১০০%', labelKey: 'secureDesc' }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                            className="lg:col-span-1"
                        >
                            <LuxuryCard variant="glass" className="h-full min-h-[140px] group">
                                <CardContent className="p-6 h-full flex flex-col justify-center text-center">
                                    <p className="text-3xl font-playfair font-black mb-1 text-gradient-gold group-hover:scale-110 transition-transform duration-300">
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-gray-300 uppercase tracking-widest group-hover:text-luxury-gold/80 transition-colors">
                                        {t.footer[stat.labelKey as keyof typeof t.footer]}
                                    </p>
                                </CardContent>
                            </LuxuryCard>
                        </motion.div>
                    ))}

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
                className="group relative cursor-pointer card-luxury-hover"
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
                            quality={90}
                        />

                        {product.salePrice && (
                            <span className="absolute top-2 left-2 badge-luxury badge-luxury-red">
                                Sale
                            </span>
                        )}

                        <div className={`absolute top-2 right-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                            <button className="p-2 bg-white/90 backdrop-blur-sm text-luxury-black hover:bg-luxury-red hover:text-white rounded-sm shadow-luxury transition-all duration-300">
                                <Heart className="h-4 w-4" />
                            </button>
                        </div>

                        <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-luxury-black/95 via-luxury-black/80 to-transparent transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
                            <Button className="w-full gap-2 bg-luxury-gold text-luxury-black hover:bg-white font-bold uppercase tracking-widest text-xs rounded-sm btn-luxury-glow" size="sm">
                                <ShoppingBag className="h-3 w-3" />
                                Add to Cart
                            </Button>
                        </div>

                        <div className="absolute inset-0 border-2 border-luxury-gold/0 group-hover:border-luxury-gold/30 transition-all duration-500 pointer-events-none rounded-sm" />
                    </div>
                </Link>

                <div className="space-y-1">
                    <Link href={`/products/${product.id}`}>
                        <h3 className="font-playfair font-bold text-white text-lg leading-tight group-hover:text-gradient-gold transition-all duration-300">
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
                                <span className="text-xs text-gray-500 line-through decoration-luxury-red/50">৳{product.price.toLocaleString()}</span>
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
