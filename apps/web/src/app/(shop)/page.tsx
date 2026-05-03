'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Star, 
    Heart, 
    ShoppingBag, 
    ArrowRight, 
    ChevronLeft, 
    ChevronRight, 
    Truck, 
    RefreshCcw, 
    ShieldCheck, 
    Headphones, 
    Plus,
    Clock,
    Shirt,
    Sparkles,
    Trophy,
    Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguageStore, useTranslation } from '@bigbazar/shared';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/lib/stores/ui-store';
import { DeliveryInfoModal } from '@/components/shop/delivery-info-modal';
import { cn, formatPrice } from '@/lib/utils';

// --- DATA HELPERS ---
const getHeroSlides = (t: any) => [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1800&auto=format&fit=crop',
        title: t.hero.slide1Title,
        subtitle: t.hero.slide1Subtitle,
        cta: t.common.shopNow,
        href: '/women',
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1800&auto=format&fit=crop',
        title: t.hero.slide2Title,
        subtitle: t.hero.slide2Subtitle,
        cta: t.common.explore,
        href: '/men',
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1800&auto=format&fit=crop',
        title: t.hero.slide3Title,
        subtitle: t.hero.slide3Subtitle,
        cta: t.common.shopNow,
        href: '/sale',
        badge: '50% OFF',
    },
];

const getCategoriesData = (t: any) => [
    { key: 'women', name: t.categories.women, href: '/women', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=500&auto=format&fit=crop' },
    { key: 'men', name: t.categories.men, href: '/men', image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=500&auto=format&fit=crop' },
    { key: 'kids-boys', name: t.categories.kidsBoys, href: '/kids-boys', image: 'https://images.unsplash.com/photo-1519234129322-2636a0d0d885?q=80&w=500&auto=format&fit=crop' },
    { key: 'kids-girls', name: t.categories.kidsGirls, href: '/kids-girls', image: 'https://images.unsplash.com/photo-1514316454349-f50db90e2270?q=80&w=500&auto=format&fit=crop' },
    { key: 'wedding-touch', name: t.categories.weddingTouch, href: '/wedding-touch', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=500&auto=format&fit=crop' },
];

const getTrustFeatures = (t: any) => [
    { icon: Truck, title: t.features.freeShipping, desc: t.features.freeShippingDesc },
    { icon: RefreshCcw, title: t.features.easyReturns, desc: t.features.easyReturnsDesc },
    { icon: ShieldCheck, title: t.features.securePayment, desc: t.features.securePaymentDesc },
    { icon: Headphones, title: t.features.support, desc: t.features.supportDesc },
];

const newArrivals = [
    { id: '4', name: 'Designer Leather Jacket', price: 8999, image: 'https://images.unsplash.com/photo-1551028919-ac7f5db48e0d?q=80&w=800&auto=format&fit=crop', rating: 4.9 },
    { id: '5', name: 'Tailored Trousers', price: 2499, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop', rating: 4.6 },
    { id: '6', name: 'Linen Summer Shirt', price: 1999, salePrice: 1499, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop', rating: 4.5 },
    { id: '7', name: 'Classic Oxford Shirt', price: 1499, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop', rating: 4.8 },
    { id: '8', name: 'Silk Evening Dress', price: 5999, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop', rating: 4.9 },
    { id: '9', name: 'Casual Denim Jacket', price: 3499, salePrice: 2799, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop', rating: 4.7 },
    { id: '10', name: 'Floral Maxi Dress', price: 2999, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop', rating: 4.6 },
    { id: '11', name: 'Cotton Polo Shirt', price: 1299, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop', rating: 4.5 },
];

const promoBanners = [
    { name: 'Summer Edit', tag: 'New Arrival', image: 'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?q=80&w=800&auto=format&fit=crop', href: '/collections/summer' },
    { name: 'Flash Sale', tag: '50% Off', image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=800&auto=format&fit=crop', href: '/sale' },
];

// Removed hardcoded trustFeatures to use localized ones

// --- HERO SLIDER ---
function HeroSlider() {
    const t = useTranslation();
    const slides = getHeroSlides(t);
    const [current, setCurrent] = useState(0);
    const total = slides.length;

    useEffect(() => {
        const timer = setInterval(() => setCurrent(c => (c + 1) % total), 5000);
        return () => clearInterval(timer);
    }, [total]);

    return (
        <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-gray-100">
            <AnimatePresence mode="wait">
                {slides.map((slide, i) =>
                    i === current ? (
                        <motion.div
                            key={slide.id}
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className="object-cover object-top"
                                quality={95}
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20">
                                {slide.badge && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="inline-block mb-4 text-xs font-black uppercase tracking-[0.3em] bg-destructive text-white px-4 py-1.5 w-fit"
                                    >
                                        {slide.badge}
                                    </motion.span>
                                )}
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-4xl md:text-6xl lg:text-7xl font-playfair font-black text-white leading-tight mb-3"
                                >
                                    {slide.title}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-white/80 text-sm md:text-lg uppercase tracking-widest mb-8"
                                >
                                    {slide.subtitle}
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <Link href={slide.href}>
                                        <Button
                                            className="bg-white text-foreground hover:bg-destructive hover:text-white uppercase tracking-widest font-bold px-8 py-3 rounded-none text-sm transition-all duration-300"
                                        >
                                            {slide.cta}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : null
                )}
            </AnimatePresence>

            {/* Arrow Buttons */}
            <button
                onClick={() => setCurrent(c => (c - 1 + total) % total)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 hover:bg-white text-white hover:text-foreground backdrop-blur-sm flex items-center justify-center transition-all duration-200"
                aria-label="Previous"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            <button
                onClick={() => setCurrent(c => (c + 1) % total)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 hover:bg-white text-white hover:text-foreground backdrop-blur-sm flex items-center justify-center transition-all duration-200"
                aria-label="Next"
            >
                <ChevronRight className="h-5 w-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

// --- PRODUCT CARD (Minimal, Aarong-style) ---
function ProductCard({ product, index }: { product: any; index: number }) {
    const t = useTranslation();
    const [isHovered, setIsHovered] = useState(false);
    const addItem = useCartStore((state) => state.addItem);
    const { addNotification } = useUIStore();
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/products/${product.id}`}>
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                        quality={90}
                    />
                    {(product.salePrice || product.isFlashSale) && (
                        <span className="absolute top-2 left-2 bg-destructive text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 z-10 shadow-lg">
                            {product.isFlashSale ? 'Flash Sale' : 'Sale'}
                        </span>
                    )}
                    {/* Wishlist */}
                    <button
                        className={`absolute top-2 right-2 w-8 h-8 bg-white flex items-center justify-center transition-all duration-200 shadow-sm ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                        aria-label="Add to wishlist"
                    >
                        <Heart className="h-4 w-4 text-foreground hover:text-destructive transition-colors" />
                    </button>

                    {/* Quick Add */}
                    <div className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
                        <button
                            onClick={(e) => { 
                                e.preventDefault(); 
                                addItem({
                                    productId: product.id,
                                    name: product.name,
                                    price: product.salePrice ?? product.price,
                                    image: product.image,
                                    quantity: 1,
                                    stock: 100,
                                });
                                addNotification({ type: 'success', message: `${product.name} added to cart` });
                                router.push('/cart');
                            }}
                            className="w-full bg-foreground text-white text-[10px] uppercase tracking-widest font-bold py-3 flex items-center justify-center gap-2 hover:bg-destructive transition-colors"
                        >
                            <ShoppingBag className="h-3 w-3" />
                            {t.common.addToCart}
                        </button>
                    </div>
                </div>
            </Link>

            <div className="space-y-3">
                <Link href={`/products/${product.id}`}>
                    <h3 className="text-sm font-semibold text-foreground leading-snug group-hover:text-destructive transition-colors min-h-[2.5rem] line-clamp-2">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-1">({product.rating})</span>
                </div>
                <div className="flex items-center gap-2">
                    {product.salePrice ? (
                        <>
                            <span className="font-bold text-destructive text-sm">৳{product.salePrice.toLocaleString()}</span>
                            <span className="text-xs text-muted-foreground line-through">৳{product.price.toLocaleString()}</span>
                        </>
                    ) : (
                        <span className="font-bold text-foreground text-sm">৳{product.price.toLocaleString()}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// --- FLASH SALE COMPONENT ---
function FlashSaleSection() {
    const t = useTranslation();
    const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.s > 0) return { ...prev, s: prev.s - 1 };
                if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
                if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const flashProducts = [
        { id: 'f1', name: 'Raw Denim Curation Jacket', price: 12500, salePrice: 7500, rating: 4.8, isFlashSale: true, image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?q=80&w=500&auto=format&fit=crop' },
        { id: 'f2', name: 'Obsidian Wool Overcoat', price: 28000, salePrice: 15500, rating: 4.9, isFlashSale: true, image: 'https://images.unsplash.com/photo-1539533377285-b31421a7a99b?q=80&w=500&auto=format&fit=crop' },
        { id: 'f3', name: 'Silk Flow Evening Blouse', price: 9500, salePrice: 4999, rating: 4.7, isFlashSale: true, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=500&auto=format&fit=crop' },
        { id: 'f4', name: 'Handcrafted Leather Loafers', price: 18000, salePrice: 9500, rating: 5.0, isFlashSale: true, image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=500&auto=format&fit=crop' },
        { id: 'f5', name: 'Minimalist Tote - Slate', price: 8500, salePrice: 3999, rating: 4.6, isFlashSale: true, image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=500&auto=format&fit=crop' },
    ];

    return (
        <section className="bg-destructive/5 py-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
                    <div className="flex items-center gap-6">
                        <div className="bg-destructive text-white p-4 rounded-3xl shadow-xl shadow-destructive/20 animate-pulse">
                            <Clock className="h-8 w-8" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-foreground uppercase tracking-tighter leading-none mb-2">Flash Sale</h2>
                            <p className="text-destructive font-black text-xs uppercase tracking-[0.3em]">Limited Time Offer</p>
                        </div>
                    </div>
                    
                    {/* Timer */}
                    <div className="flex gap-4">
                        {[
                            { val: timeLeft.h, label: 'Hours' },
                            { val: timeLeft.m, label: 'Min' },
                            { val: timeLeft.s, label: 'Sec' }
                        ].map((t, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-white border-2 border-destructive/20 rounded-2xl flex items-center justify-center text-2xl font-black text-destructive shadow-sm">
                                    {t.val.toString().padStart(2, '0')}
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest mt-2 text-destructive/60">{t.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex overflow-x-auto gap-8 pb-12 no-scrollbar px-2 snap-x">
                    {flashProducts.map((p, i) => (
                        <div key={p.id} className="min-w-[280px] snap-center">
                            <ProductCard product={p} index={i} />
                            <div className="mt-4 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '65%' }}
                                    className="bg-destructive h-full"
                                />
                            </div>
                            <p className="text-[9px] font-black uppercase tracking-widest mt-2 text-muted-foreground flex justify-between">
                                <span>65% Reserved</span>
                                <span>12 Left</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}




// --- MAIN PAGE ---
export default function HomePage() {
    const t = useTranslation();
    const categories = getCategoriesData(t);
    const trustFeatures = getTrustFeatures(t);
    const [mounted, setMounted] = useState(false);
    const { language } = useLanguageStore();

    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;

    return (
        <main className="min-h-screen bg-white text-foreground">

            {/* 1. HERO BANNER SLIDER */}
            <HeroSlider />

            {/* 2. CATEGORY STRIP — Aarong-style square image tiles */}
            <section className="max-w-7xl mx-auto px-4 py-10 md:py-14">
                <h2 className="text-2xl md:text-3xl font-playfair font-bold text-center text-foreground mb-8 uppercase tracking-wider">
                    {t.categories.title}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link href={cat.href} className="group block text-center">
                                <div className="relative aspect-square overflow-hidden mb-3 bg-gray-100">
                                    <Image
                                        src={cat.image}
                                        alt={cat.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        quality={85}
                                    />
                                    {cat.comingSoon && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <span className="bg-yellow-400 text-yellow-900 text-[9px] font-black uppercase tracking-widest px-2 py-1">
                                                Coming Soon
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <span className={`text-xs md:text-sm font-semibold uppercase tracking-widest transition-colors ${cat.comingSoon ? 'text-muted-foreground' : 'text-foreground group-hover:text-destructive'}`}>
                                    {cat.name}
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* DIVIDER */}
            <div className="max-w-7xl mx-auto px-4"><div className="border-t border-gray-100" /></div>

            {/* 3. NEW ARRIVALS GRID */}
            <section className="max-w-7xl mx-auto px-4 py-10 md:py-14">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-playfair font-bold text-foreground uppercase tracking-wider">
                            {t.newArrivals.title}
                        </h2>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                            {t.newArrivals.subtitle}
                        </p>
                    </div>
                    <Link href="/new-arrivals" className="text-xs font-bold uppercase tracking-widest text-foreground border-b border-foreground hover:text-destructive hover:border-destructive transition-colors pb-0.5 flex items-center gap-1">
                        {t.common.viewAll}
                        <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
                    {newArrivals.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            </section>

            {/* 4. PROMO BANNERS (2-column) */}
            <section className="max-w-7xl mx-auto px-4 pb-10 md:pb-14">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {promoBanners.map((banner, i) => (
                        <Link key={i} href={banner.href} className="group block relative h-[250px] md:h-[320px] overflow-hidden">
                            <Image
                                src={banner.image}
                                alt={banner.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                quality={90}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-white/70 block mb-1">{banner.tag}</span>
                                <h3 className="text-2xl md:text-3xl font-playfair font-black">{banner.name}</h3>
                                <div className="flex items-center gap-2 mt-2 text-xs uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">
                                    <span>{t.common.shopNow}</span>
                                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 5. TRUST FEATURES BAR */}
            <section className="border-t border-b border-gray-100 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {trustFeatures.map((f, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <f.icon className="h-7 w-7 text-foreground flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-foreground uppercase tracking-wide">{f.title}</p>
                                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. FLASH SALE SECTION */}
            <FlashSaleSection />




        </main>
    );
}
