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
    ShieldCheck, 
    Headphones, 
    Clock,
    Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguageStore, useTranslation } from '@bigbazar/shared';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/lib/stores/ui-store';
import { cn, formatPrice } from '@/lib/utils';

// --- DATA HELPERS ---
const getHeroSlides = (t: any) => [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1800&auto=format&fit=crop',
        title: t?.hero?.slide1Title || 'New Season Collection',
        subtitle: t?.hero?.slide1Subtitle || "Women's Fashion 2026",
        cta: t?.common?.shopNow || 'Shop Now',
        href: '/products?category=women',
        videoUrl: null,
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1800&auto=format&fit=crop',
        title: t?.hero?.slide2Title || 'Premium Menswear',
        subtitle: t?.hero?.slide2Subtitle || 'Crafted for the Modern Man',
        cta: t?.common?.explore || 'Explore',
        href: '/products?category=men',
        videoUrl: null,
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1800&auto=format&fit=crop',
        title: t?.hero?.slide3Title || 'Flash Sale',
        subtitle: t?.hero?.slide3Subtitle || 'Up to 50% Off — Limited Time',
        cta: t?.common?.shopNow || 'Shop Now',
        href: '/sale',
        badge: '50% OFF',
        videoUrl: null,
    },
];

const fallbackCategoryImages: Record<string, string> = {
    'Women': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=500&auto=format&fit=crop',
    'Men': 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=500&auto=format&fit=crop',
    'Kids(Boys)': 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=500&auto=format&fit=crop',
    'Kids(Girls)': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=500&auto=format&fit=crop',
    'Wedding Touch': 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=500&auto=format&fit=crop',
};

// --- HERO SLIDER ---
function HeroSlider({ dbBanners }: { dbBanners?: any[] }) {
    const t = useTranslation();
    const slides = dbBanners && dbBanners.length > 0
        ? dbBanners.map((b) => ({
            id: b.id,
            image: b.imageDesktop,
            videoUrl: b.videoUrl || null,
            title: b.title,
            subtitle: b.subtitle || "",
            cta: b.linkText || t?.common?.shopNow || 'Shop Now',
            href: b.linkUrl || '/products',
            badge: undefined,
        }))
        : [
            {
                id: 1,
                image: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?q=80&w=1800&auto=format&fit=crop',
                title: t?.hero?.slide1Title || 'Elegance Redefined',
                subtitle: t?.hero?.slide1Subtitle || 'Discover a curated collection of artisanal sarees and designer lehengas, where heritage craftsmanship meets modern silhouettes.',
                cta: t?.common?.shopNow || 'SHOP COLLECTION',
                href: '/products?category=wedding-touch',
                badge: 'THE NEW HERITAGE',
                videoUrl: null,
            },
            {
                id: 2,
                image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop',
                title: t?.hero?.slide2Title || 'Premium Menswear',
                subtitle: t?.hero?.slide2Subtitle || 'Crafted for the Modern Man',
                cta: t?.common?.explore || 'EXPLORE COLLECTION',
                href: '/products?category=men',
                badge: 'PREMIUM MENSWEAR',
                videoUrl: null,
            },
            {
                id: 3,
                image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
                title: t?.hero?.slide3Title || 'Flash Sale',
                subtitle: t?.hero?.slide3Subtitle || 'Up to 50% Off — Limited Time',
                cta: t?.common?.shopNow || 'SHOP SALE',
                href: '/sale',
                badge: 'FLASH SALE — 50% OFF',
                videoUrl: null,
            },
        ];

    const [current, setCurrent] = useState(0);
    const total = slides.length;
    const videoRef = useRef<HTMLVideoElement>(null);
    const isVideo = !!slides[current]?.videoUrl;

    useEffect(() => {
        if (isVideo) return;
        const timer = setInterval(() => setCurrent(c => (c + 1) % total), 6000);
        return () => clearInterval(timer);
    }, [total, current, isVideo]);

    useEffect(() => {
        if (isVideo && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => {});
        }
    }, [current, isVideo]);

    const goNext = () => setCurrent(c => (c + 1) % total);
    const goPrev = () => setCurrent(c => (c - 1 + total) % total);

    return (
        <div className="relative w-full h-[65vh] md:h-[85vh] overflow-hidden bg-gray-900">
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
                            {slide.videoUrl ? (
                                <>
                                    <video
                                        ref={videoRef}
                                        src={slide.videoUrl}
                                        className="absolute inset-0 w-full h-full object-cover object-center"
                                        autoPlay
                                        muted
                                        playsInline
                                        onEnded={goNext}
                                    />
                                    <div className="absolute top-4 right-16 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full z-20">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                        Video
                                    </div>
                                </>
                            ) : (
                                <Image
                                    src={slide.image || '/placeholder.png'}
                                    alt={slide.title}
                                    fill
                                    className="object-cover object-center"
                                    quality={95}
                                    priority
                                />
                            )}
                            {/* Overlay matches the dark moody heritage feel of the reference */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
                            
                            {/* Content container - left aligned overlay */}
                            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 max-w-2xl z-20">
                                {slide.badge && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="inline-block mb-4 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-[#16A34A] bg-[#16A34A]/10 border border-[#16A34A]/20 px-3.5 py-1.5 rounded-full w-fit"
                                    >
                                        {slide.badge}
                                    </motion.span>
                                )}
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-4xl md:text-6xl font-playfair font-normal text-white leading-tight mb-4 tracking-tight"
                                >
                                    {slide.title.includes(' ') ? (
                                        <>
                                            {slide.title.substring(0, slide.title.lastIndexOf(' '))} <br />
                                            <span className="text-[#16A34A] font-bold">
                                                {slide.title.substring(slide.title.lastIndexOf(' ') + 1)}
                                            </span>
                                        </>
                                    ) : (
                                        slide.title
                                    )}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-white/80 text-xs md:text-sm mb-8 leading-relaxed max-w-md font-light"
                                >
                                    {slide.subtitle}
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <Link href={slide.href}>
                                        <button className="group inline-flex items-center gap-2 px-8 py-3.5 bg-[#1A6B3C] hover:bg-[#1A6B3C]/90 text-white font-bold uppercase tracking-widest text-[11px] transition-all duration-300 shadow-lg shadow-black/25">
                                            {slide.cta}
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : null
                )}
            </AnimatePresence>

            <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white text-white hover:text-foreground backdrop-blur-sm flex items-center justify-center transition-all duration-300 rounded-full z-30"
                aria-label="Previous"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            <button
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white text-white hover:text-foreground backdrop-blur-sm flex items-center justify-center transition-all duration-300 rounded-full z-30"
                aria-label="Next"
            >
                <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                {slides.map((slide, i) => (
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
    const { language } = useLanguageStore();
    const t = useTranslation();
    const [isHovered, setIsHovered] = useState(false);
    const addItem = useCartStore((state) => state.addItem);
    const { addNotification } = useUIStore();
    const router = useRouter();

    const firstImage = product.images?.[0];
    const resolvedImage = typeof firstImage === 'string' 
        ? firstImage 
        : (firstImage && typeof firstImage === 'object' && 'url' in firstImage 
            ? (firstImage as any).url 
            : (product.image || '/placeholder.png'));

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/products/${product.slug || product.id}`}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-gray-100 mb-3 border border-gray-100/50">
                    <Image
                        src={resolvedImage}
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
                    <button
                        className={`absolute top-2 right-2 w-8 h-8 bg-white flex items-center justify-center transition-all duration-200 shadow-sm ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                        aria-label="Add to wishlist"
                    >
                        <Heart className="h-4 w-4 text-foreground hover:text-destructive transition-colors" />
                    </button>

                    <div className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
                        <button
                            onClick={(e) => { 
                                e.preventDefault(); 
                                addItem({
                                    productId: product.id,
                                    name: product.name,
                                    price: product.salePrice ?? product.price,
                                    image: resolvedImage,
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
                <Link href={`/products/${product.slug || product.id}`}>
                    <h3 className="text-sm font-semibold text-foreground leading-snug group-hover:text-destructive transition-colors min-h-[2.5rem] line-clamp-2">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-1">({product.rating || 0})</span>
                </div>
                <div className="flex items-center gap-2">
                    {product.salePrice ? (
                        <>
                            <span className="font-bold text-destructive text-sm">{formatPrice(product.salePrice, language)}</span>
                            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price, language)}</span>
                        </>
                    ) : (
                        <span className="font-bold text-foreground text-sm">{formatPrice(product.price, language)}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// --- FLASH SALE COMPONENT ---
function FlashSaleSection({ products }: { products: any[] }) {
    const { language } = useLanguageStore();
    const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 0 });
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    useEffect(() => {
        if (!products.length) return;

        let animationFrameId: number;

        const animate = () => {
            if (scrollContainerRef.current && !isPaused) {
                const container = scrollContainerRef.current;
                container.scrollLeft += 0.75;

                if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
                    container.scrollLeft = 0;
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
        };
    }, [products, isPaused]);

    const handleTouchStart = () => {
        setIsPaused(true);
        if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    };

    const handleTouchEnd = () => {
        if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
        touchTimeoutRef.current = setTimeout(() => {
            setIsPaused(false);
        }, 3000);
    };

    if (!products.length) return null;

    return (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 my-8 md:my-16">
            <div 
                className="bg-destructive/5 py-12 px-4 md:py-16 md:px-12 rounded-[2.5rem] overflow-hidden relative border border-destructive/10"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
                    <div className="flex items-center gap-6">
                        <div className="bg-destructive text-white p-4 rounded-3xl shadow-xl shadow-destructive/20 animate-pulse">
                            <Clock className="h-8 w-8" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-foreground uppercase tracking-tighter leading-none mb-2">
                                {language === 'bn' ? 'ফ্ল্যাশ সেল' : 'Flash Sale'}
                            </h2>
                            <p className="text-destructive font-black text-xs uppercase tracking-[0.3em]">
                                {language === 'bn' ? 'সীমিত সময়ের অফার' : 'Limited Time Offer'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                        <div className="flex gap-4">
                            {[
                                { val: timeLeft.h, label: language === 'bn' ? 'ঘণ্টা' : 'Hours' },
                                { val: timeLeft.m, label: language === 'bn' ? 'মিনিট' : 'Min' },
                                { val: timeLeft.s, label: language === 'bn' ? 'সেকেন্ড' : 'Sec' }
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
                </div>

                <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 md:gap-8 pb-12 px-2 snap-x snap-mandatory scrollbar-none scroll-smooth [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {products.map((p, i) => {
                        const stockLeft = p.stock !== undefined && p.stock !== null && p.stock > 0 
                            ? p.stock 
                            : (5 + (p.id.charCodeAt(p.id.length - 1) % 15));
                        const reservedPercent = 50 + (p.id.charCodeAt(0) % 35);
                        return (
                            <div 
                                key={p.id} 
                                className="min-w-[75%] sm:min-w-[45%] md:min-w-[22%] snap-start flex-shrink-0"
                            >
                                <ProductCard product={p} index={i} />
                                <div className="mt-4 bg-gray-100 h-1 md:h-1.5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${reservedPercent}%` }}
                                        className="bg-destructive h-full"
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                    />
                                </div>
                                <p className="text-[7px] md:text-[9px] font-black uppercase tracking-widest mt-1.5 text-muted-foreground flex justify-between">
                                    <span>{language === 'bn' ? `${reservedPercent}% সংরক্ষিত` : `${reservedPercent}% Reserved`}</span>
                                    <span>{language === 'bn' ? `${stockLeft}টি বাকি` : `${stockLeft} Left`}</span>
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="flex md:hidden justify-center items-center gap-1.5 mt-2">
                    <span className="text-[9px] font-black text-destructive/40 uppercase tracking-widest animate-pulse">
                        {language === 'bn' ? 'অন্বেষণ করতে বামে/ডানে সোয়াইপ করুন' : 'Swipe Left/Right to explore'}
                    </span>
                </div>
            </div>
        </section>
    );
}

// --- HOME SKELETON ---
function HomeSkeleton() {
    return (
        <div className="bg-white min-h-screen">
            {/* 1. Hero Slider Skeleton */}
            <div className="relative w-full h-[60vh] md:h-[80vh] bg-gray-50 flex items-center justify-center">
                <Skeleton className="w-full h-full bg-gray-100/50" />
            </div>

            {/* 2. Category Strip Skeleton */}
            <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
                    <Skeleton className="h-10 w-64 bg-gray-100 mx-auto rounded-xl" />
                    <Skeleton className="h-1 w-16 bg-gray-200 mx-auto" />
                    <Skeleton className="h-4 w-80 bg-gray-100 mx-auto rounded-full" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="aspect-[3/4] w-full bg-gray-100/60 rounded-[2rem]" />
                    ))}
                </div>
            </section>

            {/* 3. New Arrivals Skeleton */}
            <section className="max-w-7xl mx-auto px-4 py-10 md:py-14">
                <div className="flex items-end justify-between mb-8">
                    <div className="space-y-3">
                        <Skeleton className="h-8 w-48 bg-gray-100 rounded-lg" />
                        <Skeleton className="h-4 w-32 bg-gray-100 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-20 bg-gray-100 rounded-full" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="aspect-[3/4] w-full bg-gray-100/60 rounded-[2rem]" />
                            <Skeleton className="h-4 w-2/3 bg-gray-100 rounded-full" />
                            <Skeleton className="h-4 w-1/3 bg-gray-100 rounded-full" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

// --- MAIN CLIENT PAGE ---
export default function HomeClient({
    newArrivals,
    flashProducts,
    categories,
    heroBanners,
    promoBanners,
}: {
    newArrivals: any[];
    flashProducts: any[];
    categories: any[];
    heroBanners: any[];
    promoBanners: any[];
}) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const { language } = useLanguageStore();
    const t = useTranslation();

    if (!mounted) {
        return <HomeSkeleton />;
    }

    return (
        <main className="min-h-screen bg-white text-foreground">
            {/* 1. HERO BANNER SLIDER */}
            <HeroSlider dbBanners={heroBanners} />

            {/* 2. CATEGORY STRIP */}
            <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-5xl font-playfair font-black text-foreground uppercase tracking-tight mb-3">
                        {t?.categories?.title || 'Shop By Category'}
                    </h2>
                    <div className="w-16 h-1 bg-destructive mx-auto mb-4" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.key}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Link href={cat.href} className="group block relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-gray-100 border border-gray-100/50 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                                    quality={85}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute inset-4 rounded-[1.5rem] border border-white/0 group-hover:border-white/20 transition-all duration-500 scale-95 group-hover:scale-100" />

                                <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col z-10">
                                    <span className="text-lg md:text-xl font-bold font-playfair uppercase tracking-wide group-hover:text-yellow-400 transition-colors duration-300">
                                        {language === 'bn' ? (
                                            cat.key === 'men' ? 'পুরুষদের' : 
                                            cat.key === 'women' ? 'মহিলাদের' : 
                                            cat.key.includes('kids') ? 'বাচ্চাদের' : 
                                            cat.key.includes('wedding') ? 'বিয়ের' : cat.name
                                        ) : cat.name}
                                    </span>
                                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-yellow-400 font-bold uppercase tracking-widest">
                                        <span>{language === 'bn' ? 'কালেকশন' : 'Explore'}</span>
                                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>

                                {cat.comingSoon && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                                        <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-none shadow-lg">
                                            {language === 'bn' ? 'শীঘ্রই আসছে' : 'Coming Soon'}
                                        </span>
                                    </div>
                                )}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Wedding Touch Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="mt-6 md:mt-8 relative w-full h-[220px] md:h-[300px] overflow-hidden rounded-[2rem] border border-[#bf953f]/30 shadow-lg hover:shadow-2xl transition-all duration-500 bg-[#120509] group"
                >
                    <Link href="/products?category=wedding-touch" className="block w-full h-full relative">
                        <Image
                            src={fallbackCategoryImages['Wedding Touch'] || 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=1200&auto=format&fit=crop'}
                            alt="Wedding Touch Collection"
                            fill
                            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                            quality={90}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1b0811]/90 via-[#0d0205]/60 to-transparent opacity-95 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-4 sm:inset-6 border border-[#bf953f]/20 rounded-[1.5rem] pointer-events-none" />
                        <div className="absolute inset-5 sm:inset-7 border-[0.5px] border-[#bf953f]/30 rounded-[1.2rem] pointer-events-none" />

                        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 w-6 h-6 border-t-[1.5px] border-l-[1.5px] border-[#bf953f] pointer-events-none" />
                        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 w-6 h-6 border-t-[1.5px] border-r-[1.5px] border-[#bf953f] pointer-events-none" />
                        <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 w-6 h-6 border-b-[1.5px] border-l-[1.5px] border-[#bf953f] pointer-events-none" />
                        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 w-6 h-6 border-b-[1.5px] border-r-[1.5px] border-[#bf953f] pointer-events-none" />

                        <div className="absolute inset-y-0 left-14 sm:left-24 right-14 sm:right-24 flex flex-col justify-center max-w-xs sm:max-w-md md:max-w-lg z-10 text-white space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[#bf953f] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] block">
                                    {language === 'bn' ? 'বিয়ের কালেকশন' : 'Wedding Collection'}
                                </span>
                                <Sparkles className="h-3 w-3 text-[#bf953f] animate-pulse" />
                            </div>

                            <h3 className="text-2xl sm:text-4xl md:text-5xl font-playfair font-normal uppercase tracking-wider leading-none">
                                {language === 'bn' ? (
                                    <>
                                        বিয়ের <br className="hidden sm:inline" />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] font-serif italic capitalize">ছোঁয়া</span>
                                    </>
                                ) : (
                                    <>
                                        Wedding <br className="hidden sm:inline" />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] font-serif italic capitalize">Touch</span>
                                    </>
                                )}
                            </h3>

                            <p className="text-xs sm:text-sm text-white/70 font-serif leading-relaxed line-clamp-2 max-w-sm font-light">
                                {language === 'bn' ? 'আপনার বিশেষ দিনের জন্য বিশেষ শাড়ি, শেরওয়ানি এবং উৎসবের পোশাক।' : 'Exclusive sarees, sherwanis, and festive wear for your special day.'}
                            </p>

                            <div className="pt-2 flex items-center gap-2 text-xs uppercase tracking-widest font-black text-[#bf953f] group-hover:text-white transition-colors duration-300">
                                <span>{language === 'bn' ? 'কালেকশন দেখুন' : 'Explore Collection'}</span>
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </section>

            <div className="max-w-7xl mx-auto px-4"><div className="border-t border-gray-100" /></div>

            {/* 3. NEW ARRIVALS GRID */}
            <section className="max-w-7xl mx-auto px-4 py-10 md:py-14">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-playfair font-bold text-foreground uppercase tracking-wider">
                            {t?.newArrivals?.title || 'New Arrivals'}
                        </h2>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                            {t?.newArrivals?.subtitle || 'Shop our latest designs'}
                        </p>
                    </div>
                    <Link href="/new-arrivals" className="text-xs font-bold uppercase tracking-widest text-foreground border-b border-foreground hover:text-destructive hover:border-destructive transition-colors pb-0.5 flex items-center gap-1">
                        {t?.common?.viewAll || 'View All'}
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
                        <Link key={banner.id || i} href={banner.linkUrl || '/shop'} className="group block relative h-[250px] md:h-[320px] overflow-hidden">
                            <Image
                                src={banner.imageDesktop || '/placeholder.png'}
                                alt={banner.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                quality={90}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-white/70 block mb-1">{banner.subtitle}</span>
                                <h3 className="text-2xl md:text-3xl font-playfair font-black">{banner.title}</h3>
                                <div className="flex items-center gap-2 mt-2 text-xs uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">
                                    <span>{banner.linkText || t?.common?.shopNow || 'Shop Now'}</span>
                                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 6. FLASH SALE SECTION */}
            <FlashSaleSection products={flashProducts} />
        </main>
    );
}
